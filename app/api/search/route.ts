import { NextRequest, NextResponse } from "next/server";
import { getCachedJson, setCachedJson } from "@/lib/cache";
import { enforceRateLimit } from "@/lib/http";
import { Candidate, Chain } from "@/lib/types";
import { candidatesFromCoinGecko } from "@/lib/upstream";
import { isEthAddress, isSolMint } from "@/lib/validation";
import { isEvmChain } from "@/lib/chains";

const SEARCH_TTL_SECONDS = 15 * 60;

type ChainFilter = Chain;

function dedupeCandidates(items: Candidate[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.chain}:${item.address.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseChainFilter(value: string | null): ChainFilter | null {
  if (!value) return null;
  if (value === "sol") return "sol";
  if (isEvmChain(value)) return value;
  return null;
}

export async function GET(req: NextRequest) {
  const blocked = await enforceRateLimit(req);
  if (blocked) return blocked;

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const chain = parseChainFilter(req.nextUrl.searchParams.get("chain"));

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

  const cacheKey = `search:${q.toLowerCase()}:${chain ?? "auto"}`;
  const cached = await getCachedJson<{ candidates: Candidate[] }>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const raw = await candidatesFromCoinGecko(q);
    const filtered = chain ? raw.filter((c) => c.chain === chain) : raw;
    const candidates = dedupeCandidates(filtered);
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
