import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const updateContentStatusInternal = internalMutation({
    args: {
        _id: v.id("content"),
      status: v.string(),
    },
    handler: async (ctx, { _id, status }) => {
      return ctx.db.patch(_id, { status });
    }
  });

export const deleteAnalytics = internalMutation({
    args: { analyticsId: v.id("analytics") },
    handler: async (ctx, { analyticsId }) => {
      await ctx.db.delete(analyticsId);
    },
});
