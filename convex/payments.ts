import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const successfulPayment = mutation({
    args: {
        userid: v.string(),
        sessionId: v.string(),
        stripeid: v.string(),
        subscriptionid: v.string(),
        membershiptype: v.string(),
        subscriptionStatus: v.string(),
        status: v.string(),
    },
    handler: async (ctx, { userid, sessionId, subscriptionStatus, stripeid, subscriptionid, status, membershiptype }) => {
        const membership = await ctx.db.insert("memberships", {
            userid,
            sessionId,
            stripeid,
            subscriptionid,
            membershiptype,
            subscriptionStatus,
            cancellationDate: null,
            status
        });
        return membership;
    },
});
