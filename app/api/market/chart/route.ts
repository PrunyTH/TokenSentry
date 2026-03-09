import { NextRequest, NextResponse } from "next/server";

const coingeckoBase = process.env.COINGECKO_BASE_URL ?? "https://api.coingecko.com/api/v3";

const ASSETS = {
  BTC: { id: "bitcoin", label: "Bitcoin" },
  ETH: { id: "ethereum", label: "Ethereum" },
  SOL: { id: "solana", label: "Solana" },
  BNB: { id: "binancecoin", label: "BNB" },
} as const;

const ALLOWED_DAYS = new Set(["1", "7", "30"]);

export async function GET(req: NextRequest) {
  const asset = (req.nextUrl.searchParams.get("asset") ?? "BTC").toUpperCase() as keyof typeof ASSETS;
  const days = req.nextUrl.searchParams.get("days") ?? "1";

  if (!(asset in ASSETS)) {
    return NextResponse.json({ error: "Unsupported asset." }, { status: 400 });
  }
  if (!ALLOWED_DAYS.has(days)) {
    return NextResponse.json({ error: "Unsupported time range." }, { status: 400 });
  }

  try {
    const marketsUrl = new URL(`${coingeckoBase}/coins/markets`);
    marketsUrl.searchParams.set("vs_currency", "usd");
    marketsUrl.searchParams.set("ids", ASSETS[asset].id);
    marketsUrl.searchParams.set("sparkline", "true");
    marketsUrl.searchParams.set("price_change_percentage", "24h");

    const res = await fetch(marketsUrl.toString(), {
      next: { revalidate: 60 },
      headers: {
        accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
    }

    const data = (await res.json()) as Array<{
      current_price?: number;
      price_change_percentage_24h_in_currency?: number;
      sparkline_in_7d?: {
        price?: number[];
      };
    }>;

    const market = data[0];
    const sparkline = (market?.sparkline_in_7d?.price ?? []).filter((value) =>
      Number.isFinite(value)
    );

    const series = days === "1" ? sparkline.slice(-24) : sparkline;
    const now = Date.now();
    const intervalMs =
      series.length > 1 ? Math.floor((Number(days) * 24 * 60 * 60 * 1000) / (series.length - 1)) : 0;
    const points = series.map((price, index) => ({
      time: now - intervalMs * (series.length - 1 - index),
      price,
    }));

    if (points.length < 2) {
      return NextResponse.json({ error: "insufficient chart data" }, { status: 502 });
    }

    const prices = points.map((point) => point.price);
    const first = prices[0] ?? 0;
    const last = Number(market?.current_price ?? prices[prices.length - 1] ?? 0);
    const changePct =
      typeof market?.price_change_percentage_24h_in_currency === "number"
        ? market.price_change_percentage_24h_in_currency
        : first
          ? ((last - first) / first) * 100
          : 0;

    return NextResponse.json({
      asset,
      label: ASSETS[asset].label,
      days: Number(days),
      updatedAt: new Date().toISOString(),
      currentPrice: last,
      changePct,
      low: Math.min(...prices),
      high: Math.max(...prices),
      points,
    });
  } catch {
    return NextResponse.json({ error: "chart fetch failed" }, { status: 500 });
  }
}
