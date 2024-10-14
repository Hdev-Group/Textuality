import { v } from "convex/values";
import { query } from "./_generated/server";

export const getBlogs = query({
    args: { authorid: v.string() },
    handler: async (ctx, { authorid }) => {
        return ctx.db.query("blogs")
            .withIndex("byauthorid", q => q.eq("authorid", authorid))
            .collect();
    },
});