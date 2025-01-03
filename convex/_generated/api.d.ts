/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as analytics from "../analytics.js";
import type * as apicontent from "../apicontent.js";
import type * as blogs from "../blogs.js";
import type * as comments from "../comments.js";
import type * as content from "../content.js";
import type * as customer from "../customer.js";
import type * as department from "../department.js";
import type * as fields from "../fields.js";
import type * as http from "../http.js";
import type * as jobs from "../jobs.js";
import type * as message from "../message.js";
import type * as page from "../page.js";
import type * as payments from "../payments.js";
import type * as staff from "../staff.js";
import type * as support from "../support.js";
import type * as template from "../template.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  apicontent: typeof apicontent;
  blogs: typeof blogs;
  comments: typeof comments;
  content: typeof content;
  customer: typeof customer;
  department: typeof department;
  fields: typeof fields;
  http: typeof http;
  jobs: typeof jobs;
  message: typeof message;
  page: typeof page;
  payments: typeof payments;
  staff: typeof staff;
  support: typeof support;
  template: typeof template;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
