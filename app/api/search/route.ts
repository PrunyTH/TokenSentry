import { NextRequest, NextResponse } from "next/server";
import { getCachedJson, setCachedJson } from "@/lib/cache";
import { enforceRateLimit } from "@/lib/http";
import { Candidate } from "@/lib/types";
import { candidatesFromCoinGecko } from "@/lib/upstream";
import { isEthAddress, isSolMint } from "@/lib/validation";

const SEARCH_TTL_SECONDS = 15 * 60;

function dedupeCandidates(items: Candidate[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.chain}:${item.address.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function GET(req: NextRequest) {
  const blocked = await enforceRateLimit(req);
  if (blocked) return blocked;

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ candidates: [] as Candidate[] });
  }

  if (isEthAddress(q)) {
    return NextResponse.json({
      candidates: [
        {
          chain: "eth",
          name: "Direct Ethereum Address",
          symbol: "ETH",
          address: q,
        } satisfies Candidate,
      ],
    });
  }
  if (isSolMint(q)) {
    return NextResponse.json({
      candidates: [
        {
          chain: "sol",
          name: "Direct Solana Mint",
          symbol: "SOL",
          address: q,
        } satisfies Candidate,
      ],
    });
  }

  const cacheKey = `search:${q.toLowerCase()}`;
  const cached = await getCachedJson<{ candidates: Candidate[] }>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const candidates = dedupeCandidates(await candidatesFromCoinGecko(q));
    const payload = { candidates };
    await setCachedJson(cacheKey, payload, SEARCH_TTL_SECONDS);
    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Search provider unavailable.",
        detail: err instanceof Error ? err.message : "unknown",
      },
      { status: 502 }
    );
  }
}
