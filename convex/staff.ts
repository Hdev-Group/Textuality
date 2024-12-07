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
