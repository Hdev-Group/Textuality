import { NextResponse, NextRequest } from "next/server";
import { api } from '../../../../../convex/_generated/api';
import { fetchMutation, fetchQuery } from "convex/nextjs";

// In-memory request tracking
const requestCounts = new Map();
const RATE_LIMIT = 200; 
const BURST_LIMIT = 30;
const TIME_WINDOW = 60000;

// Helper to extract user token
const getAuthToken = (req: NextRequest) => {
  const authorizationHeader = req.headers.get('Authorization');
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }
  return authorizationHeader.split(' ')[1];
};

function isRateLimited(userKey: string) {
  const now = Date.now();

  if (!requestCounts.has(userKey)) {
    requestCounts.set(userKey, []);
  }

  const timestamps = requestCounts.get(userKey);
  requestCounts.set(userKey, timestamps.filter((timestamp: number) => now - timestamp <= TIME_WINDOW));

  if (timestamps.length >= RATE_LIMIT + BURST_LIMIT) {
    return true;
  }

  timestamps.push(now);
  return false;
}

export async function GET(req: NextRequest) {
  const token = getAuthToken(req);

  if (!token) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
  }

  const userKey = token; 


  if (isRateLimited(userKey)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const pageid = req.nextUrl.pathname.split('/').pop(); 

  if (!pageid) {
    return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
  }

  try {
    const [correctPageID, isAuthCorrect] = await Promise.all([
      fetchQuery(api.apicontent.correctPageID, { pageid }),
      fetchQuery(api.apicontent.correctAuth, { token }),
    ]);

    if (!correctPageID) {
      return NextResponse.json({ error: 'Page ID is invalid' }, { status: 400 });
    }
    if (!isAuthCorrect) {
      return NextResponse.json({ error: 'Access token is invalid' }, { status: 401 });
    }

    const [_, data] = await Promise.all([
      fetchMutation(api.apicontent.pageContentSendingAPICounter, { pageid }),
      fetchQuery(api.apicontent.APIGetterFull, { pageid }),
    ]);

    const results = data.fileget?.filter((element: any) => element.status === 'Published') || [];

    if (results.length === 0) {
      return NextResponse.json({ error: 'No published files found. Please publish a file.' }, { status: 400 });
    }

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    );
  }
}
