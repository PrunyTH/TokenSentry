import { ReportView } from "@/components/ReportView";
import type { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { mint: string };
}): Metadata {
  return {
    title: `Solana Token Risk Report ${params.mint} | TokenSentry`,
    description:
      "Educational Solana token risk report generated with transparent heuristics.",
  };
}

export default function SolReportPage({
  params,
}: {
  params: { mint: string };
}) {
  return <ReportView chain="sol" id={params.mint} />;
}
