import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { LRUCache } from "lru-cache";
import { getAuth } from '@clerk/nextjs/server';
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../../convex/_generated/api";

// Define the cache entry interface
interface CacheEntry {
  userId: string;
  data: any;
}

// Create a new LRU cache instance
const cache = new LRUCache<string, CacheEntry>({
  max: 500, // maximum number of items in cache
  ttl: 1000 * 60 * 5, // items will be removed after 5 minutes
});

// Define the GET request handler
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userIdString = searchParams.get("userId");

  // Ensure Clerk middleware is in place
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized. You are not logged in.' }, { status: 401 });
  }

  if (!userIdString) {
    return NextResponse.json({ error: "Invalid or missing userId parameter" }, { status: 400 });
  }

  // Split the userIdString if there are multiple user IDs
  const userIds = userIdString.split(',').map(id => id.trim());

  // Ensure there is at least one valid userId
  if (userIds.length === 0) {
    return NextResponse.json({ error: "No userIds provided" }, { status: 400 });
  }

  try {
    // Fetch the pages data
    const fetchStaff = await fetchQuery(api.staff.getStaff, { staffId: userId });
    console.log(fetchStaff);
    // If the user is not in the same project, return unauthorized
    if (fetchStaff.length === 0) {
      return NextResponse.json({ error: 'Unauthorized. You are not in the same project as this user. You are unable to see this data.' }, { status: 401 });
    }

    // Store user data
    const usersData = [];
    const clerk = await clerkClient();
    for (const requestedUserId of userIds) {
      // Check if user data is in cache
      if (cache.has(requestedUserId)) {
        const cachedUser = cache.get(requestedUserId);
        if (cachedUser) {
          const { firstName, lastName, id, imageUrl, emailAddresses } = cachedUser.data;
          usersData.push({ firstName, lastName, id, imageUrl, emailAddresses: emailAddresses[0].emailAddress });
        }
      } else {
        // Fetch user data from Clerk API
        const user = await clerk.users.getUser(requestedUserId);

        // Store user data in cache
        cache.set(requestedUserId, { userId: requestedUserId, data: user });

        const { firstName, lastName, id, imageUrl, emailAddresses } = user;
        usersData.push({ firstName, lastName, id, imageUrl, emailAddresses: emailAddresses[0].emailAddress });
      }
    }

    // Return the data for all requested users
    return NextResponse.json({ users: usersData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Error fetching user data" }, { status: 500 });
  }
}
