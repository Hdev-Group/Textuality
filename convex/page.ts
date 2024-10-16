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
            users: [userid]
        });
        await ctx.db.insert("roles", {
            externalId: userid,
            pageid: page, // Access the id property directly
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
export const getPage = query({
  args: {
    _id: v.id("pages"),
  },
  handler: async (ctx, { _id }) => {
    return ctx.db.get(_id);
  },
  });
export const getRole = query({
  args: {
    externalId: v.string(),
  },
  handler: async (ctx, { externalId }) => {
    return ctx.db.query("roles")
    .withIndex("byexternalId", q => q.eq("externalId", externalId))
    .collect();
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