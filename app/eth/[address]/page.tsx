import { ReportView } from "@/components/ReportView";
import type { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { address: string };
}): Metadata {
  return {
    title: `Ethereum Token Risk Report ${params.address} | TokenSentry`,
    description:
      "Educational Ethereum token risk report generated with transparent heuristics.",
  };
}

export default function EthReportPage({
  params,
}: {
  params: { address: string };
}) {
  return <ReportView chain="eth" id={params.address} />;
}
