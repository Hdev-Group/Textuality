import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createDepartment = mutation({
    args: {
        departmentname: v.string(),
        departmentdescription: v.string(),
        isLive: v.boolean(),
        pageid: v.any(),
    },
    handler: async (ctx, { departmentname, departmentdescription, isLive, pageid }) => {
        const department = await ctx.db.insert("departments", {
            departmentname,
            departmentdescription,
            isLive,
            pageid,
        });
        return department;
    }
});

export const getDepartments = query({
    args: {
        pageid: v.any(),
    },
    handler: async (ctx, { pageid }) => {
        const result = await ctx.db.query("departments").filter(q => q.eq(q.field("pageid"), pageid)).collect();
        return result;
    }
});