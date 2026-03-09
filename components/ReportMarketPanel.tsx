"use client";

import { Chain, EvmChain } from "@/lib/types";
import { EVM_CHAINS } from "@/lib/chains";

type Props = {
  chain: Chain;
  address: string;
  tokenName?: string;
};

function getDexChain(chain: Chain) {
  if (chain === "sol") {
    return "solana";
  }
  return EVM_CHAINS[chain as EvmChain].dexscreenerChain;
}

function getExplorerUrl(chain: Chain, address: string) {
  if (chain === "sol") {
    return `https://solscan.io/token/${address}`;
  }
  const config = EVM_CHAINS[chain as EvmChain];
  return `${config.explorerBase}/address/${address}`;
}

export function ReportMarketPanel({ chain, address, tokenName }: Props) {
  const dexChain = getDexChain(chain);
  const chartUrl = `https://dexscreener.com/${dexChain}/${address}`;
  const explorerUrl = getExplorerUrl(chain, address);

  return (
    <section className="panel rounded-2xl p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Market chart</h2>
          <p className="mt-1 text-sm text-slate-400">
            Live charts for {tokenName ?? "this token"} open in a dedicated market page. Some providers block
            embedded frames, so this report links out directly instead of showing a broken chart panel.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_40%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))] p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300/70">Live market view</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Open the token chart in a full browser tab</h3>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              That gives users the real interactive chart, pairs, trades, and liquidity context without risking
              iframe failures inside the report.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={chartUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-center text-sm font-medium text-sky-100 transition-colors hover:border-sky-300/60 hover:bg-sky-400/15 hover:text-white"
            >
              Open full chart
            </a>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-center text-sm text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
            >
              Open explorer
            </a>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Why this change</p>
            <p className="mt-2 text-sm text-slate-200">The previous embedded chart was blocked by the provider.</p>
          </div>
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Better UX</p>
            <p className="mt-2 text-sm text-slate-200">Users get the full charting experience in the original tool.</p>
          </div>
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/55 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Still useful</p>
            <p className="mt-2 text-sm text-slate-200">The report keeps the market action one click away.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
