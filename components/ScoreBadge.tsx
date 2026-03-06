import { RiskReport } from "@/lib/types";

const categoryStyles: Record<RiskReport["category"], string> = {
  Low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
  Medium: "bg-amber-500/20 text-amber-300 border-amber-500/50",
  High: "bg-red-500/20 text-red-300 border-red-500/50",
};

export function ScoreBadge({
  score,
  category,
}: {
  score: number;
  category: RiskReport["category"];
}) {
  return (
    <div className={`panel inline-flex items-center gap-4 rounded-xl border px-4 py-3 ${categoryStyles[category]}`}>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-300">Risk Score</p>
        <span className="text-3xl font-extrabold">{score}</span>
      </div>
      <span className="rounded-full border border-current/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
        {category} Risk
      </span>
    </div>
  );
}
