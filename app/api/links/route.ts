import { NextRequest, NextResponse } from "next/server";
import { getAllLinks } from "@/lib/kv";

export const dynamic = "force-dynamic"
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const links = await getAllLinks(limit);

    return NextResponse.json({ links });
  } catch (error) {
    console.error("List links error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
