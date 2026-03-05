import { Candidate } from "@/lib/types";

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
      const ethAddress = platforms.ethereum;
      const solMint = platforms.solana;
      if (ethAddress) {
        out.push({
          chain: "eth",
          name: coin.name,
          symbol: coin.symbol?.toUpperCase() ?? "",
          address: ethAddress,
          thumb: coin.image?.thumb,
          coingeckoId: coin.id,
        });
      }
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

export async function honeypotCheck(address: string) {
  const endpoint = `${honeypotBase}/v2/IsHoneypot?address=${encodeURIComponent(
    address
  )}&chainID=1`;
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
