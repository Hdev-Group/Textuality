import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const successfulPayment = mutation({
    args: {
      userid: v.string(),
      sessionId: v.string(),
      stripeid: v.string(),
      productid: v.string(),
      subscriptionid: v.string(),
      membershiptype: v.string(),
      subscriptionStatus: v.string(),
    },
    handler: async (ctx, { userid, sessionId, stripeid, productid, subscriptionid, membershiptype, subscriptionStatus }) => {
      await ctx.db.insert("memberships", {
        userid,
        sessionId,
        stripeid,
        productid,
        subscriptionid,
        membershiptype,
        subscriptionStatus,
        status: "active", 
        cancellationDate: null,  
      });
    }
  });

  export const subscriptionUpdated = mutation({
    args: {
        subscriptionId: v.string(),
        oldPlanId: v.optional(v.string()),
        newPlanId: v.string(),
        status: v.string(),
        cancellationDate: v.optional(v.any()),
    },
    handler: async (ctx, { subscriptionId, oldPlanId, cancellationDate, newPlanId, status }) => {
        // Find the subscription in the table by subscriptionId
        const membership = await ctx.db.query("memberships").filter(q => q.eq(q.field("subscriptionid"), subscriptionId)).first();
        if (membership) {
            // Update the subscription details when the plan changes
            await ctx.db.patch(membership._id, {
                subscriptionStatus: status,
                membershiptype: newPlanId,
                cancellationDate
            });
        }
    }
});

export const subscriptionCanceled = mutation({
    args: {
        subscriptionId: v.string(),
        status: v.string(),
        cancellationDate: v.any(),
    },
    handler: async (ctx, { subscriptionId, status, cancellationDate }) => {
        // Find the subscription in the table by subscriptionId
        const membership = await ctx.db.query("memberships").filter(q => q.eq(q.field("subscriptionid"), subscriptionId)).first();
        if (membership) {
           // Update the membership status and set the cancellation date
           await ctx.db.patch(membership._id, {
               subscriptionStatus: status,
               cancellationDate,  // Set the cancellation date to when it was canceled
               status: "canceled", // Set the status to "canceled"
           });
       }  
    }  
});