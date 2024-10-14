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