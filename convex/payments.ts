import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const successfulPayment = mutation({
    args: {
        userid: v.string(),
        sessionId: v.string(),
        stripeid: v.string(),
        subscriptionid: v.string(),
        membershiptype: v.string(),
        status: v.string(),
    },
    handler: async (ctx, { userid, sessionId, stripeid, subscriptionid, status, membershiptype }) => {
        const membership = await ctx.db.insert("memberships", {
            userid,
            sessionId,
            stripeid,
            subscriptionid,
            membershiptype,
            status
        });
        return membership;
    },
});
