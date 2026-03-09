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

export function ReportMarketPanel({ chain, address, tokenName }: Props) {
  const dexChain = getDexChain(chain);
  const chartUrl = `https://dexscreener.com/${dexChain}/${address}?embed=1&theme=dark&trades=0&info=0`;
  const fullUrl = `https://dexscreener.com/${dexChain}/${address}`;

  return (
    <section className="panel rounded-2xl p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Market chart</h2>
          <p className="mt-1 text-sm text-slate-400">
            {tokenName ?? "This token"} chart is embedded from DexScreener for live price action and market structure.
          </p>
        </div>
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
        >
          Open full chart
        </a>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
        <iframe
          title={`${tokenName ?? address} market chart`}
          src={chartUrl}
          className="h-[420px] w-full"
          loading="lazy"
        />
      </div>
    </section>
  );
}
