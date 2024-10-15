import { internalMutation, mutation, query, QueryCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      externalId: data.id,
      picture: data.image_url,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}
export const getUserById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await userByExternalId(ctx
    , id);
  },
});
export const getUsersAndRoles = query({
  args: {
    pageId: v.string(),
    externalId: v.any(),
  },
  handler: async (ctx, {pageId, externalId}) => {
    const users = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
      .collect();
    const roles = await ctx.db.query("roles")
      .withIndex("byexternalandpageid", (q) => q.eq("externalId", externalId).eq("pageid", pageId))
      .collect();
    return { users, roles };
  },
});
export const updateRole = mutation({
  args: {
    externalId: v.string(),
    pageid: v.string(),
    permissions: v.array(v.any()),
  },
  handler: async (ctx, { externalId, pageid, permissions }) => {
    const role = await ctx.db
      .query("roles")
      .withIndex("byexternalandpageid", (q) => q.eq("externalId", externalId).eq("pageid", pageid))
      .unique();

    if (role !== null) {
      await ctx.db.patch(role._id, { permissions });
    } else {
      console.warn(
        `Can't update role, there is none for externalId: ${externalId} and pageid: ${pageid}`,
      );
    }
  },
});