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
}).index("byexternalandpageid", ["externalId", "pageid"]).index("byexternalId", ["externalId"]),
blogs: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    authorid: v.string(),
    collaborators: v.array(v.string()),
    tags: v.array(v.string()),
    published: v.boolean(),
}).index("byauthorid", ["authorid"]),
invites: defineTable({
    externalId: v.string(),
    pageId: v.string(),
    role: v.string(),
    email: v.string(),
}).index("byexternalId", ["externalId"]).index("bypageId", ["pageId"]),
templates: defineTable({
    pageid: v.string(),
    title: v.string(),
    apiref: v.string(),
    lastUpdatedBy: v.string(),
    fields: v.number(),
}).index("bypageid", ["pageid"]),
fields: defineTable({
    templateid: v.string(),
    fieldname: v.string(),
    type: v.string(),
    description: v.optional(v.string()),
    reference: v.string(),
    fieldposition: v.any(),
}).index("bytemplateid", ["templateid"]),
content: defineTable({
    pageid: v.string(),
    templateid: v.string(),
    title: v.string(),
    apiref: v.string(),
    authorid: v.string(),
    lastUpdatedBy: v.string(),
    status: v.string(),
    content: v.string(),
    updated: v.any(),
}).index("bytemplateid", ["templateid"]),
comments: defineTable({
    contentid: v.string(),
    authorid: v.string(),
    comment: v.string(),
    updated: v.any(),
}).index("bycontentid", ["contentid"]),
aichat: defineTable({
    question: v.string(),
    answer: v.string(),
    externalId: v.string(),
}),
});