// Static curated watchlist — highest-scoring known scam tokens
// Scores are uncapped totals from the TokenSentry heuristic model.
// This will be replaced with a live DB-backed leaderboard once storage is added.

const ENTRIES = [
  {
    rank: 1,
    name: "AnubisDAO",
    ticker: "ANKH",
    chain: "ETH",
    score: 185,
    label: "Rug Pull",
    // ETH contract address — paste this directly into TokenSentry
    address: "0x68b0df17a6e8bf5de70b6d3d66ebcf5614d77568",
    reportPath: "/report/eth/0x68b0df17a6e8bf5de70b6d3d66ebcf5614d77568",
  },
  {
    rank: 2,
    name: "Turtledex",
    ticker: "TTDX",
    chain: "BNB",
    score: 168,
    label: "Rug Pull",
    address: null,
    reportPath: null,
  },
  {
    rank: 3,
    name: "Meerkat Finance",
    ticker: "MEERKAT",
    chain: "BNB",
    score: 156,
    label: "Rug Pull",
    address: null,
    reportPath: null,
  },
  {
    rank: 4,
    name: "SQUID Game Token",
    ticker: "SQUID",
    chain: "BNB",
    score: 118,
    label: "Honeypot",
    address: "0x87230146E138d3F296a9a77e497A2A83012e9Bc5",
    reportPath: "/report/bnb/0x87230146E138d3F296a9a77e497A2A83012e9Bc5",
  },
  {
    rank: 5,
    name: "SafeMoon V1",
    ticker: "SFMV1",
    chain: "BNB",
    score: 82,
    label: "Fraud",
    address: "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3",
    reportPath: "/report/bnb/0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3",
  },
];

const chainColor: Record<string, string> = {
  ETH: "text-sky-300 bg-sky-950/60 border-sky-800/50",
  BNB: "text-amber-300 bg-amber-950/50 border-amber-800/40",
  SOL: "text-purple-300 bg-purple-950/50 border-purple-800/40",
};

const labelColor: Record<string, string> = {
  "Rug Pull": "text-red-300",
  "Honeypot": "text-orange-300",
  "Fraud":    "text-red-400",
};

export function RiskLeaderboard() {
  return (
    <div className="flex-shrink-0">
      {/* Header */}
      <div className="mb-2 flex items-baseline justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Risk Watchlist</p>
          <p className="mt-0.5 text-[10px] text-slate-500">Curated · highest known scores</p>
        </div>
        <a href="/examples" className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors">
          Full examples →
        </a>
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {ENTRIES.map(({ rank, name, ticker, chain, score, label, reportPath }) => {
          // Visual bar capped at 100% of the container; score can exceed 100
          const barWidth = `${Math.min(score, 100)}%`;
          const isExtreme = score >= 100;
          const scoreColor = isExtreme ? "text-fuchsia-300" : "text-red-300";
          const barBg = isExtreme ? "bg-fuchsia-950/50" : "bg-red-950/40";
          const Row = (
            <div
              className="relative overflow-hidden rounded-lg border border-slate-700/40 bg-slate-900/60 px-2.5 py-1.5"
            >
              {/* Score progress bar behind row */}
              <div
                className={`absolute inset-y-0 left-0 rounded-lg ${barBg}`}
                style={{ width: barWidth }}
                aria-hidden="true"
              />
              <div className="relative flex items-center gap-2">
                {/* Rank */}
                <span className="w-3.5 flex-shrink-0 text-[10px] font-bold text-slate-500">
                  {rank}
                </span>
                {/* Name + chain */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-100">{name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`rounded border px-1 py-px text-[9px] font-bold ${chainColor[chain] ?? "text-slate-400 bg-slate-900 border-slate-700"}`}>
                      {chain}
                    </span>
                    <span className={`text-[9px] font-medium ${labelColor[label] ?? "text-slate-400"}`}>
                      {label}
                    </span>
                  </div>
                </div>
                {/* Score */}
                <span className={`flex-shrink-0 text-sm font-extrabold ${scoreColor}`}>
                  {score}
                </span>
              </div>
            </div>
          );

          return reportPath ? (
            <a key={ticker} href={reportPath} className="block group hover:opacity-90 transition-opacity" title={`View ${name} report`}>
              {Row}
            </a>
          ) : (
            <div key={ticker}>{Row}</div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="mt-1.5 text-[9px] text-slate-600">
        <span className="text-fuchsia-500/70">■</span> 100+ pts = Extreme Risk · no upper cap ·{" "}
        <span className="text-slate-600">click row to view report</span>
      </p>
    </div>
  );
}
