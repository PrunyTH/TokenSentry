export type Chain = "eth" | "sol";
export type ChainAuto = Chain | "auto";

export interface Candidate {
  chain: Chain;
  name: string;
  symbol: string;
  address: string;
  thumb?: string;
  coingeckoId?: string;
}

export type Severity = "low" | "medium" | "high";

export interface EvidenceItem {
  label: string;
  severity: Severity;
  points: number;
  note?: string;
}

export interface RiskReport {
  chain: Chain;
  token: {
    name?: string;
    symbol?: string;
    address: string;
  };
  score: number;
  category: "Low" | "Medium" | "High";
  evidence: EvidenceItem[];
  limitedData: boolean;
  generatedAt: string;
  links: {
    label: string;
    url: string;
  }[];
  notes: string[];
}
