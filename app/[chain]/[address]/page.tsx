import { ReportView } from "@/components/ReportView";
import { isEvmChain, EVM_CHAINS } from "@/lib/chains";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type PageParams = {
  chain: string;
  address: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { chain, address } = await params;
  if (!isEvmChain(chain)) return {};
  const chainName = EVM_CHAINS[chain].name;
  return {
    title: `${chainName} Token Risk Report ${address} | TokenSentry`,
    description: `Educational ${chainName} token risk report generated with transparent heuristics.`,
  };
}

export default async function EvmReportPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { chain, address } = await params;
  if (!isEvmChain(chain)) notFound();
  return <ReportView chain={chain} id={address} />;
}
