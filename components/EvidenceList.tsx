import { EvidenceItem } from "@/lib/types";

// ── Learn-more anchor lookup ──────────────────────────────────────────────────

function learnMorePath(label: string): { text: string; href: string } | null {
  const l = label.toLowerCase();
  if (l.includes("honeypot"))
    return { text: "What is a honeypot?", href: "/learn#honeypot" };
  if (l.includes("mint") || l.includes("supply cap"))
    return { text: "What is a mint function?", href: "/learn#mint" };
  if (l.includes("self-destruct") || l.includes("selfdestruct"))
    return { text: "Dangerous contract functions", href: "/methodology#contract" };
  if (l.includes("proxy") || l.includes("upgradeable"))
    return { text: "Upgradeable proxies explained", href: "/methodology#contract" };
  if (l.includes("hidden owner") || l.includes("reclaim ownership"))
    return { text: "Hidden owner risk", href: "/methodology#contract" };
  if (l.includes("pausable") || l.includes("frozen") || l.includes("freeze"))
    return { text: "Transfer pause risk", href: "/methodology#contract" };
  if (l.includes("verified"))
    return { text: "Why verification matters", href: "/learn#verification" };
  if (l.includes("not locked") || l.includes("lp can be removed"))
    return { text: "What is LP locking?", href: "/learn#lp-lock" };
  if (l.includes("locked") || (l.includes("lp") && !l.includes("liquidity")))
    return { text: "Liquidity lock explained", href: "/learn#lp-lock" };
  if (l.includes("liquidity"))
    return { text: "Why liquidity depth matters", href: "/learn#liquidity" };
  if (l.includes("wallet controls") || l.includes("largest wallet") || l.includes("team wallet"))
    return { text: "Whale & concentration risk", href: "/learn#whale" };
  if (l.includes("holder"))
    return { text: "Holder concentration scoring", href: "/methodology#holders" };
  if (l.includes("tax"))
    return { text: "Token tax risk", href: "/learn#tax" };
  if (l.includes("new token") || l.includes("days old") || l.includes("listed") || l.includes("hours"))
    return { text: "Token age scoring", href: "/methodology#token-age" };
  if (l.includes("danger") || l.includes("rugcheck") || l.includes("warning flag"))
    return { text: "RugCheck flags explained", href: "/methodology#sources" };
  return null;
}

// ── Severity config ───────────────────────────────────────────────────────────

const SEV = {
  high: {
    dot: "bg-red-400",
    badge: "text-red-300 bg-red-950/50 border-red-500/40",
    border: "border-red-500/30 bg-red-950/20",
    label: "HIGH RISK",
    pts: "text-red-300",
  },
  medium: {
    dot: "bg-amber-400",
    badge: "text-amber-300 bg-amber-950/50 border-amber-500/40",
    border: "border-amber-500/25 bg-amber-950/10",
    label: "MEDIUM",
    pts: "text-amber-300",
  },
  low: {
    dot: "bg-emerald-400",
    badge: "text-emerald-300 bg-emerald-950/50 border-emerald-500/40",
    border: "border-emerald-500/20 bg-emerald-950/10",
    label: "CLEAR",
    pts: "text-emerald-300",
  },
} as const;

// ── Component ─────────────────────────────────────────────────────────────────

export function EvidenceList({ evidence }: { evidence: EvidenceItem[] }) {
  const sevOrder = { high: 0, medium: 1, low: 2 } as const;
  const flags   = evidence
    .filter((e) => e.points > 0)
    .sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity]);
  const passing = evidence.filter((e) => e.points === 0);

  return (
    <div className="space-y-6">

      {/* ── Risk flags ── */}
      {flags.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Risk Flags — {flags.length} detected
          </p>
          {flags.map((item, idx) => {
            const cfg = SEV[item.severity];
            const link = learnMorePath(item.label);
            return (
              <div key={`flag-${idx}`} className={`rounded-xl border p-4 ${cfg.border}`}>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${cfg.dot}`} />
                    <p className="font-semibold text-white leading-snug">{item.label}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <p className={`mt-1 text-sm font-extrabold ${cfg.pts}`}>+{item.points} pts</p>
                  </div>
                </div>

                {/* Explanation note */}
                {item.note && (
                  <p className="mt-2.5 ml-4 text-sm text-slate-300 leading-relaxed border-l-2 border-slate-600/60 pl-3">
                    {item.note}
                  </p>
                )}

                {/* Learn more */}
                {link && (
                  <div className="mt-2.5 ml-4 flex flex-wrap items-center gap-3">
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium"
                    >
                      {link.text} →
                    </a>
                    <span className="text-slate-700 text-xs select-none">·</span>
                    <a
                      href="/methodology#checks"
                      className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                    >
                      Scoring methodology
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 text-sm text-emerald-300">
          No risk flags were detected in this scan.
        </div>
      )}

      {/* ── Passing checks ── */}
      {passing.length > 0 && (
        <details className="group" open>
          <summary className="cursor-pointer list-none select-none">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-300 transition-colors">
              <svg
                className="h-3 w-3 flex-shrink-0 transition-transform group-open:rotate-90"
                viewBox="0 0 12 12" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M4.5 2L9 6l-4.5 4"/>
              </svg>
              Passing Checks — {passing.length} clear
            </div>
          </summary>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {passing.map((item, idx) => {
              const link = learnMorePath(item.label);
              return (
                <div
                  key={`pass-${idx}`}
                  className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-950/10 px-3 py-2.5"
                >
                  <span className="mt-0.5 flex-shrink-0 text-emerald-400 text-sm font-bold">&#10003;</span>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-200 leading-snug">{item.label}</p>
                    {item.note && (
                      <p className="mt-0.5 text-xs text-slate-500">{item.note}</p>
                    )}
                    {link && (
                      <a href={link.href} className="mt-1 inline-flex items-center gap-0.5 text-[10px] text-sky-500 hover:text-sky-400 transition-colors">
                        {link.text} →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}
