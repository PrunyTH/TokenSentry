import { EvidenceItem } from "@/lib/types";

const ETH_POINTS = {
  CONTRACT_UNVERIFIED: 25,
  HONEYPOT_FAIL: 40,
};

const SOL_POINTS = {
  DANGER_FLAG: 40,
  WARN_FLAG: 20,
};

const GOPLUS_POINTS = {
  IS_MINTABLE: 40,        // owner can print unlimited tokens
  HIDDEN_OWNER: 50,       // true owner is concealed
  CAN_TAKE_OWNERSHIP: 45, // ownership can be reclaimed after renouncement
  TRANSFER_PAUSABLE: 35,  // owner can freeze all transfers
  SELFDESTRUCT: 45,       // contract can self-destruct (rug)
  IS_PROXY: 15,           // logic can be swapped out silently
  OWNER_LARGE_HOLDING: 30, // owner/creator >30% of supply
  WHALE_MAJORITY: 35,     // single wallet >50% of supply
  WHALE_SIGNIFICANT: 18,  // single wallet >20% of supply
  HOLDER_CONCENTRATION: 20, // top 5 wallets >80%
  LP_NOT_LOCKED: 30,      // liquidity removable at any time
  LP_PARTIAL_LOCK: 12,    // <50% of liquidity locked
  FEW_HOLDERS: 20,        // <50 holders
  FEW_HOLDERS_MODERATE: 10, // 50–200 holders
};

const DEXSCREENER_POINTS = {
  LIQUIDITY_CRITICAL: 25, // <$10k — exit risk
  LIQUIDITY_LOW: 15,      // $10k–$50k
  TOKEN_VERY_NEW: 10,     // <3 days old
  TOKEN_NEW: 5,           // 3–30 days old
};

export function clampScore(value: number): number {
  return Math.max(0, Math.round(value));
}

export function categoryFromScore(score: number): "Low" | "Medium" | "High" {
  if (score >= 67) return "High";
  if (score >= 34) return "Medium";
  return "Low";
}

export function ethPoints() {
  return ETH_POINTS;
}

export function solPoints() {
  return SOL_POINTS;
}

export function goplusPoints() {
  return GOPLUS_POINTS;
}

export function dexscreenerPoints() {
  return DEXSCREENER_POINTS;
}

export function sumEvidence(evidence: EvidenceItem[]): number {
  return evidence.reduce((acc, item) => acc + item.points, 0);
}
