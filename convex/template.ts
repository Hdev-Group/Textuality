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
        description: v.string(),
        reference: v.any(),
        fieldposition: v.number(),
    },
    handler: async (ctx, { templateid, description, fieldname, type, reference, fieldposition }) => {
        const field = await ctx.db.insert("fields", {
            templateid,
            fieldname,
            description,
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
        fieldid: v.id("fields"),
        fieldname: v.string(),
        templateid: v.id("templates"),
        type: v.string(),
        lastUpdatedBy: v.string(),
        description: v.optional(v.string()),
        reference: v.any(),
        fieldposition: v.number(),
    },
    handler: async (ctx, { fieldid, templateid, lastUpdatedBy, fieldname, description, type, reference, fieldposition }) => {
        await ctx.db.patch(fieldid, {
            fieldname,
            type,
            reference,
            description,
            fieldposition,
        });
        await ctx.db.patch(templateid, {
            lastUpdatedBy, 
        });
    },
});
export const remove = mutation({
    args: {
        _id: v.id("templates"),
    },
    handler: async (ctx, { _id }) => {
        const maintemplate = ctx.db.delete(_id);
        const fields = await ctx.db.query("fields").filter(q => q.eq(q.field("templateid"), _id)).collect();
        fields.forEach(async (field) => {
            await ctx.db.delete(field._id);
        }, []);
        const content = await ctx.db.query("content").filter(q => q.eq(q.field("templateid"), _id)).collect();
        content.forEach(async (content) => {
            await ctx.db.delete(content._id);
        }, []);
        const comments = await ctx.db.query("comments").filter(q => q.eq(q.field("templateid"), _id)).collect();
        comments.forEach(async (comment) => {
            await ctx.db.delete(comment._id);
        }, []);
        const aichat = await ctx.db.query("aichat").filter(q => q.eq(q.field("templateid"), _id)).collect();
        aichat.forEach(async (chat) => {
            await ctx.db.delete(chat._id);
        }, []);

        return maintemplate;
    },
});