import { RiskReport } from "@/lib/types";

const categoryStyles: Record<RiskReport["category"], { wrap: string; score: string; desc: string }> = {
  Low:    { wrap: "border-emerald-500/40 bg-emerald-950/30", score: "text-emerald-300", desc: "No major flags detected. Always verify independently." },
  Medium: { wrap: "border-amber-500/40 bg-amber-950/30",    score: "text-amber-300",   desc: "One or more concerning signals — research further." },
  High:   { wrap: "border-red-500/40 bg-red-950/30",        score: "text-red-300",     desc: "Multiple serious red flags detected." },
};

export function ScoreBadge({ score, category }: { score: number; category: RiskReport["category"] }) {
  const s = categoryStyles[category];
  return (
    <div className={`panel rounded-2xl border p-5 ${s.wrap}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Risk Score</p>
          <p className={`mt-1 text-5xl font-extrabold leading-none ${s.score}`}>{score}</p>
          <p className="mt-1 text-xs text-slate-500">risk points accumulated</p>
        </div>
        <div className="text-right">
          <span className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${s.wrap} ${s.score}`}>
            {category} Risk
          </span>
          <p className="mt-2 max-w-[200px] text-xs text-slate-400 leading-relaxed">{s.desc}</p>
          <a href="/methodology#scoring" className="mt-1 inline-block text-[10px] text-sky-500 hover:text-sky-400 transition-colors">
            How scores are calculated →
          </a>
        </div>
      </div>
    </div>
  );
}
