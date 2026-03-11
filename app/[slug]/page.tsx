import { redirect, notFound } from "next/navigation";
import { getLink, incrementClicks } from "@/lib/kv";

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const link = await getLink(params.slug);

  if (!link) {
    notFound();
  }

  // increment clicks in background
  await incrementClicks(params.slug);

  redirect(link.url);
}
