import { ReportView } from "@/components/ReportView";
import type { Metadata } from "next";

type PageParams = {
  address: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { address } = await params;

  return {
    title: `Ethereum Token Risk Report ${address} | TokenSentry`,
    description:
      "Educational Ethereum token risk report generated with transparent heuristics.",
  };
}

export default async function EthReportPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { address } = await params;
  return <ReportView chain="eth" id={address} />;
}
