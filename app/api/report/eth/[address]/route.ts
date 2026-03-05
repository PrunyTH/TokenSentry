import { NextRequest, NextResponse } from "next/server";
import { getCachedJson, setCachedJson } from "@/lib/cache";
import { enforceRateLimit } from "@/lib/http";
import { buildEthReport } from "@/lib/report-builders";
import { RiskReport } from "@/lib/types";
import { isEthAddress } from "@/lib/validation";

const REPORT_TTL_SECONDS = 60 * 60;

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  const blocked = await enforceRateLimit(req);
  if (blocked) return blocked;

  const address = params.address?.trim();
  if (!isEthAddress(address)) {
    return NextResponse.json({ error: "Invalid Ethereum address." }, { status: 400 });
  }

  const cacheKey = `report:eth:${address.toLowerCase()}`;
  const cached = await getCachedJson<RiskReport>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const report = await buildEthReport(address);
    await setCachedJson(cacheKey, report, REPORT_TTL_SECONDS);
    return NextResponse.json(report);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to build Ethereum report.",
        detail: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    );
  }
}
