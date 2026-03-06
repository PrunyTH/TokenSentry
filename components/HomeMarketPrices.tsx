"use client";

import { useEffect, useMemo, useState } from "react";

type PriceRow = {
  symbol: "BTC" | "ETH" | "SOL" | "BNB";
  priceUsd: number;
  change24h?: number | null;
};

type PriceResponse = {
  updatedAt: string;
  prices: PriceRow[];
};

function fmtUsd(v: number) {
  const n = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: v >= 1000 ? 0 : 2,
  }).format(v);
  return `US$${n}`;
}

export function HomeMarketPrices() {
  const [data, setData] = useState<PriceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/market/prices");
        const payload = (await res.json()) as PriceResponse;
        if (!res.ok) throw new Error("price feed unavailable");
        if (active) {
          setData(payload);
          setError(null);
        }
      } catch {
        if (active) setError("Live prices unavailable");
      }
    }
    load();
    const timer = setInterval(load, 60 * 1000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const updated = useMemo(
    () => (data ? new Date(data.updatedAt).toLocaleTimeString() : "--"),
    [data]
  );

  return (
    <aside className="panel rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wide text-slate-300">Market Snapshot</p>
      <p className="mt-1 text-sm text-slate-400">BTC, ETH, SOL, BNB spot prices</p>
      <div className="mt-4 space-y-2">
        {(data?.prices ?? []).map((p) => (
          <a
            key={p.symbol}
            href={
              p.symbol === "BTC"
                ? "https://www.coingecko.com/en/coins/bitcoin"
                : p.symbol === "ETH"
                  ? "https://www.coingecko.com/en/coins/ethereum"
                  : p.symbol === "SOL"
                    ? "https://www.coingecko.com/en/coins/solana"
                    : "https://www.coingecko.com/en/coins/bnb"
            }
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-600/50 bg-slate-900/45 px-3 py-2 transition hover:border-sky-300/55 hover:bg-slate-800/65"
          >
            <span className="font-semibold text-slate-100">{p.symbol}</span>
            <div className="text-right">
              <p className="font-semibold text-slate-100">{fmtUsd(p.priceUsd)}</p>
              {typeof p.change24h === "number" ? (
                <p className={`text-xs ${p.change24h >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                  {p.change24h >= 0 ? "+" : ""}
                  {p.change24h.toFixed(2)}%
                </p>
              ) : null}
            </div>
          </a>
        ))}
        {error ? <p className="text-xs text-amber-200">{error}</p> : null}
      </div>
      <p className="mt-3 text-xs text-slate-400">Updated: {updated}</p>
    </aside>
  );
}
