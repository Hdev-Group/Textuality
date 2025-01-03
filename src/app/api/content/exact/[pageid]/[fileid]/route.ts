import { NextResponse, NextRequest } from "next/server";
import { api } from '../../../../../../../convex/_generated/api';
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

const requestCounts = new Map();
const RATE_LIMIT = 10; // Maximum 10 requests
const TIME_WINDOW = 60000; // 1 minute in milliseconds

const responseCache = new Map<string, { data: any; expires: number; userMap: any }>();
const CACHE_TTL = 30 * 60 * 1000; // Cache responses for 30 minutes

const getAuthToken = (req: NextRequest): string | null => {
  const authorizationHeader = req.headers.get('Authorization');
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authorizationHeader.split(' ')[1];
};

function isRateLimited(token: string) {
  const now = Date.now();

  if (!requestCounts.has(token)) {
    requestCounts.set(token, []);
  }

  const timestamps = requestCounts.get(token);
  requestCounts.set(token, timestamps.filter((timestamp: number) => now - timestamp <= TIME_WINDOW));

  if (timestamps.length >= RATE_LIMIT) {
    return true;
  }

  timestamps.push(now);
  return false;
}

// Get cached response if available
function getCachedResponse(key: string) {
  const now = Date.now();
  const cached = responseCache.get(key);
  if (cached && cached.expires > now) {
    return { data: cached.data, userMap: cached.userMap };
  }
  responseCache.delete(key);
  return null;
}

// Set a new response in the cache
function setCachedResponse(key: string, data: any, userMap: any) {
  const expires = Date.now() + CACHE_TTL;
  responseCache.set(key, { data, expires, userMap });
}

export async function GET(req: NextRequest) {
  const token = getAuthToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
  }

  if (isRateLimited(token)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const pathSegments = req.nextUrl.pathname.split('/');
  const fileid = pathSegments.pop();
  const pageid = pathSegments.pop();

  if (!pageid || !fileid) {
    return NextResponse.json({ error: 'Page ID and File ID are required' }, { status: 400 });
  }

  const cacheKey = `pageid:${pageid}_fileid:${fileid}`;
  const cachedResponse = getCachedResponse(cacheKey);

  if (cachedResponse) {
    await fetchMutation(api.apicontent.pageContentSendingAPICounter, { pageid });
    return NextResponse.json({ data: cachedResponse.data, author: cachedResponse.userMap });
  }

  try {
    const [correctPageID, isAuthCorrect] = await Promise.all([
      fetchQuery(api.apicontent.correctPageID, { _id: pageid as any }),
      fetchQuery(api.apicontent.correctAuth, { token }),
    ]);

    if (!correctPageID) {
      return NextResponse.json({ error: 'Page ID is invalid' }, { status: 400 });
    }
    if (!isAuthCorrect) {
      return NextResponse.json({ error: 'Access token is invalid' }, { status: 401 });
    }

    const clerk = await clerkClient();

    const [_, data] = await Promise.all([
      fetchMutation(api.apicontent.pageContentSendingAPICounter, { pageid }),
      fetchQuery(api.apicontent.APIGetter, { id: fileid as any }),
    ]);

    // get author id
    let userMap = null;
    try {
      if (data.fileget?.[0]?.authorid && !data.fileget[0].authorid.startsWith('user_')) {
        // its a department
        const user = fetchQuery(api.apicontent.getdepartment, { _id: data.fileget[0].authorid as any });
        userMap = {
          firstName: (await user).departmentname ,
          imageUrl: null,
          type: 'department',
        };
      } else {
        const user = await clerk.users.getUser(data.fileget?.[0]?.authorid);
        userMap = {
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          type: 'user',
        };
      }

    } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    if (data.fileget[0]?.status !== 'Published') {
      return NextResponse.json({ error: 'File is not published' }, { status: 400 });
    }

    // Cache the response
    setCachedResponse(cacheKey, data, userMap);

    return NextResponse.json({ data, author: userMap });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    );
  }
}
