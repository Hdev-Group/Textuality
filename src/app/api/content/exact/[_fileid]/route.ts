import { NextResponse, NextRequest } from "next/server";

// this is to get the exact file id and give it back to the user
export async function GET(req: NextRequest) {
    const authorizationHeader = req.headers.get('Authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
    }
    const token = authorizationHeader.split(' ')[1];
    if (token !== 'valid-token') {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 403 });
    }
      const _fileid = req.nextUrl.pathname.split('/').pop();
      return NextResponse.json({
      _fileid,
    });
  }