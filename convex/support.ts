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
            staffid: [],
            priority,
            lastUpdated: Date.now(),
            responsetime: undefined,
        });
        return result;
    },
});

export const sendUserMessage = mutation({
    args: {
        ticketID: v.string(),
        message: v.string(),
        userId: v.string(),
        isStaff: v.boolean(),
    },
    handler: async (ctx, { ticketID, message, userId, isStaff }) => {
        const result = await ctx.db.insert("supportmessages", {
            ticketid: ticketID,
            message,
            userId,
            isstaff: isStaff,
        });
        return result;
    },
});

export const getMessages = query({
    args: {
        ticketID: v.any(),
    },
    handler: async (ctx, { ticketID }) => {
        const result = await ctx.db.query("supportmessages").filter(q => q.eq(q.field("ticketid"), ticketID)).collect();
        return result;
    },
});

export const selfAssignTicket = mutation({
    args: { _id: v.id("supporttickets"), staffID: v.string() },
    handler: async (ctx, { _id, staffID }) => {
        const ticket = await ctx.db.get(_id);
        if (!ticket) {
            throw new Error("Ticket not found");
        }
        const updatedStaffId = [...ticket.staffid, staffID];
        await ctx.db.patch(_id, { staffid: updatedStaffId });
    },
});