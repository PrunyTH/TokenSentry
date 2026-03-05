import { NextRequest, NextResponse } from "next/server";
import { getCachedJson, setCachedJson } from "@/lib/cache";
import { enforceRateLimit } from "@/lib/http";
import { buildSolReport } from "@/lib/report-builders";
import { RiskReport } from "@/lib/types";
import { isSolMint } from "@/lib/validation";

const REPORT_TTL_SECONDS = 60 * 60;

export async function GET(
  req: NextRequest,
  { params }: { params: { mint: string } }
) {
  const blocked = await enforceRateLimit(req);
  if (blocked) return blocked;

  const mint = params.mint?.trim();
  if (!isSolMint(mint)) {
    return NextResponse.json({ error: "Invalid Solana mint address." }, { status: 400 });
  }

  const cacheKey = `report:sol:${mint}`;
  const cached = await getCachedJson<RiskReport>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const report = await buildSolReport(mint);
    await setCachedJson(cacheKey, report, REPORT_TTL_SECONDS);
    return NextResponse.json(report);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to build Solana report.",
        detail: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 }
    );
  }
}
