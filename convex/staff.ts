import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
        staffId: v.string(),
    },
    handler: async (ctx, {staffId}) => {
        const result = await ctx.db.query("staffDB").filter(q => q.eq(q.field("staffId"), staffId)).collect();
        return result;
    },
});