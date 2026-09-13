import { NextRequest, NextResponse } from "next/server";
import { createLink } from "@/lib/kv";

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export const dynamic = "force-dynamic"
export async function POST(req: NextRequest) {
  try {
    const { url, customSlug } = await req.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "Please provide a valid URL (must start with http:// or https://)" },
        { status: 400 }
      );
    }

    if (customSlug && !/^[a-z0-9-]{2,20}$/.test(customSlug)) {
      return NextResponse.json(
        { error: "Custom slug must be 2-20 characters, lowercase letters, numbers and hyphens only" },
        { status: 400 }
      );
    }

    const link = await createLink(url, customSlug);
    const baseUrl = req.headers.get("origin") || req.nextUrl.origin;

    return NextResponse.json({
      slug: link.slug,
      url: link.url,
      shortUrl: `${baseUrl}/${link.slug}`,
      clicks: link.clicks,
      createdAt: link.createdAt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An error occurred";

    if (message === "Slug already taken") {
      return NextResponse.json({ error: "That custom slug is already taken. Try another one." }, { status: 409 });
    }

    console.error("Shorten error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
