import {v} from "convex/values"
import { mutation, query } from "./_generated/server"

export const sendMessage = mutation({
    args: {
        message: v.string(),
        authorid: v.string(),
        pageid: v.string(),
        contentid: v.string(),
        updated: v.number(),
    },
    handler: async (ctx, { message, authorid, pageid, updated, contentid }) => {
        const msg = await ctx.db.insert("messages", {
            message,
            authorid,
            pageid,
            contentid,
            updated,
        });
        return msg;
    },
});
export const getMessages = query({
    args: {
        pageid: v.string(),
        contentid: v.string(),
    },
    handler: async (ctx, { pageid, contentid }) => {
        const result = await ctx.db.query("messages")
            .filter(q => q.eq(q.field("pageid"), pageid))
            .filter(q => q.eq(q.field("contentid"), contentid))
            .collect();
        return result;
    },
});