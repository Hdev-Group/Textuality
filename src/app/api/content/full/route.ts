import { NextResponse, NextRequest } from "next/server";
import { api } from '../../../../../convex/_generated/api';
import { fetchMutation, fetchQuery } from "convex/nextjs";

export async function GET(req: NextRequest) {
  const authorizationHeader = req.headers.get('Authorization');
  console.log('Request received at:', new Date().toISOString());

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
  }

  const [_, token, pageid] = authorizationHeader.split(' ');

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

    console.log('Response sent at:', new Date().toISOString());
    return NextResponse.json({ results });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    );
  }
}
// curl -X GET "http://localhost:3000/api/content/full" -H "Authorization: Bearer cpq1bow4u3gg5rl55cmknmg7m5ooflh7h8288lfaabdslgh63unwbyppv9m39mfd j978n7r29qavcf6m20fcnhfw3174tqra"