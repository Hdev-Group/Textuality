import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
users: defineTable({
    name: v.string(),
    picture: v.any(),
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
pages: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    users: v.array(v.string()),
}).index("bytitle", ["title"]),
roles: defineTable({
    externalId: v.string(),
    pageid: v.string(),
    permissions: v.array(v.string()),
}).index("byexternalId", ["externalId"]),
blogs: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    authorid: v.string(),
    collaborators: v.array(v.string()),
    tags: v.array(v.string()),
    published: v.boolean(),
}).index("byauthorid", ["authorid"]),

});