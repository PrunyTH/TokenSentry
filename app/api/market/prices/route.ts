import { NextResponse } from "next/server";

const coingeckoBase = process.env.COINGECKO_BASE_URL ?? "https://api.coingecko.com/api/v3";

export async function GET() {
  try {
    const url = new URL(`${coingeckoBase}/coins/markets`);
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("ids", "bitcoin,ethereum,solana,binancecoin");
    url.searchParams.set("sparkline", "true");
    url.searchParams.set("price_change_percentage", "24h");

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
    }
    const data = (await res.json()) as Array<{
      id?: string;
      current_price?: number;
      price_change_percentage_24h_in_currency?: number;
    }>;

    const byId = new Map(data.map((row) => [row.id, row]));

    const prices = [
      { symbol: "BTC", id: "bitcoin" },
      { symbol: "ETH", id: "ethereum" },
      { symbol: "SOL", id: "solana" },
      { symbol: "BNB", id: "binancecoin" },
    ]
      .map((x) => ({
        symbol: x.symbol as "BTC" | "ETH" | "SOL" | "BNB",
        priceUsd: Number(byId.get(x.id)?.current_price ?? NaN),
        change24h:
          typeof byId.get(x.id)?.price_change_percentage_24h_in_currency === "number"
            ? Number(byId.get(x.id)?.price_change_percentage_24h_in_currency)
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
