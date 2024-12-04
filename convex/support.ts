import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTickets = query({
    args: {
        userId: v.any(),
    },
    handler: async (ctx, { userId }) => {
        const result = await ctx.db.query("supporttickets").filter(q => q.eq(q.field("userId"), userId)).collect();
        return result;
    },
});

export const getTicketsbyID = query({
    args: {
        _id: v.any(),
    },
    handler: async (ctx, { _id }) => {
        const result = await ctx.db.query("supporttickets").filter(q => q.eq(q.field("_id"), _id)).collect();
        return result;
    },
});

export const createTicket = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        userId: v.string(),
        priority: v.string(),
        pageid: v.string(),
    },
    handler: async (ctx, { userId, title, content, priority, pageid }) => {
        const result = await ctx.db.insert("supporttickets", {
            title,
            content,
            userId,
            pageid,
            status: "open",
            updated: Date.now(),
            department: "general",
            staffid: "",
            priority,
            lastUpdated: Date.now(),
        });
        return result;
    },
});