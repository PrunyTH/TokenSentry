import { ReportView } from "@/components/ReportView";
import type { Metadata } from "next";

type PageParams = {
  mint: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { mint } = await params;

  return {
    title: `Solana Token Risk Report ${mint} | TokenSentry`,
    description:
      "Educational Solana token risk report generated with transparent heuristics.",
  };
}

export default async function SolReportPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { mint } = await params;
  return <ReportView chain="sol" id={mint} />;
}
