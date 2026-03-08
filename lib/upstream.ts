import { Candidate, Chain } from "@/lib/types";
import { COINGECKO_PLATFORM_TO_CHAIN } from "@/lib/chains";

const coingeckoBase = process.env.COINGECKO_BASE_URL ?? "https://api.coingecko.com/api/v3";
const rugcheckBase = process.env.RUGCHECK_BASE_URL ?? "https://api.rugcheck.xyz";
const honeypotBase = process.env.HONEYPOT_BASE_URL ?? "https://api.honeypot.is";
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

type CoinSearchItem = {
  id: string;
  name: string;
  symbol: string;
  thumb?: string;
  market_cap_rank?: number;
};

function norm(value: string): string {
  return value.trim().toLowerCase();
}

function rankCoins(query: string, coins: CoinSearchItem[]): CoinSearchItem[] {
  const q = norm(query);

  function score(coin: CoinSearchItem): number {
    const name = norm(coin.name);
    const symbol = norm(coin.symbol);

    let s = 0;
    if (symbol === q) s += 120;
    else if (name === q) s += 110;
    else if (symbol.startsWith(q)) s += 95;
    else if (name.startsWith(q)) s += 85;
    else if (symbol.includes(q)) s += 70;
    else if (name.includes(q)) s += 60;

    if (typeof coin.market_cap_rank === "number" && coin.market_cap_rank > 0) {
      s += Math.max(0, 30 - Math.min(coin.market_cap_rank, 30));
    }

    return s;
  }

  return [...coins].sort((a, b) => score(b) - score(a));
}

export async function searchCoinGecko(query: string) {
  const res = await fetch(
    `${coingeckoBase}/search?query=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(`CoinGecko search failed: ${res.status}`);
  }
  return res.json() as Promise<{
    coins: CoinSearchItem[];
  }>;
}

export async function coinGeckoCoin(id: string) {
  const res = await fetch(
    `${coingeckoBase}/coins/${encodeURIComponent(
      id
    )}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(`CoinGecko coin failed: ${res.status}`);
  }
  return res.json() as Promise<{
    id: string;
    name: string;
    symbol: string;
    image?: { thumb?: string };
    platforms?: Record<string, string>;
  }>;
}

export async function candidatesFromCoinGecko(
  query: string
): Promise<Candidate[]> {
  const search = await searchCoinGecko(query);
  const ranked = rankCoins(query, search.coins);
  const firstPass = ranked.slice(0, 12);
  const secondPass = ranked.slice(12, 24);

  const out: Candidate[] = [];

  async function collectFromBatch(batch: CoinSearchItem[]) {
    const detailResults = await Promise.allSettled(
      batch.map((coin) => coinGeckoCoin(coin.id))
    );

    for (const result of detailResults) {
      if (result.status !== "fulfilled") continue;
      const coin = result.value;
      const platforms = coin.platforms ?? {};

      // Solana handled separately (different address format)
      const solMint = platforms.solana;
      if (solMint) {
        out.push({
          chain: "sol",
          name: coin.name,
          symbol: coin.symbol?.toUpperCase() ?? "",
          address: solMint,
          thumb: coin.image?.thumb,
          coingeckoId: coin.id,
        });
      }

      // All EVM chains via platform map
      for (const [platform, address] of Object.entries(platforms)) {
        if (!address || platform === "solana") continue;
        const chain = COINGECKO_PLATFORM_TO_CHAIN[platform] as Chain | undefined;
        if (!chain) continue;
        out.push({
          chain,
          name: coin.name,
          symbol: coin.symbol?.toUpperCase() ?? "",
          address,
          thumb: coin.image?.thumb,
          coingeckoId: coin.id,
        });
      }
    }
  }

  await collectFromBatch(firstPass);
  if (out.length === 0 && secondPass.length > 0) {
    await collectFromBatch(secondPass);
  }

  return out;
}

export async function etherscanContractMeta(address: string) {
  if (!etherscanApiKey) {
    return null;
  }
  const url = new URL("https://api.etherscan.io/api");
  url.searchParams.set("module", "contract");
  url.searchParams.set("action", "getsourcecode");
  url.searchParams.set("address", address);
  url.searchParams.set("apikey", etherscanApiKey);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Etherscan failed: ${res.status}`);
  const json = (await res.json()) as {
    status: string;
    result?: Array<{
      SourceCode?: string;
      ContractName?: string;
      ABI?: string;
      TokenName?: string;
      TokenSymbol?: string;
    }>;
  };
  const first = json.result?.[0];
  if (!first) return null;
  const isVerified = Boolean(first.SourceCode && first.SourceCode.trim() !== "");
  return {
    isVerified,
    contractName: first.ContractName,
    tokenName: first.TokenName,
    tokenSymbol: first.TokenSymbol,
  };
}

/** Honeypot check — works for any EVM chain via chainID */
export async function honeypotCheck(address: string, chainId = 1) {
  const endpoint = `${honeypotBase}/v2/IsHoneypot?address=${encodeURIComponent(
    address
  )}&chainID=${chainId}`;
  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Honeypot failed: ${res.status}`);
  }
  return res.json() as Promise<{
    honeypotResult?: {
      isHoneypot?: boolean;
    };
    simulationResult?: {
      buyTax?: number;
      sellTax?: number;
      sellGas?: string;
      buyGas?: string;
    };
  }>;
}

// ── GoPlus Security API ───────────────────────────────────────────────────────

export type GoplusHolder = {
  address: string;
  percent: string;       // decimal string, e.g. "0.15" = 15%
  is_contract?: string;  // "0" | "1"
  tag?: string;          // e.g. "Uniswap V3", "Burn Address"
  is_locked?: number;    // 0 | 1 (used in lp_holders)
};

export type GoplusResult = {
  is_mintable?: string;
  hidden_owner?: string;
  can_take_back_ownership?: string;
  transfer_pausable?: string;
  selfdestruct?: string;
  is_proxy?: string;
  trading_cooldown?: string;
  is_open_source?: string;
  owner_address?: string;
  owner_percent?: string;
  creator_address?: string;
  creator_percent?: string;
  holder_count?: string;
  holders?: GoplusHolder[];
  lp_holders?: GoplusHolder[];
  token_name?: string;
  token_symbol?: string;
};

export async function goplusSecurity(
  address: string,
  chainId: number
): Promise<GoplusResult | null> {
  const url = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${encodeURIComponent(
    address.toLowerCase()
  )}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`GoPlus failed: ${res.status}`);
  const json = (await res.json()) as {
    code: number;
    result?: Record<string, GoplusResult>;
  };
  if (json.code !== 1 || !json.result) return null;
  const entries = Object.entries(json.result);
  return entries.length > 0 ? entries[0][1] : null;
}

// ── DexScreener API ───────────────────────────────────────────────────────────

export type DexscreenerPair = {
  chainId: string;
  dexId: string;
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  priceChange?: { h24?: number };
  pairCreatedAt?: number; // unix ms
  fdv?: number;
  marketCap?: number;
};

export async function dexscreenerToken(address: string) {
  const url = `https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(
    address
  )}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`DexScreener failed: ${res.status}`);
  return res.json() as Promise<{ pairs?: DexscreenerPair[] }>;
}

export async function rugcheckToken(mint: string) {
  const candidates = [
    `${rugcheckBase}/v1/tokens/${encodeURIComponent(mint)}/report`,
    `${rugcheckBase}/v1/tokens/${encodeURIComponent(mint)}`,
  ];

  let lastError: Error | null = null;
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        lastError = new Error(`RugCheck failed: ${res.status}`);
        continue;
      }
      return res.json();
    } catch (err) {
      lastError = err as Error;
    }
  }
  throw lastError ?? new Error("RugCheck unavailable");
}
