import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=usd&include_24hr_change=true";
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
    }
    const data = (await res.json()) as Record<
      string,
      { usd?: number; usd_24h_change?: number }
    >;

    const prices = [
      { symbol: "BTC", id: "bitcoin" },
      { symbol: "ETH", id: "ethereum" },
      { symbol: "SOL", id: "solana" },
      { symbol: "BNB", id: "binancecoin" },
    ]
      .map((x) => ({
        symbol: x.symbol as "BTC" | "ETH" | "SOL" | "BNB",
        priceUsd: Number(data[x.id]?.usd ?? NaN),
        change24h:
          typeof data[x.id]?.usd_24h_change === "number"
            ? Number(data[x.id].usd_24h_change)
            : null,
      }))
      .filter((x) => Number.isFinite(x.priceUsd));

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      prices,
    });
  } catch {
    return NextResponse.json({ error: "price fetch failed" }, { status: 500 });
  }
}
