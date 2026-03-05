import { EvidenceItem } from "@/lib/types";

function iconForSeverity(severity: EvidenceItem["severity"]) {
  if (severity === "high") return "🔴";
  if (severity === "medium") return "🟠";
  return "🟢";
}

export function EvidenceList({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <ul className="space-y-2">
      {evidence.map((item, idx) => (
        <li
          key={`${item.label}-${idx}`}
          className="rounded-md border border-slate-800 bg-slate-900 p-3"
        >
          <p className="font-medium text-white">
            {iconForSeverity(item.severity)} {item.label}
          </p>
          <p className="text-sm text-slate-300">Points: +{item.points}</p>
          {item.note ? <p className="text-xs text-slate-400">{item.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}
