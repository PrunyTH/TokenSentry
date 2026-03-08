import { NextResponse } from "next/server";

type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
};

function parseRSS(xml: string, source: string, limit = 25): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    const block = match[1];
    const title = (
      block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ??
      block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""
    ).trim()
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"');

    const link = (
      block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ??
      block.match(/<guid isPermaLink="true">([\s\S]*?)<\/guid>/)?.[1] ?? ""
    ).trim();

    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";

    if (title && link) {
      items.push({
        id: link,
        title,
        url: link,
        source,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      });
    }
  }
  return items;
}

export async function GET() {
  try {
    const res = await fetch("https://decrypt.co/feed", {
      next: { revalidate: 300 },
      headers: { "User-Agent": "TokenSentry/1.0 news aggregator" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = parseRSS(xml, "Decrypt");
    return NextResponse.json({ items, updatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "news unavailable" }, { status: 502 });
  }
}
