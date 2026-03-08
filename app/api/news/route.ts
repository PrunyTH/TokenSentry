import { NextResponse } from "next/server";

type MessariNewsItem = {
  id: string;
  title: string;
  url: string;
  published_at: string;
  author: { name: string } | null;
  tags: { name: string }[];
};

export async function GET() {
  try {
    const res = await fetch(
      "https://data.messari.io/api/v1/news?limit=25",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error("upstream unavailable");
    const data = (await res.json()) as { data: MessariNewsItem[] };
    const items = (data.data ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      source: item.author?.name ?? "Messari",
      publishedAt: item.published_at,
      tags: (item.tags ?? []).slice(0, 2).map((t) => t.name),
    }));
    return NextResponse.json({ items, updatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "news unavailable" }, { status: 502 });
  }
}
