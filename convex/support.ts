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