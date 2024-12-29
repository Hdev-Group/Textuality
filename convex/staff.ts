import { v } from "convex/values";
import { query } from "./_generated/server";

export const getTickets = query({
    args: {
    },
    handler: async (ctx) => {
        const result = await ctx.db.query("supporttickets").collect();
        return result;
    },
});

export const getRecentActivity = query({
    args: {
    },
    handler: async (ctx) => {
        const result = await ctx.db.query("supportlogs").collect();
        return result;
    },
});
export const getStaff = query({
    args: {
      staffIds: v.array(v.string()),
    },
    handler: async (ctx, { staffIds }) => {
      const result = await ctx.db
        .query("staffDB")
        .filter((q) => q.or(...staffIds.map(id => q.eq(q.field("staffId"), id))))
        .collect();
      return result;
    },
  });
