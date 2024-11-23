import { NextResponse, NextRequest } from "next/server";
import { api } from '../../../../../../convex/_generated/api';
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
  const _fileid = req.nextUrl.pathname.split('/').pop();
  console.log(_fileid);
  if (!_fileid) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
  }
  const pageContentSendingAPI = await fetchMutation(api.apicontent.pageContentSendingAPICounter, {
    pageid: pageid as any,
  });
  try {
    await pageContentSendingAPI;
    const data = await fetchQuery(api.apicontent.APIGetter, {
      id: _fileid as any,
    });
    if (data.fileget.status !== 'published') {
      return NextResponse.json({ error: 'File is not published' }, { status: 400 });
    }
    console.log(data);

    return NextResponse.json({
      data,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 });
  }
}

// curl -X GET "http://localhost:3000/api/content/exact/k17756dchx554rp0zgt0x7gr85751ffq" -H "Authorization: Bearer cpq1bow4u3gg5rl55cmknmg7m5ooflh7h8288lfaabdslgh63unwbyppv9m39mfd j978n7r29qavcf6m20fcnhfw3174tqra"