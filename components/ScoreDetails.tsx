import { EvidenceItem } from "@/lib/types";

export function ScoreDetails({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <details className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <summary className="cursor-pointer font-semibold text-white">
        How we scored this
      </summary>
      <div className="mt-3 space-y-2 text-sm text-slate-300">
        {evidence.map((item, idx) => (
          <p key={`${item.label}-${idx}`}>
            <span className="font-medium text-white">{item.label}</span> : +{item.points}
            {" points"}
          </p>
        ))}
      </div>
    </details>
  );
}
