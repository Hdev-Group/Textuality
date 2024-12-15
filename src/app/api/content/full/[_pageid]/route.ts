import { NextResponse, NextRequest } from "next/server";
import { api } from '../../../../../../convex/_generated/api';
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 200;
const BURST_LIMIT = 30;
const TIME_WINDOW = 60000;
const CACHE_TTL = 5 * 60 * 1000;
const responseCache = new Map<string, { data: any; expires: number }>();


function getCachedResponse(key: string) {
  const now = Date.now();
  const cached = responseCache.get(key);
  if (cached && cached.expires > now) {
    return cached.data;
  }
  responseCache.delete(key);
  return null;
}

function setCachedResponse(key: string, data: any) {
  const expires = Date.now() + CACHE_TTL;
  responseCache.set(key, { data, expires });
}


const getAuthToken = (req: NextRequest) => {
  const authHeader = req.headers.get('Authorization');
  return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
};

function isRateLimited(userKey: string) {
  const now = Date.now();
  const userLimit = rateLimiter.get(userKey) || { count: 0, resetTime: now + TIME_WINDOW };

  if (now > userLimit.resetTime) {
    userLimit.count = 1;
    userLimit.resetTime = now + TIME_WINDOW;
  } else if (userLimit.count >= RATE_LIMIT + BURST_LIMIT) {
    return true;
  } else {
    userLimit.count++;
  }

  rateLimiter.set(userKey, userLimit);
  return false;
}

export async function GET(req: NextRequest, { params }: { params: { _pageid: string } }): Promise<NextResponse> {
  const { _pageid: pageid } = params;
  const token = getAuthToken(req);

  if (!token) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
  }

  if (isRateLimited(token)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  if (!pageid) {
    return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
  }

  // Check the cache for a response
  const cacheKey = `pageid:${pageid}`;
  const cachedData = getCachedResponse(cacheKey);
  if (cachedData) {
    await fetchMutation(api.apicontent.pageContentSendingAPICounter, { pageid });
    return NextResponse.json({ results: cachedData });
  }

  try {
    const [counterResult, data] = await Promise.all([
      fetchMutation(api.apicontent.pageContentSendingAPICounter, { pageid }),
      fetchQuery(api.apicontent.previewAPIFull, { pageid }),
    ]);

    if (!data) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const publishedResults = data?.filter((element: any) => element.status === 'Published') || [];
    if (publishedResults.length === 0) {
      return NextResponse.json({ error: 'No published files found. Please publish a file.' }, { status: 400 });
    }
    const clerk = await clerkClient();

    // Process the data
    const uniqueAuthorIds = [...new Set(publishedResults.map((result: any) => result.authorid))];
    const userPromises = uniqueAuthorIds.map(authorId => clerk.users.getUser(authorId));
    const users = await Promise.all(userPromises);
    const userMap = new Map(users.map(user => [user.id, {
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    }]));

    const enrichedResults = publishedResults.map((result: any) => ({
      ...result,
      author: userMap.get(result.authorid) || {},
    }));

    // Cache the response
    setCachedResponse(cacheKey, enrichedResults);

    return NextResponse.json({ results: enrichedResults });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 });
  }
}