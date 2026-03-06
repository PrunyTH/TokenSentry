import { EvidenceItem } from "@/lib/types";

function colorForSeverity(severity: EvidenceItem["severity"]) {
  if (severity === "high") return "border-red-500/45 bg-red-500/8 text-red-200";
  if (severity === "medium") return "border-amber-500/45 bg-amber-500/8 text-amber-200";
  return "border-emerald-500/45 bg-emerald-500/8 text-emerald-200";
}

export function EvidenceList({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <ul className="space-y-2">
      {evidence.map((item, idx) => (
        <li
          key={`${item.label}-${idx}`}
          className={`rounded-xl border p-3 ${colorForSeverity(item.severity)}`}
        >
          <p className="font-medium text-white">{item.label}</p>
          <p className="text-sm">Risk points: +{item.points}</p>
          {item.note ? <p className="text-xs text-slate-400">{item.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}
