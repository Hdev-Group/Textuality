import { NextResponse, NextRequest } from "next/server";
import { api } from '../../../../../convex/_generated/api';
import { fetchMutation, fetchQuery } from "convex/nextjs";

export async function GET(req: NextRequest) {
  const authorizationHeader = req.headers.get('Authorization');

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
  }
  
  const [_, token, pageid] = authorizationHeader.split(' ');

  const correctPageID = await fetchQuery(api.apicontent.correctPageID, {
    pageid: pageid as any,
  });
  if (!correctPageID) {
    return NextResponse.json({ error: 'Page ID is invalid' }, { status: 400 });
  }
  const isAuthCorrect = await fetchQuery(api.apicontent.correctAuth, {
    token: token as any,
  }
  )
  if (!isAuthCorrect) {
    return NextResponse.json({ error: 'Access token is invalid' }, { status: 401 });
  }

  const pageContentSendingAPI = await fetchMutation(api.apicontent.pageContentSendingAPICounter, {
    pageid: pageid as any,
  });
  
  try {
    await pageContentSendingAPI;
    const data = await fetchQuery(api.apicontent.APIGetterFull, {
        pageid: pageid as any,
    });
    const results = data.fileget = data.fileget.filter((element: any) => element.status === 'published');
    console.log(results);
    if (results.length === 0) {
        return NextResponse.json({ error: 'No published files found, Try making a file set to published.' }, { status: 400 });
    }

    return NextResponse.json({
        results,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 });
  }
}

// curl -X GET "http://localhost:3000/api/content/full" -H "Authorization: Bearer cpq1bow4u3gg5rl55cmknmg7m5ooflh7h8288lfaabdslgh63unwbyppv9m39mfd j978n7r29qavcf6m20fcnhfw3174tqra"