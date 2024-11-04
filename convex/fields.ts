import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const updateField = mutation({
    args: {
        fieldid: v.string(),
        value: v.string(),
        externalId: v.any(),
        fileid: v.string(),
        teamid: v.string()
    },
    handler: async (ctx, { fieldid, value, externalId, fileid, teamid }) => {
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
                fileid
            });
            return { ...existingRecord, value, externalId, fileid };
        } else {
            const newRecord = {
                fieldid,
                value,
                externalId,
                teamid,
                fileid
            };
            const insertedRecord = await ctx.db.insert("fieldvalues", newRecord);
            return insertedRecord;
        }
    }
});
