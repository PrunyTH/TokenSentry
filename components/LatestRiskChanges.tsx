"use client";

const EVENTS = [
  {
    name: "PEPE",
    chain: "ETH",
    address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    previous: "Low",
    current: "Medium",
    delta: "+9 pts",
    reason: "Holder concentration",
    observedAt: "12m ago",
  },
  {
    name: "BONK",
    chain: "SOL",
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6eJHMxwhLwKkJ7L",
    previous: "Medium",
    current: "High",
    delta: "+14 pts",
    reason: "Liquidity drop",
    observedAt: "26m ago",
  },
  {
    name: "FLOKI",
    chain: "BNB",
    address: "0xfb5b838b6cfeedc2873ab27866079ac55363d37e",
    previous: "Low",
    current: "Medium",
    delta: "+8 pts",
    reason: "Tax change",
    observedAt: "43m ago",
  },
  {
    name: "WIF",
    chain: "SOL",
    address: "EKpQGSJtjMFqKZJf2KQanSqYXRcF6xjBtk6v7wV1x9c",
    previous: "Medium",
    current: "Low",
    delta: "-7 pts",
    reason: "Ownership checks improved",
    observedAt: "1h ago",
  },
  {
    name: "AERO",
    chain: "BASE",
    address: "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
    previous: "Low",
    current: "Medium",
    delta: "+10 pts",
    reason: "Liquidity concentration",
    observedAt: "1h ago",
  },
];

const chainStyles: Record<string, string> = {
  ETH: "border-sky-500/35 bg-sky-500/10 text-sky-200",
  SOL: "border-fuchsia-500/35 bg-fuchsia-500/10 text-fuchsia-200",
  BNB: "border-amber-500/35 bg-amber-500/10 text-amber-200",
  BASE: "border-cyan-500/35 bg-cyan-500/10 text-cyan-200",
};

function getReportPath(chain: string, address: string) {
  if (chain === "ETH") return `/eth/${address}`;
  if (chain === "SOL") return `/sol/${address}`;
  return `/${chain.toLowerCase()}/${address}`;
}

export function LatestRiskChanges() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/78 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-300">Latest Risk Changes</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Preview board · bounded public universe</p>
        </div>
        <a href="/report" className="text-[11px] text-sky-400 transition-colors hover:text-sky-300">
          Scan token →
        </a>
      </div>

      <div className="mt-4 space-y-2">
        {EVENTS.map((event) => {
          const risingRisk = event.delta.startsWith("+");
          return (
            <a
              key={`${event.chain}-${event.address}`}
              href={getReportPath(event.chain, event.address)}
              className="block rounded-2xl border border-slate-700/60 bg-slate-900/65 p-3 transition-colors hover:border-slate-500 hover:bg-slate-900/90"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{event.name}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${chainStyles[event.chain] ?? "border-slate-600 bg-slate-800 text-slate-200"}`}>
                      {event.chain}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {event.previous} → {event.current} · {event.reason}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${risingRisk ? "text-rose-300" : "text-emerald-300"}`}>{event.delta}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{event.observedAt}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">How it works</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          TokenSentry seeds this board from a bounded public universe: boosted, trending, recently searched, and recently
          scanned tokens. Continuous 1 to 5 minute monitoring is reserved for paid watches in the user area, and this
          preview turns into a live change feed once snapshot storage is enabled.
        </p>
      </div>
    </div>
  );
}
