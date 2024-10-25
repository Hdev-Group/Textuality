import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from '@clerk/nextjs/server';

// Create a cache object to store the user data
const userCache = new Map<string, any>();

export async function GET(request: NextRequest) {
  // before we do that lets check if the user is authenticated
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ error: "Invalid userEmail" }, { status: 400 });
  }
  const clerk = await clerkClient();

  try {
    // Use the Clerk Backend API to fetch users by email
    const response = await clerk.users.getUserList({
      emailAddress: [userEmail],
    });

    // Ensure response contains `data` and it's an array
    if (!response || !Array.isArray(response.data)) {
      console.error("Unexpected API response format:", response);
      return NextResponse.json({ error: "Unexpected API response format" }, { status: 500 });
    }

    // Extract users from the `data` field
    const users = response.data;

    // Check if no users were found
    if (users.length === 0) {
      console.error(`No users found for email: ${userEmail}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Assuming we want the first user that matches the email
    const user = users[0];

    if (!user) {
      console.error("User is null or undefined after fetching.");
      return NextResponse.json({ error: "User data is not available" }, { status: 500 });
    }

    // Cache the user data if needed
    userCache.set(user.id, user);

    // Return only the desired fields
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      EmailAddress: user.emailAddresses[0]?.emailAddress || "N/A", 
      id: user.id,
      imageUrl: user.imageUrl
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Error fetching user data" }, { status: 500 });
  }
}