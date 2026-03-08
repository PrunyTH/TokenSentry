import { EvmChain } from "@/lib/types";

export interface ChainConfig {
  name: string;
  chainId: number;
  coingeckoPlatform: string;
  explorerName: string;
  explorerBase: string;
  dexscreenerChain: string;
}

export const EVM_CHAINS: Record<EvmChain, ChainConfig> = {
  eth: {
    name: "Ethereum",
    chainId: 1,
    coingeckoPlatform: "ethereum",
    explorerName: "Etherscan",
    explorerBase: "https://etherscan.io",
    dexscreenerChain: "ethereum",
  },
  bnb: {
    name: "BNB Chain",
    chainId: 56,
    coingeckoPlatform: "binance-smart-chain",
    explorerName: "BscScan",
    explorerBase: "https://bscscan.com",
    dexscreenerChain: "bsc",
  },
  polygon: {
    name: "Polygon",
    chainId: 137,
    coingeckoPlatform: "polygon-pos",
    explorerName: "PolygonScan",
    explorerBase: "https://polygonscan.com",
    dexscreenerChain: "polygon",
  },
  arbitrum: {
    name: "Arbitrum",
    chainId: 42161,
    coingeckoPlatform: "arbitrum-one",
    explorerName: "Arbiscan",
    explorerBase: "https://arbiscan.io",
    dexscreenerChain: "arbitrum",
  },
  base: {
    name: "Base",
    chainId: 8453,
    coingeckoPlatform: "base",
    explorerName: "Basescan",
    explorerBase: "https://basescan.org",
    dexscreenerChain: "base",
  },
  avalanche: {
    name: "Avalanche",
    chainId: 43114,
    coingeckoPlatform: "avalanche",
    explorerName: "Snowtrace",
    explorerBase: "https://snowtrace.io",
    dexscreenerChain: "avalanche",
  },
  optimism: {
    name: "Optimism",
    chainId: 10,
    coingeckoPlatform: "optimistic-ethereum",
    explorerName: "Optimism Explorer",
    explorerBase: "https://optimistic.etherscan.io",
    dexscreenerChain: "optimism",
  },
};

/** Map CoinGecko platform key → our chain ID */
export const COINGECKO_PLATFORM_TO_CHAIN: Record<string, EvmChain> = {
  ethereum: "eth",
  solana: "sol" as never, // handled separately
  "binance-smart-chain": "bnb",
  "polygon-pos": "polygon",
  "arbitrum-one": "arbitrum",
  base: "base",
  avalanche: "avalanche",
  "optimistic-ethereum": "optimism",
} as const;

export const NEW_EVM_CHAINS = Object.keys(EVM_CHAINS).filter(
  (c) => c !== "eth"
) as EvmChain[];

export function isEvmChain(value: string): value is EvmChain {
  return value in EVM_CHAINS;
}
