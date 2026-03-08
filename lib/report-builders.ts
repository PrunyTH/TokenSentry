import { EvidenceItem, EvmChain, RiskReport } from "@/lib/types";
import { categoryFromScore, clampScore, ethPoints, solPoints, sumEvidence } from "@/lib/scoring";
import { etherscanContractMeta, honeypotCheck, rugcheckToken } from "@/lib/upstream";
import { EVM_CHAINS } from "@/lib/chains";

export async function buildEthReport(address: string): Promise<RiskReport> {
  const evidence: EvidenceItem[] = [];
  const notes: string[] = [];
  const links = [
    { label: "Etherscan", url: `https://etherscan.io/address/${address}` },
    { label: "Dexscreener", url: `https://dexscreener.com/ethereum/${address}` },
  ];

  let limitedData = false;
  let tokenName: string | undefined;
  let tokenSymbol: string | undefined;

  try {
    const meta = await etherscanContractMeta(address);
    if (!meta) {
      limitedData = true;
      notes.push("Etherscan API key is missing or contract metadata is unavailable.");
    } else {
      tokenName = meta.tokenName || meta.contractName;
      tokenSymbol = meta.tokenSymbol;
      if (!meta.isVerified) {
        evidence.push({
          label: "Contract source not verified on Etherscan",
          severity: "high",
          points: ethPoints().CONTRACT_UNVERIFIED,
        });
      } else {
        evidence.push({
          label: "Contract source verified on Etherscan",
          severity: "low",
          points: 0,
        });
      }
    }
  } catch {
    limitedData = true;
    notes.push("Could not retrieve Etherscan metadata.");
  }

  try {
    const hp = await honeypotCheck(address, 1);
    const isHoneypot = Boolean(hp?.honeypotResult?.isHoneypot);
    if (isHoneypot) {
      evidence.push({
        label: "Honeypot simulation indicates sell failure / restriction",
        severity: "high",
        points: ethPoints().HONEYPOT_FAIL,
      });
    } else {
      evidence.push({
        label: "Honeypot simulation did not detect sell failure",
        severity: "low",
        points: 0,
      });
    }
  } catch {
    limitedData = true;
    notes.push("Honeypot simulation unavailable (rate-limited or endpoint error).");
  }

  if (evidence.length === 0) {
    evidence.push({
      label: "No high-confidence signals were available",
      severity: "medium",
      points: 0,
      note: "Limited data may reduce reliability.",
    });
  }

  const score = clampScore(sumEvidence(evidence));

  return {
    chain: "eth",
    token: { address, name: tokenName, symbol: tokenSymbol },
    score,
    category: categoryFromScore(score),
    evidence,
    limitedData,
    generatedAt: new Date().toISOString(),
    links,
    notes,
  };
}

/** Generic EVM report for BNB, Polygon, Arbitrum, Base, Avalanche, Optimism */
export async function buildEvmReport(address: string, chainKey: EvmChain): Promise<RiskReport> {
  const chainConfig = EVM_CHAINS[chainKey];
  const evidence: EvidenceItem[] = [];
  const notes: string[] = [];
  const links = [
    { label: chainConfig.explorerName, url: `${chainConfig.explorerBase}/address/${address}` },
    { label: "Dexscreener", url: `https://dexscreener.com/${chainConfig.dexscreenerChain}/${address}` },
  ];

  let limitedData = false;

  try {
    const hp = await honeypotCheck(address, chainConfig.chainId);
    const isHoneypot = Boolean(hp?.honeypotResult?.isHoneypot);
    const buyTax = hp?.simulationResult?.buyTax ?? 0;
    const sellTax = hp?.simulationResult?.sellTax ?? 0;

    if (isHoneypot) {
      evidence.push({
        label: "Honeypot simulation indicates sell failure / restriction",
        severity: "high",
        points: ethPoints().HONEYPOT_FAIL,
      });
    } else {
      evidence.push({
        label: "Honeypot simulation did not detect sell failure",
        severity: "low",
        points: 0,
      });
    }

    if (!isHoneypot && sellTax > 10) {
      evidence.push({
        label: `High sell tax detected: ${sellTax.toFixed(1)}%`,
        severity: sellTax > 25 ? "high" : "medium",
        points: sellTax > 25 ? 30 : 15,
      });
    }

    if (!isHoneypot && buyTax > 10) {
      evidence.push({
        label: `High buy tax detected: ${buyTax.toFixed(1)}%`,
        severity: buyTax > 25 ? "high" : "medium",
        points: buyTax > 25 ? 20 : 10,
      });
    }
  } catch {
    limitedData = true;
    notes.push(`Honeypot simulation unavailable for ${chainConfig.name}.`);
  }

  if (evidence.length === 0) {
    evidence.push({
      label: "No high-confidence signals were available",
      severity: "medium",
      points: 0,
      note: "Limited data may reduce reliability.",
    });
  }

  const score = clampScore(sumEvidence(evidence));

  return {
    chain: chainKey,
    token: { address },
    score,
    category: categoryFromScore(score),
    evidence,
    limitedData,
    generatedAt: new Date().toISOString(),
    links,
    notes,
  };
}

export async function buildSolReport(mint: string): Promise<RiskReport> {
  const evidence: EvidenceItem[] = [];
  const notes: string[] = [];
  const links = [
    { label: "RugCheck", url: `https://rugcheck.xyz/tokens/${mint}` },
    { label: "Solscan", url: `https://solscan.io/token/${mint}` },
    { label: "Dexscreener", url: `https://dexscreener.com/solana/${mint}` },
  ];

  let limitedData = false;
  let tokenName: string | undefined;
  let tokenSymbol: string | undefined;

  try {
    const data = await rugcheckToken(mint);
    tokenName = data?.token?.name ?? data?.name;
    tokenSymbol = data?.token?.symbol ?? data?.symbol;

    const dangerFlags = Number(
      data?.risk?.danger?.length ??
        data?.dangerFlags?.length ??
        data?.scoreDetails?.danger ??
        0
    );
    const warnFlags = Number(
      data?.risk?.warning?.length ??
        data?.warningFlags?.length ??
        data?.scoreDetails?.warning ??
        0
    );

    if (dangerFlags > 0) {
      evidence.push({
        label: `RugCheck danger flags detected (${dangerFlags})`,
        severity: "high",
        points: solPoints().DANGER_FLAG,
      });
    }
    if (warnFlags > 0) {
      evidence.push({
        label: `RugCheck warning flags detected (${warnFlags})`,
        severity: "medium",
        points: solPoints().WARN_FLAG,
      });
    }
    if (dangerFlags === 0 && warnFlags === 0) {
      evidence.push({
        label: "No RugCheck danger/warning flags reported",
        severity: "low",
        points: 0,
      });
    }
  } catch {
    limitedData = true;
    notes.push("RugCheck unavailable or rate-limited.");
    evidence.push({
      label: "No RugCheck signal available",
      severity: "medium",
      points: 0,
      note: "Limited data may reduce reliability.",
    });
  }

  const score = clampScore(sumEvidence(evidence));

  return {
    chain: "sol",
    token: { address: mint, name: tokenName, symbol: tokenSymbol },
    score,
    category: categoryFromScore(score),
    evidence,
    limitedData,
    generatedAt: new Date().toISOString(),
    links,
    notes,
  };
}
