import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

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
            previousauthors: [],
            authorid: lastUpdatedBy,
            updated,
            status: "Draft",
            about: "",
        });
    }
});



export const updateContentStatus = mutation({
    args: {
      _id: v.id("content"),
      status: v.string(),
      slug: v.optional(v.string()),
      about: v.optional(v.string()),
    },
    handler: async (ctx, { _id, status, about, slug }) => {
      return ctx.db.patch(_id, { status, about, slug });
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
export const changeAuthor = mutation({
    args: {
        _id: v.id("content"),
        authorid: v.string(),
        previousauthors: v.array(v.string()),
    },
    handler: async (ctx, { _id, authorid }) => {
        return ctx.db.patch(_id, { authorid });
    }
});
export const deleteContent = mutation({
    args: {
        _id: v.id("content"),
    },
    handler: async (ctx, { _id }) => {
        return ctx.db.delete(_id);
    }
});

export const schedulecontent = mutation({
    args: {
      _id: v.id("content"),
      scheduled: v.number(),
    },
    handler: async (ctx, { _id, scheduled }) => {
      // Get the current content document
      const content = await ctx.db.get(_id);
      if (!content) {
        throw new Error("Content not found");
      }
      const newScheduledFunctionId = await ctx.scheduler.runAt(
        scheduled,
        internal.jobs.updateContentStatusInternal,
        { _id: _id, status: "Published" }
      );
      
      // Update the content document with the new scheduled time and function ID
      await ctx.db.patch(_id, { 
        scheduled, 
        status: "Scheduled",
        scheduledFunctionId: newScheduledFunctionId
      });
    }
  });

  export const deleteschedule = mutation({
    args: {
      _id: v.id("content"),
    },
    handler: async (ctx, { _id }) => {
      // Get the current content document
      const content = await ctx.db.get(_id);
      if (!content) {
        throw new Error("Content not found");
      }
    if (content.scheduledFunctionId) {
        await ctx.scheduler.cancel(content.scheduledFunctionId as any);
      }
    await ctx.db.patch(_id, { 
        status: "Draft",
        scheduled: undefined,
        scheduledFunctionId: undefined
      });
    }
  });