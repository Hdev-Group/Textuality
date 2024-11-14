import { NextResponse, NextRequest } from "next/server";
import { api } from "../../../../../convex/_generated/api"; // Ensure this is the correct path for your project

// Helper function to fetch file data (you need to adjust this based on your data source)
async function fetchFile(fileId: string, accessToken: string, api: string) {
  // You can modify this logic to fetch from a database or external API
  const response = await fetch(`${api}/files/${fileId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch file');
  }

  return response.json(); 
}

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const domain = req.headers.get('domain');
  const fileId = req.nextUrl.searchParams.get('fileId');
  const api = req.nextUrl.searchParams.get('api');

  if (domain !== process.env.DOMAIN) {
    return NextResponse.json({ error: "Unauthorized - Invalid domain" }, { status: 401 });
  }
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized - Missing access token" }, { status: 401 });
  }
  if (!fileId || !api) {
    return NextResponse.json({ error: "FileId and API are required" }, { status: 400 });
  }

  try {
    const fileData = await fetchFile(fileId, accessToken, api);

    return NextResponse.json({ fileData });
  } catch (error) {
    return NextResponse.json({ error: `Error fetching file: ${error.message}` }, { status: 500 });
  }
}