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
    accesstoken: v.string(),
}).index("bytitle", ["title"]).index("byusers", ["users"]),
roles: defineTable({
    externalId: v.string(),
    pageid: v.string(),
    permissions: v.array(v.string()),
}).index("byexternalandpageid", ["externalId", "pageid"]).index("byexternalId", ["externalId"]).index("bypageid", ["pageid"]),
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
    description: v.string(),
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
    fieldappearance: v.any(),
}).index("bytemplateid", ["templateid"]),
fieldvalues: defineTable({
    fieldid: v.string(),
    value: v.any(),
    externalId: v.string(),
    teamid: v.string(),
    fileid: v.string(),
}).index("byfieldid", ["fieldid"]),
content: defineTable({
    pageid: v.string(),
    templateid: v.string(),
    title: v.string(),
    apiref: v.string(),
    authorid: v.string(),
    previousauthors: v.array(v.string()),
    lastUpdatedBy: v.string(),
    status: v.string(),
    content: v.string(),
    updated: v.any(),
}).index("bytemplateid", ["templateid"]).index("bypageid", ["pageid"]),
comments: defineTable({
    contentid: v.string(),
    authorid: v.string(),
    comment: v.string(),
    updated: v.any(),
    templateid: v.string(),
}).index("bycontentid", ["contentid"]),
aichat: defineTable({
    question: v.string(),
    answer: v.string(),
    externalId: v.string(),
    templateid: v.string(),
}),
componenteditor: defineTable({
    templateid: v.string(),
    componentid: v.string(),
    componentname: v.string(),
    componenttype: v.string(),
    componentposition: v.any(),
    componentdata: v.any(),
}).index("bytemplateid", ["templateid"]),
departments: defineTable({
    departmentname: v.string(),
    departmentdescription: v.string(),
    isLive: v.boolean(),
    pageid: v.any(),
}).index("bydepartmentname", ["departmentname"]),
messages: defineTable({
    message: v.string(),
    authorid: v.string(),
    contentid: v.string(),
    pageid: v.string(),
    updated: v.any(),
}),
lockedfields: defineTable({
    fieldid: v.string(),
    fileid: v.string(),
    teamid: v.string(),
    locked: v.boolean(),
    userpfp: v.any(),
    userid: v.string(),
}).index("byfieldid", ["fieldid"]),
memberships: defineTable({
    userid: v.string(),
    membershiptype: v.string(),
    sessionId: v.string(),
    stripeid: v.string(),
    subscriptionid: v.string(),
    subscriptionStatus: v.string(),
    cancellationDate: v.any(),
    status: v.string(),
}).index("bystripeid", ["stripeid"]),
supporttickets: defineTable({
    title: v.string(),
    content: v.string(),
    userId: v.string(),
    status: v.string(),
    updated: v.any(),
    department: v.string(),
    staffid: v.string(),
    priority: v.string(),
}),
supportmessages: defineTable({
    ticketid: v.string(),
    message: v.string(),
    userId: v.string(),
    isstaff: v.boolean(),
    updated: v.any(),
}),
});