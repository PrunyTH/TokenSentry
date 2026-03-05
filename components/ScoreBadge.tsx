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
    <div
      className={`inline-flex items-center gap-3 rounded-lg border px-4 py-2 ${categoryStyles[category]}`}
    >
      <span className="text-2xl font-bold">{score}</span>
      <span className="text-sm font-semibold uppercase">{category} Risk</span>
    </div>
  );
}
