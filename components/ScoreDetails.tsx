import { EvidenceItem } from "@/lib/types";

export function ScoreDetails({ evidence }: { evidence: EvidenceItem[] }) {
  const flags = evidence.filter((e) => e.points > 0);
  const total = flags.reduce((sum, e) => sum + e.points, 0);

  if (flags.length === 0) return null;

  return (
    <details className="panel rounded-xl p-4">
      <summary className="cursor-pointer select-none font-semibold text-white">
        Score breakdown — {total} pts from {flags.length} flag{flags.length !== 1 ? "s" : ""}
      </summary>
      <div className="mt-4 space-y-1.5 text-sm">
        {flags.map((item, idx) => (
          <div key={`${item.label}-${idx}`} className="flex items-center justify-between gap-2">
            <span className="text-slate-300 truncate">{item.label}</span>
            <span className={`flex-shrink-0 font-bold tabular-nums ${
              item.severity === "high" ? "text-red-300"
              : item.severity === "medium" ? "text-amber-300"
              : "text-slate-400"
            }`}>
              +{item.points}
            </span>
          </div>
        ))}
        <div className="mt-2 flex items-center justify-between border-t border-slate-700/60 pt-2 font-semibold">
          <span className="text-slate-200">Total</span>
          <span className="text-white tabular-nums">{total} pts</span>
        </div>
        <p className="pt-1 text-xs text-slate-500">
          Scores above 67 = High Risk. No upper cap — each flag adds its fixed point value.{" "}
          <a href="/methodology#scoring" className="text-sky-500 hover:text-sky-400">Full methodology →</a>
        </p>
      </div>
    </details>
  );
}
