import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const createAnalytics = mutation({
  args: {
    pageid: v.string(),
    dateString: v.string(),
    pageviews: v.number(),
  },
  handler: async (ctx, { pageid, dateString, pageviews }) => {
    const date = new Date(dateString);

    // Calculate the day of the week (e.g., "Monday")
    const day = date.toLocaleString("en-US", { weekday: "long" });

    // Calculate the ISO week (2025-W01 format)
    const year = date.getFullYear();
    const week = `${year}-W${String(Math.ceil((date.getDate() - 1) / 7) + 1).padStart(2, '0')}`;

    // Calculate the month (e.g., "2025-01")
    const month = date.toLocaleString("en-US", { month: "long", year: "numeric" });

    // Check if an entry already exists for this pageid and date
    const existingAnalytics = await ctx.db
      .query("analytics")
      .filter(q => q.eq(q.field("pageid"), pageid) && q.eq(q.field("date"), dateString))
      .first();

    let analyticsId;

    if (existingAnalytics) {
      // Update the existing analytics entry
      analyticsId = existingAnalytics._id;
      await ctx.db.patch(analyticsId, { pageviews });
    } else {
      // Insert a new analytics entry
      analyticsId = await ctx.db.insert("analytics", {
        pageid,
        date: dateString,
        day,
        week,
        month,
        pageviews,
      });

      // Schedule deletion after one month
      const oneMonthLater = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000);
      await ctx.scheduler.runAfter(
        oneMonthLater.getTime() - Date.now(),
        internal.jobs.deleteAnalytics,
        { analyticsId }
      );
    }

    return analyticsId;
  },
});

export const getAnalytics = query({
  args: {
    pageid: v.string(),
  },
  handler: async (ctx, { pageid }) => {
    const analytics = await ctx.db.query("analytics").filter(q => q.eq(q.field("pageid"), pageid)).collect();
    return analytics;
  },
});