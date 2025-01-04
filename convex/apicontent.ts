import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getdepartment = query({
    args: {
        _id: v.id("departments"),
    },
    handler: async (ctx, { _id }) => {
        return ctx.db.get(_id);
    },
});

export const APIGetter = query({
    args: {
        id: v.string(),
    },
    handler: async (ctx, { id }) => {
        const fileget = await ctx.db.query("content")
            .filter(q => q.or(
                q.eq(q.field("_id"), id),
                q.eq(q.field("slug"), id)
            ))
            .collect();
        
        if (fileget.length === 0) {
            throw new Error("Content not found");
        }

        const fields = await ctx.db.query("fields").filter(q => q.eq(q.field("templateid"), fileget[0].templateid)).collect();
        const fieldvalues = await ctx.db.query("fieldvalues").filter(q => q.eq(q.field("fileid"), fileget[0]._id)).collect();
        const merged = fields.map((field) => {
            const fieldvalue = fieldvalues.find((fv) => fv.fieldid === field._id);
            return {
                ...field,
                value: fieldvalue?.value, 
            };
        });

        return {
            merged,
            fileget,
        };
    },
});

export const correctAuth = query({
    args: {
        token: v.string(),
    },
    handler: async (ctx, { token }) => {
        const accesstokenfinder = await ctx.db.query("pages").filter(q => q.eq(q.field("accesstoken"), token)).collect();
        if (accesstokenfinder.length === 0) {
            return false;
        } else {
            return true;
        }
    },
});

export const correctPageID = query({     
    args: {         
      _id: v.id("pages"),
    },     
    handler: async (ctx, { _id }) => {     
    const page = await ctx.db.get(_id);
      if (!page || page.users.length === 0) {             
        return false;         
      } else {             
        return true;         
      }     
    }, 
  });

export const pageContentSendingAPICounter = mutation({
    args: {
        pageid: v.any(),
    },
    handler: async (ctx, { pageid }) => {
        // get from pagesenderdata table
        const page = await ctx.db.query("pagesenderdata").filter(q => q.eq(q.field("pageid"), pageid)).collect();
        if (page.length === 0) {
            await ctx.db.insert("pagesenderdata", {
                pageid,
                contentsendingapi: 1,
                contentmanagerapi: 0,
            });
        } else {
            await ctx.db.patch(page[0]._id, {
                contentsendingapi: page[0].contentsendingapi + 1,
            });
        }
    },
});

export const pageContentManagerAPICounter = mutation({
    args: {
        pageid: v.any(),
    },
    handler: async (ctx, { pageid }) => {
        // get from pagesenderdata table
        const page = await ctx.db.query("pagesenderdata").filter(q => q.eq(q.field("pageid"), pageid)).collect();
        if (page.length === 0) {
            await ctx.db.insert("pagesenderdata", {
                pageid,
                contentsendingapi: 0,
                contentmanagerapi: 1,
            });
        } else {
            await ctx.db.patch(page[0]._id, {
                contentmanagerapi: page[0].contentmanagerapi + 1,
            });
        }
    },
});

export const pageContentAPIGetter = query({
    args: {
        pageid: v.any(),
    },
    handler: async (ctx, { pageid }) => {
        const page = await ctx.db.query("pagesenderdata").filter(q => q.eq(q.field("pageid"), pageid)).collect();
        return page;
    },
});


export const previewAPIFull = query({
    args:{
        pageid: v.any(),
    },
    handler: async (ctx, { pageid }) => {
        const fileget = await ctx.db.query("content")
        .withIndex("bypageid", (q) => q.eq("pageid", pageid))
        .collect();
      return fileget;
    }
});

export const APIGetterFull = query({
    args: {
        _id: v.any(),
    },
    handler: async (ctx, { _id }) => {
        const fileget = await ctx.db.query("content").filter(q => q.eq(q.field("pageid"), _id)).collect();
        const templateget = await ctx.db.query("templates").filter(q => q.eq(q.field("pageid"), _id)).collect();
        if (templateget.length === 0 || fileget.length === 0) {
            throw new Error("Template or file not found");
        }
        const fields = await ctx.db.query("fields").filter(q => q.eq(q.field("templateid"), templateget[0]._id)).collect();
        const fieldvalues = await ctx.db.query("fieldvalues").filter(q => q.eq(q.field("fileid"), fileget[0]._id)).collect();
        const merged = fields.map((field) => {
            const fieldvalue = fieldvalues.find((fv) => fv.fieldid === field._id);
            return {
                ...field,
                value: fieldvalue?.value, 
            };
        });

        return {
            merged,
            fileget,
            templateget, 
        };
    },
});