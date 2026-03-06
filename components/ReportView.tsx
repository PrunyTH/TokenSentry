"use client";

import { useEffect, useState } from "react";
import { EvidenceList } from "@/components/EvidenceList";
import { ScoreBadge } from "@/components/ScoreBadge";
import { ScoreDetails } from "@/components/ScoreDetails";
import { RiskReport } from "@/lib/types";

type Props = {
  chain: "eth" | "sol";
  id: string;
};

export function ReportView({ chain, id }: Props) {
  const [report, setReport] = useState<RiskReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/report/${chain}/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error ?? "Failed to load report");
          return;
        }
        setReport(data as RiskReport);
      } catch {
        setError("Unexpected network error");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [chain, id]);

  if (loading) return <p className="text-slate-300">Loading report...</p>;
  if (error) {
    return <p className="panel rounded-xl p-4 text-red-300">{error}</p>;
  }
  if (!report) {
    return <p className="text-slate-300">No report available.</p>;
  }

  const tokenTitle = report.token.name
    ? `${report.token.name} Risk Report`
    : `${report.token.address} Risk Report`;

  return (
    <div className="space-y-6">
      <div className="panel rounded-2xl p-5">
        <h1 className="text-3xl font-bold text-white">{tokenTitle}</h1>
        <p className="mt-1 text-sm text-slate-400">
          Generated: {new Date(report.generatedAt).toLocaleString()}
        </p>
      </div>

      <ScoreBadge score={report.score} category={report.category} />

      <section className="panel rounded-2xl p-5">
        <h2 className="mb-3 text-xl font-semibold text-white">Evidence</h2>
        <EvidenceList evidence={report.evidence} />
      </section>

      <ScoreDetails evidence={report.evidence} />

      <section className="panel space-y-2 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-white">External links</h3>
        <ul className="list-inside list-disc text-sm text-slate-300">
          {report.links.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {report.notes.length > 0 ? (
        <section className="rounded-lg border border-amber-700/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          <p className="font-semibold">Data quality notes:</p>
          <ul className="list-inside list-disc">
            {report.notes.map((n, i) => (
              <li key={`${n}-${i}`}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-slate-400">
        Disclaimer: Not financial advice. This is an automated heuristic
        assessment for educational/security purposes. Always verify on-chain.
      </p>
    </div>
  );
}
