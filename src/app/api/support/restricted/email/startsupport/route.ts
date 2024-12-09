import { testMail } from "../../../../../../service/aws-ses";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");
    const secretToken = process.env.SECURE_TOKEN;
    if (authHeader !== `Bearer ${secretToken}`) {
        console.warn("Unauthorized access attempt detected.");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }    
    const body = await req.json();
    const result = await testMail(body);
    return NextResponse.json(result);
}
