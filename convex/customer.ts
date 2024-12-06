import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getCustomerInfo = query({
  args: {
    userid: v.any(),
  },
  handler: async (ctx, { userid }) => {
    const membershipfind = await ctx.db.query("memberships").filter(q => q.eq(q.field("userid"), userid)).collect();
    const membershipfind = await ctx.db.query("memberships").filter(q => q.eq(q.field("userid"), userid)).collect();
    console.log(membershipfind);
    const membership = membershipfind[0];
    return membership;
    }
});
    
