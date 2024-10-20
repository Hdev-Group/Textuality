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

export const getExactTemplate = query({
    args: {
        pageid: v.any(),
        _id: v.any(),
    },
    handler: async (ctx, { pageid, _id }) => {
        const result = await ctx.db.query("templates")
            .filter(q => q.eq(q.field("pageid"), pageid))
            .filter(q => q.eq(q.field("_id"), _id))
            .collect();
        return result;
    },
});

export const addField = mutation({
    args: {
        templateid: v.any(),
        fieldname: v.string(),
        type: v.string(),
        reference: v.any(),
        fieldposition: v.number(),
    },
    handler: async (ctx, { templateid, fieldname, type, reference, fieldposition }) => {
        const field = await ctx.db.insert("fields", {
            templateid,
            fieldname,
            type,
            reference,
            fieldposition
        });
        const template = await ctx.db.get(templateid);
        if(template && 'fields' in template) {
            await ctx.db.patch(templateid, {
                fields: template.fields + 1,
            });
        }
        return field;
    },
});

export const getFields = query({
    args: {
        templateid: v.any(),
    },
    handler: async (ctx, { templateid }) => {
        const result = await ctx.db.query("fields").filter(q => q.eq(q.field("templateid"), templateid)).collect();
        return result;
    },
});
export const deleteField = mutation({
    args: {
        fieldid: v.any(),
        templateid: v.any(),
    },
    handler: async (ctx, { fieldid, templateid }) => {
        await ctx.db.delete(fieldid);
        const template = await ctx.db.get(templateid);
        if(template && 'fields' in template) {
            await ctx.db.patch(templateid, {
                fields: template.fields - 1,
            });
        }
    }
});

export const updateField = mutation({
    args: {
        fieldid: v.any(),
        fieldname: v.string(),
        type: v.string(),
        reference: v.any(),
        fieldposition: v.number(),
    },
    handler: async (ctx, { fieldid, fieldname, type, reference, fieldposition }) => {
        await ctx.db.patch(fieldid, {
            fieldname,
            type,
            reference,
            fieldposition,
        });
    },
});