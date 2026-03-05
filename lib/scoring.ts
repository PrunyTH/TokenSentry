import { EvidenceItem } from "@/lib/types";

const ETH_POINTS = {
  CONTRACT_UNVERIFIED: 25,
  HONEYPOT_FAIL: 40,
};

const SOL_POINTS = {
  DANGER_FLAG: 40,
  WARN_FLAG: 20,
};

export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
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

export function sumEvidence(evidence: EvidenceItem[]): number {
  return evidence.reduce((acc, item) => acc + item.points, 0);
}
