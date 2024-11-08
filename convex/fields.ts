import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const updateField = mutation({
    args: {
        fieldid: v.string(),
        value: v.string(),
        externalId: v.any(),
        fileid: v.string(),
        teamid: v.string(),
        updated: v.any()
    },
    handler: async (ctx, { fieldid, value, externalId, fileid, teamid, updated }) => {
        const existingRecord = await ctx.db.query("fieldvalues")
            .filter(q => q.and(
                q.eq(q.field("fieldid"), fieldid),
                q.eq(q.field("teamid"), teamid)
            ))
            .first();
        if (existingRecord) {
            await ctx.db.patch(existingRecord._id, {
                value,
                externalId,
                fileid,
            });
            const itemId: Id<"content"> = fileid as Id<"content">
            await ctx.db.patch(itemId, { updated });
            return { ...existingRecord, value, externalId, fileid };
        } else {
            const newRecord = {
                fieldid,
                value,
                externalId,
                teamid,
                fileid,
            };
            const insertedRecord = await ctx.db.insert("fieldvalues", newRecord);
            return insertedRecord;
        }
    }
});

export const getFieldValues = query({
    args: {
        fileid: v.any()
    },
    handler: async (ctx, { fileid }) => {
        const results = await ctx.db.query("fieldvalues")
        .filter(
            q => q.and(
                q.eq(q.field("fileid"), fileid)
            )
        ).collect();
        return results;
    }
});