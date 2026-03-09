"use client";

import { useEffect, useState } from "react";
import { MarketSparkline } from "@/components/MarketSparkline";

type Asset = "BTC" | "ETH" | "SOL" | "BNB";

type ChartPayload = {
  asset: Asset;
  label: string;
  currentPrice: number;
  changePct: number;
  low: number;
  high: number;
  points: Array<{ time: number; price: number }>;
};

const ASSETS: Asset[] = ["BTC", "ETH", "SOL", "BNB"];

function fmtUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

export function HeroMarketPanel() {
  const [asset, setAsset] = useState<Asset>("BTC");
  const [data, setData] = useState<ChartPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/market/chart?asset=${asset}&days=1`);
        const payload = (await res.json()) as ChartPayload & { error?: string };
        if (!res.ok) {
          throw new Error(payload.error ?? "Could not load market chart.");
        }
        if (active) {
          setData(payload);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Could not load market chart.");
          setData(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [asset]);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Market pulse</p>
          <h2 className="mt-2 text-lg font-semibold text-white">24h chart</h2>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {ASSETS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setAsset(item)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                item === asset
                  ? "border-sky-400/60 bg-sky-400/10 text-sky-200"
                  : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-5 h-40 animate-pulse rounded-2xl border border-slate-800/80 bg-slate-900/70" />
      ) : error || !data ? (
        <div className="mt-5 rounded-2xl border border-rose-900/60 bg-rose-950/30 p-4 text-sm text-rose-200">
          {error ?? "Market data unavailable."}
        </div>
      ) : (
        <>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">{data.label}</p>
              <p className="mt-1 text-3xl font-semibold text-white">{fmtUsd(data.currentPrice)}</p>
            </div>
            <div
              className={`rounded-2xl border px-3 py-2 text-right text-sm ${
                data.changePct >= 0
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-200"
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.2em] opacity-70">24h</p>
              <p className="mt-1 font-semibold">
                {data.changePct >= 0 ? "+" : ""}
                {data.changePct.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-2">
            <MarketSparkline
              points={data.points}
              strokeClassName={data.changePct >= 0 ? "stroke-emerald-300" : "stroke-rose-300"}
              fillClassName={data.changePct >= 0 ? "fill-emerald-500/10" : "fill-rose-500/10"}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">24h low</p>
              <p className="mt-1 font-semibold text-white">{fmtUsd(data.low)}</p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">24h high</p>
              <p className="mt-1 font-semibold text-white">{fmtUsd(data.high)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
