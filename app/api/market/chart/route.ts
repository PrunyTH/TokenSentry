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
    const interval = days === "1" ? "hourly" : "daily";
    const url = `${coingeckoBase}/coins/${ASSETS[asset].id}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
    }

    const data = (await res.json()) as {
      prices?: [number, number][];
    };

    const points = (data.prices ?? [])
      .filter((point) => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1]))
      .map(([time, price]) => ({ time, price }));

    if (points.length < 2) {
      return NextResponse.json({ error: "insufficient chart data" }, { status: 502 });
    }

    const prices = points.map((point) => point.price);
    const first = prices[0];
    const last = prices[prices.length - 1];
    const changePct = first ? ((last - first) / first) * 100 : 0;

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
