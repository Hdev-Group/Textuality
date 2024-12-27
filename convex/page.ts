import { v, Validator } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        category: v.string(),
        userid: v.string(),
    },
    handler: async (ctx, { title, content, category, userid }) => {
        const page = await ctx.db.insert("pages", {
            title,
            content,
            category,
            users: [userid],
            accesstoken: Array(64).fill(null).map(() => Math.random().toString(36).charAt(2)).join(''),
        });
        await ctx.db.insert("roles", {
            externalId: userid,
            pageid: page, 
            permissions: ["owner"]
        });
    },
});
export const getPages = query({
    args: {},
    handler: async (ctx) => {
        const result = ctx.db.query("pages").collect();
        return result;
    },
});

export const getPremiumPages = query({
    args: {
        userid: v.string(),
    },
    handler: async (ctx, { userid }) => {
        const result = ctx.db.query("memberships")
        .withIndex("byuserid", q => q.eq("userid", userid))
        .collect();
        return result;
    },
  });

export const getPage = query({
  args: {
    _id: v.id("pages"),
  },
  handler: async (ctx, { _id }) => {
    return ctx.db.get(_id);
  },
});

export const updatePage = mutation({
  args: {
    _id: v.id("pages"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { _id, title, content }) => {
    await ctx.db.patch(_id, { title, content });
  },
});

export const inviteUser = mutation({
  args: {
    externalId: v.string(),
    pageId: v.id("pages"),
    role: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { externalId, pageId, role, email }) => {
    const invite = await ctx.db.insert("invites", {
      externalId,
      pageId,
      role,
      email,
    });
    return invite;
  }
});
export const getInvites = query({
  args: {
    externalId: v.string(),
  },
  handler: async (ctx, { externalId }) => {
    return ctx.db.query("invites")
    .withIndex("byexternalId", q => q.eq("externalId", externalId))
    .collect();
  },
});
export const getPageInvites = query({
  args: {
    pageId: v.string(),
  },
  handler: async (ctx, { pageId }) => {
    return ctx.db.query("invites")
    .withIndex("bypageId", q => q.eq("pageId", pageId))
    .collect();
  },
});
export const cancelInvite = mutation({
  args: {
    _id: v.optional(v.id("invites")),
  },
  handler: async (ctx, { _id }) => {
    if (!_id) {
      throw new Error("Missing required field: _id");
    }
    await ctx.db.delete(_id);
  }
});
export const getExactPage = query({
  args: {
    _id: v.id("pages"),
  },
  handler: async (ctx, { _id }) => {
    return ctx.db.get(_id);
  },
});
export const acceptInvite = mutation({
  args: {
    _id: v.id("invites"),
    externalId: v.string(),
    pageId: v.id("pages"),
    role: v.string(),
  },
  handler: async (ctx, { _id, externalId, pageId, role }) => {
    await ctx.db.insert("roles", {
      externalId: externalId,
      pageid: pageId, 
      permissions: [role]
    });

    const page = await ctx.db.get(pageId);
    const currentUsers = page?.users ?? [];
    const updatedUsers = [...currentUsers, externalId];
    // Using the patch method for updating the page document
    await ctx.db.patch(pageId, { users: updatedUsers });

    await ctx.db.delete(_id);
  }
});

export const getRoledetail = query({
  args: {
    externalId: v.string(),
    pageId: v.optional(v.any()),
  },
  handler: async (ctx, { externalId, pageId }) => {
    return ctx.db.query("roles")
    .withIndex("byexternalandpageid", q => q.eq("externalId", externalId).eq("pageid", pageId))
    .collect();
  },
});
export const getPageRoles = query({
  args: {
    pageId: v.id("pages"),
  },
  handler: async (ctx, { pageId }) => {
    return ctx.db.query("roles")
    .withIndex("bypageid", q => q.eq("pageid", pageId))
    .collect();
  },
});
export const removeUser = mutation({
  args: {
    externalId: v.string(),
    pageId: v.id("pages"),
  },
  handler: async (ctx, { externalId, pageId }) => {
    const role = await ctx.db.query("roles")
    .withIndex("byexternalandpageid", q => q.eq("externalId", externalId).eq("pageid", pageId))
    .collect();
    await ctx.db.delete(role[0]._id);
    const page = await ctx.db.get(pageId);
    const currentUsers = page?.users ?? [];
    const updatedUsers = currentUsers.filter((user: string) => user !== externalId);
    await ctx.db.patch(pageId, { users: updatedUsers });
  },
});

export const getPageSpecific = query({
  args: {
    userid: v.string(),
  },
  handler: async (ctx, { userid }) => {
    const allPages = await ctx.db.query("pages").collect();
    return allPages.filter((page: any) => page.users.includes(userid));
  },
});

export const getPageDetails = query({
  args: {
    _id: v.id("pages"),
  },
  handler: async (ctx, { _id }) => {
    // we need to get page details like total users, total invites, then for templates total templates then content total content
    const page = await ctx.db.get(_id);
    const users = page?.users ?? [];
    const invites = await ctx.db.query("invites")
    .withIndex("bypageId", q => q.eq("pageId", _id))
    .collect();

    const templates = await ctx.db.query("templates")
    .withIndex("bypageid", q => q.eq("pageid", _id))
    .collect();

    const content = await ctx.db.query("content")
    .withIndex("bypageid", q => q.eq("pageid", _id))
    .collect();

    return {
      users: users.length,
      invites: invites.length,
      templates: templates.length,
      content: content.length,
    }
  },
});

export const deletePage = mutation({
  args: {
    _id: v.id("pages"),
  },
  handler: async (ctx, { _id }) => {
    const roles = await ctx.db.query("roles")
      .withIndex("bypageid", q => q.eq("pageid", _id))
      .collect();
    for (const role of roles) {
      await ctx.db.delete(role._id);
    }

    const invites = await ctx.db.query("invites")
      .withIndex("bypageId", q => q.eq("pageId", _id))
      .collect();
    for (const invite of invites) {
      await ctx.db.delete(invite._id);
    }

    const templates = await ctx.db.query("templates")
      .withIndex("bypageid", q => q.eq("pageid", _id))
      .collect();
    for (const template of templates) {
      await ctx.db.delete(template._id);
    }

    const content = await ctx.db.query("content")
      .withIndex("bypageid", q => q.eq("pageid", _id))
      .collect();
    for (const item of content) {
      await ctx.db.delete(item._id);
    }

    const fields = await ctx.db.query("fields")
      .withIndex("bytemplateid", q => q.eq("templateid", _id))
      .collect();
    for (const field of fields) {
      await ctx.db.delete(field._id);
    }

    const fieldvalues = await ctx.db.query("fieldvalues")
      .withIndex("byteamid", q => q.eq("teamid", _id))
      .collect();
    for (const fieldvalue of fieldvalues) {
      await ctx.db.delete(fieldvalue._id);
    }

    const comments = await ctx.db.query("comments")
      .withIndex("bypageid", q => q.eq("pageid", _id))
      .collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    const departments = await ctx.db.query("departments")
      .withIndex("bypageid", q => q.eq("pageid", _id))
      .collect();
    for (const department of departments) {
      await ctx.db.delete(department._id);
    }

    await ctx.db.delete(_id);
  },
});