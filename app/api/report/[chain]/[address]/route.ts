import { NextRequest, NextResponse } from "next/server";
import { getCachedJson, setCachedJson } from "@/lib/cache";
import { enforceRateLimit } from "@/lib/http";
import { buildEvmReport } from "@/lib/report-builders";
import { RiskReport } from "@/lib/types";
import { isEthAddress } from "@/lib/validation";
import { isEvmChain } from "@/lib/chains";

const REPORT_TTL_SECONDS = 60 * 60;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chain: string; address: string }> }
) {
  const blocked = await enforceRateLimit(req);
  if (blocked) return blocked;

  const { chain: rawChain, address: rawAddress } = await params;
  const address = rawAddress?.trim();

  if (!isEvmChain(rawChain)) {
    return NextResponse.json({ error: "Unsupported chain." }, { status: 400 });
  }
  if (!isEthAddress(address)) {
    return NextResponse.json({ error: "Invalid EVM address." }, { status: 400 });
  }

  const cacheKey = `report:${rawChain}:${address.toLowerCase()}`;
  const cached = await getCachedJson<RiskReport>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const report = await buildEvmReport(address, rawChain);
    await setCachedJson(cacheKey, report, REPORT_TTL_SECONDS);
    return NextResponse.json(report);
  } catch (err) {
    return NextResponse.json(
      {
        error: `Failed to build ${rawChain.toUpperCase()} report.`,
        detail: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    );
  }
}
