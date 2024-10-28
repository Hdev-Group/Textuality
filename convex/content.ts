import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const createContent = mutation({
    args: {
        templateid: v.id("templates"),
        pageid: v.id("pages"),
        title: v.string(),
        apiref: v.string(),
        updated: v.any(),
        lastUpdatedBy: v.string(),
    },
    handler: async (ctx, { templateid, title, updated, pageid, apiref, lastUpdatedBy }) => {
        return ctx.db.insert("content", {
            pageid,
            templateid,
            title,
            apiref,
            lastUpdatedBy,
            authorid: lastUpdatedBy,
            updated,
            status: "Draft",
            content: "",
        });
    }
});

export const getContentSpecific = query({
    args: {
        _id: v.id("content"),
    },
    handler: async (ctx, { _id }) => {
        return ctx.db.get(_id);
    }
});
export const getContent = query({
    args: {
        pageid: v.string(),
    },
    handler: async (ctx, { pageid }) => {
        return ctx.db.query("content").filter(q => q.eq(q.field("pageid"), pageid)).collect();
    }
});
export const getFields = query({
    args: {
        templateid: v.string(),
    },
    handler: async (ctx, { templateid }) => {
        return ctx.db.query("fields").filter(q => q.eq(q.field("templateid"), templateid)).collect();
    }
});