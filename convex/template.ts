import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        pageid: v.any(),
        title: v.string(),
        apiref: v.string(),
        lastUpdatedBy: v.string(),
    },
    handler: async (ctx, { pageid, title, apiref, lastUpdatedBy }) => {
        const page = await ctx.db.insert("templates", {
            pageid,
            title,
            apiref,
            lastUpdatedBy,
            fields: 0,
        });
        return page;
    },
});

export const getTemplates = query({
    args: {
        pageid: v.any(),
    },
    handler: async (ctx, { pageid }) => {
        const result = await ctx.db.query("templates").filter(q => q.eq(q.field("pageid"), pageid)).collect();
        return result;
    },
});