import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const add = mutation({
  args: v.object({
    fileid: v.string(),
    comment: v.object({
      text: v.string(),
      start: v.number(),
      end: v.number(),
    }),
    userid: v.string(),
  }),
  handler: async (ctx, args) => {
    await ctx.db.insert('exactcomments', {
      fileid: args.fileid,
      comment: args.comment,
      userid: args.userid,
    });
  },
});

export const getComments = query({
  args: { fileid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('exactcomments')
      .filter((q) => q.eq(q.field('fileid'), args.fileid))
      .collect();
  },
});

