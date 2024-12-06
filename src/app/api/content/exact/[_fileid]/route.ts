import { NextResponse, NextRequest } from "next/server";
import { api } from '../../../../../../convex/_generated/api';
import { fetchMutation, fetchQuery } from "convex/nextjs";

const requestCounts = new Map();
const RATE_LIMIT = 10; 
const TIME_WINDOW = 60000;

const getAuthToken = (req: NextRequest): string | null => {
  const authorizationHeader = req.headers.get('Authorization');
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
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

  const [_, pageid] = token.split(' ');

  const _fileid = req.nextUrl.pathname.split('/').pop();
  if (!_fileid) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
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
      fetchQuery(api.apicontent.APIGetter, { id: _fileid as any }),
    ]);

    if (data.fileget?.status !== 'Published') {
      return NextResponse.json({ error: 'File is not published' }, { status: 400 });
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    );
  }
}
