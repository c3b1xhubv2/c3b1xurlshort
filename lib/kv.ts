import { kv } from "@vercel/kv";

export interface LinkData {
  url: string;
  slug: string;
  createdAt: number;
  clicks: number;
}

export async function createLink(url: string, customSlug?: string): Promise<LinkData> {
  // dynamic import to avoid build issues
  const { nanoid } = await import("nanoid");
  const slug = customSlug || nanoid(6);

  // check if slug exists
  const existing = await kv.get<LinkData>(`link:${slug}`);
  if (existing) {
    throw new Error("Slug already taken");
  }

  const linkData: LinkData = {
    url,
    slug,
    createdAt: Date.now(),
    clicks: 0,
  };

  await kv.set(`link:${slug}`, linkData);

  // add to list for dashboard
  await kv.lpush("links:all", slug);

  return linkData;
}

export async function getLink(slug: string): Promise<LinkData | null> {
  return kv.get<LinkData>(`link:${slug}`);
}

export async function incrementClicks(slug: string): Promise<void> {
  const link = await kv.get<LinkData>(`link:${slug}`);
  if (link) {
    link.clicks += 1;
    await kv.set(`link:${slug}`, link);
  }
}

export async function getAllLinks(limit = 20): Promise<LinkData[]> {
  const slugs = await kv.lrange<string>("links:all", 0, limit - 1);
  const links: LinkData[] = [];
  for (const slug of slugs) {
    const link = await kv.get<LinkData>(`link:${slug}`);
    if (link) links.push(link);
  }
  return links;
}
