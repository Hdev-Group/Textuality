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

export const subscriptionCanceled = mutation({
    args: {
        subscriptionId: v.string(),
        status: v.string(),
    },
    handler: async (ctx, { subscriptionId, status }) => {
        const subscription = await ctx.db.patch("memberships", {
            subscriptionId,
            subscriptionStatus: status,
            cancellationDate: new Date(),
        });
        return subscription;
    },
});

export const subscriptionExpired = mutation({
    args: {
        subscriptionId: v.string(),
        status: v.string(),
    },
    handler: async (ctx, { subscriptionId, status }) => {
        const subscription = await ctx.db.patch("memberships", {
            subscriptionId,
            subscriptionStatus: status,
            cancellationDate: new Date(),
        });
        return subscription;
    },
});

export const subscriptionDeleted = mutation({
    args: {
        subscriptionId: v.string(),
    },
    handler: async (ctx, { subscriptionId }) => {
        const subscription = await ctx.db.patch("memberships", {
            subscriptionId,
            subscriptionStatus: "deleted",
            cancellationDate: new Date(),
        });
        return subscription;
    },
});

export const paymentFailed = mutation({
    args: {
        subscriptionId: v.string(),
        invoiceId: v.string(),
    },
    handler: async (ctx, { subscriptionId, invoiceId }) => {
        const subscription = await ctx.db.patch("memberships", {
            subscriptionId,
            subscriptionStatus: "payment_failed",
            cancellationDate: new Date(),
        });
        return subscription;
    },
});