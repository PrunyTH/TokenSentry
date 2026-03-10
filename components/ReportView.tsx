"use client";

import { useEffect, useState } from "react";
import { EvidenceList } from "@/components/EvidenceList";
import { ReportMarketPanel } from "@/components/ReportMarketPanel";
import { ScoreBadge } from "@/components/ScoreBadge";
import { ScoreDetails } from "@/components/ScoreDetails";
import { RiskReport } from "@/lib/types";

type Props = {
  chain: import("@/lib/types").Chain;
  id: string;
};

export function ReportView({ chain, id }: Props) {
  const [report, setReport] = useState<RiskReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareState, setShareState] = useState<string | null>(null);

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

  useEffect(() => {
    if (!shareState) return;
    const timer = window.setTimeout(() => setShareState(null), 2200);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  async function handleShare() {
    const url = window.location.href;
    const title = report?.token.name
      ? `${report.token.name} TokenSentry report`
      : "TokenSentry report";

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: "TokenSentry risk report",
          url,
        });
        setShareState("Share sheet opened.");
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareState("Report link copied.");
    } catch {
      setShareState("Could not share this report.");
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    if (!report) return;

    const slug = (report.token.symbol ?? report.token.name ?? report.token.address)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slug || "tokensentry-report"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

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
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{tokenTitle}</h1>
            <p className="mt-1 text-sm text-slate-400">
              Generated: {new Date(report.generatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
            >
              Share report
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
            >
              Save PDF
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
            >
              Download JSON
            </button>
          </div>
        </div>
        {shareState ? (
          <p className="mt-3 text-sm text-sky-300">{shareState}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <a
            href="/alerts"
            className="rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sky-100 transition-colors hover:border-sky-300/50 hover:text-white"
          >
            Monitor this token
          </a>
          <a
            href="/pricing"
            className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
          >
            View credit pricing
          </a>
        </div>
      </div>

      <ScoreBadge score={report.score} category={report.category} />

      <ReportMarketPanel
        chain={report.chain}
        address={report.token.address}
        tokenName={report.token.name}
      />

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
