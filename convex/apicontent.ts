import { v, Validator } from "convex/values";
import { query } from "./_generated/server";

export const APIGetter = query({
  args: {
    id: v.id("content"),
  },
  handler: async (ctx, { id }) => {
    const fileget = await ctx.db.get(id);
    const templateget = await ctx.db.query("templates").filter(q => q.eq(q.field("pageid"), fileget?.pageid)).collect();
    const fields = await ctx.db.query("fields").filter(q => q.eq(q.field("templateid"), fileget?.templateid)).collect();
    const fieldvalues = await ctx.db.query("fieldvalues").filter(q => q.eq(q.field("fileid"), id)).collect();
    const merged = fields.map((field) => {
      const fieldvalue = fieldvalues.find((fv) => fv.fieldid === field._id);
      return {
        ...field,
        value: fieldvalue?.value, 
      };
    });

    return {
      merged,
      fileget,
      templateget, 
    };
  },
});

export const correctAuth = query({
    args: {
        token: v.string(),
    },
    handler: async (ctx, { token }) => {
        const accesstokenfinder = await ctx.db.query("pages").filter(q => q.eq(q.field("accesstoken"), token)).collect();
        if (accesstokenfinder.length === 0) {
            return false;
        } else {
            return true;
        }
    },
});