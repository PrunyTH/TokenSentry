import { EvidenceItem, EvmChain, RiskReport } from "@/lib/types";
import {
  categoryFromScore,
  clampScore,
  dexscreenerPoints,
  ethPoints,
  goplusPoints,
  solPoints,
  sumEvidence,
} from "@/lib/scoring";
import {
  DexscreenerPair,
  GoplusResult,
  dexscreenerToken,
  etherscanContractMeta,
  goplusSecurity,
  honeypotCheck,
  rugcheckToken,
} from "@/lib/upstream";
import { EVM_CHAINS } from "@/lib/chains";

// ── Helpers ───────────────────────────────────────────────────────────────────

const DEX_TAGS = [
  "uniswap", "pancakeswap", "sushiswap", "curve", "balancer",
  "aave", "compound", "burn", "dead", "null", "lock", "0x000",
];

function isDexHolder(tag: string | undefined): boolean {
  if (!tag) return false;
  const t = tag.toLowerCase();
  return DEX_TAGS.some((kw) => t.includes(kw));
}

function fmtPct(decimal: string | number): string {
  const n = typeof decimal === "number" ? decimal : parseFloat(decimal ?? "0");
  return (n * 100).toFixed(1) + "%";
}

function fmtUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toFixed(0)}`;
}

// ── GoPlus evidence builder ───────────────────────────────────────────────────

function buildGoplusEvidence(gp: GoplusResult): EvidenceItem[] {
  const pts = goplusPoints();
  const items: EvidenceItem[] = [];
  const flag = (v?: string) => v === "1";

  // Contract-level danger flags
  if (flag(gp.is_mintable)) {
    items.push({
      label: "Owner can mint unlimited tokens (no supply cap)",
      severity: "high",
      points: pts.IS_MINTABLE,
      note: "Uncapped minting allows the team to dilute holders at will.",
    });
  }

  if (flag(gp.hidden_owner)) {
    items.push({
      label: "Hidden owner — true controlling address is concealed",
      severity: "high",
      points: pts.HIDDEN_OWNER,
      note: "A hidden owner can exercise privileged functions anonymously.",
    });
  }

  if (flag(gp.can_take_back_ownership)) {
    items.push({
      label: "Contract can reclaim ownership after apparent renouncement",
      severity: "high",
      points: pts.CAN_TAKE_OWNERSHIP,
    });
  }

  if (flag(gp.transfer_pausable)) {
    items.push({
      label: "Token transfers can be frozen by owner",
      severity: "high",
      points: pts.TRANSFER_PAUSABLE,
      note: "Owner can lock all holders out of selling.",
    });
  }

  if (flag(gp.selfdestruct)) {
    items.push({
      label: "Contract contains self-destruct code",
      severity: "high",
      points: pts.SELFDESTRUCT,
      note: "Self-destruct can destroy the contract and liquidity pool.",
    });
  }

  if (flag(gp.is_proxy)) {
    items.push({
      label: "Upgradeable proxy — contract logic can be silently replaced",
      severity: "medium",
      points: pts.IS_PROXY,
    });
  }

  // Team/creator holding concentration
  const ownerPct = parseFloat(gp.owner_percent ?? "0");
  const creatorPct = parseFloat(gp.creator_percent ?? "0");
  const maxControl = Math.max(ownerPct, creatorPct);
  if (maxControl > 0.3) {
    items.push({
      label: `Team wallet holds ${fmtPct(maxControl)} of token supply`,
      severity: "high",
      points: pts.OWNER_LARGE_HOLDING,
      note: "Large team holdings create significant dump risk.",
    });
  } else if (maxControl > 0.1) {
    items.push({
      label: `Team wallet holds ${fmtPct(maxControl)} of token supply`,
      severity: "medium",
      points: Math.round(pts.OWNER_LARGE_HOLDING * 0.4),
    });
  }

  // Whale detection — exclude known DEX/protocol addresses
  const wallets = (gp.holders ?? []).filter((h) => !isDexHolder(h.tag));

  if (wallets.length > 0) {
    const topPct = parseFloat(wallets[0].percent ?? "0");

    if (topPct > 0.5) {
      items.push({
        label: `Single wallet controls ${fmtPct(wallets[0].percent)} of supply`,
        severity: "high",
        points: pts.WHALE_MAJORITY,
        note: "One entity can collapse the price at any time.",
      });
    } else if (topPct > 0.2) {
      items.push({
        label: `Largest wallet holds ${fmtPct(wallets[0].percent)} of supply`,
        severity: "medium",
        points: pts.WHALE_SIGNIFICANT,
      });
    }

    // Top-5 concentration (only if top holder isn't already a majority)
    if (topPct <= 0.5 && wallets.length >= 5) {
      const top5Pct = wallets
        .slice(0, 5)
        .reduce((s, h) => s + parseFloat(h.percent ?? "0"), 0);
      if (top5Pct > 0.8) {
        items.push({
          label: `Top 5 wallets hold ${(top5Pct * 100).toFixed(0)}% of supply — highly concentrated`,
          severity: "medium",
          points: pts.HOLDER_CONCENTRATION,
        });
      }
    }
  }

  // Total holder count
  const holderCount = parseInt(gp.holder_count ?? "0", 10);
  if (holderCount > 0 && holderCount < 50) {
    items.push({
      label: `Only ${holderCount} holders — extremely low distribution`,
      severity: "medium",
      points: pts.FEW_HOLDERS,
    });
  } else if (holderCount >= 50 && holderCount < 200) {
    items.push({
      label: `${holderCount} holders — limited token distribution`,
      severity: "low",
      points: pts.FEW_HOLDERS_MODERATE,
    });
  }

  // LP lock status
  const lpHolders = gp.lp_holders ?? [];
  if (lpHolders.length > 0) {
    const lockedPct = lpHolders
      .filter((h) => h.is_locked === 1)
      .reduce((s, h) => s + parseFloat(h.percent ?? "0"), 0);

    if (lockedPct === 0) {
      items.push({
        label: "Liquidity is not locked — LP can be removed at any time",
        severity: "high",
        points: pts.LP_NOT_LOCKED,
        note: "Unlocked liquidity is a primary rug pull mechanism.",
      });
    } else if (lockedPct < 0.5) {
      items.push({
        label: `Only ${(lockedPct * 100).toFixed(0)}% of liquidity is locked`,
        severity: "medium",
        points: pts.LP_PARTIAL_LOCK,
      });
    } else {
      items.push({
        label: `${(lockedPct * 100).toFixed(0)}% of liquidity is locked`,
        severity: "low",
        points: 0,
      });
    }
  }

  return items;
}

// ── DexScreener evidence builder ──────────────────────────────────────────────

function buildDexscreenerEvidence(pairs: DexscreenerPair[]): EvidenceItem[] {
  const pts = dexscreenerPoints();
  const items: EvidenceItem[] = [];
  if (!pairs || pairs.length === 0) return items;

  // Best liquidity pair
  const best = [...pairs].sort(
    (a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
  )[0];
  const liquidity = best.liquidity?.usd ?? 0;

  if (liquidity < 10_000) {
    items.push({
      label: `Critically low liquidity: ${fmtUsd(liquidity)}`,
      severity: "high",
      points: pts.LIQUIDITY_CRITICAL,
      note: "Low liquidity amplifies slippage and makes exit difficult.",
    });
  } else if (liquidity < 50_000) {
    items.push({
      label: `Low liquidity: ${fmtUsd(liquidity)}`,
      severity: "medium",
      points: pts.LIQUIDITY_LOW,
    });
  } else {
    items.push({
      label: `Adequate liquidity: ${fmtUsd(liquidity)}`,
      severity: "low",
      points: 0,
    });
  }

  // Earliest listing age across all pairs
  const timestamps = pairs
    .map((p) => p.pairCreatedAt)
    .filter((t): t is number => !!t);
  if (timestamps.length > 0) {
    const earliestMs = Math.min(...timestamps);
    const ageDays = (Date.now() - earliestMs) / (1000 * 60 * 60 * 24);

    if (ageDays < 3) {
      const ageLabel =
        ageDays < 1
          ? "less than 24 hours"
          : `${Math.floor(ageDays)} day${Math.floor(ageDays) === 1 ? "" : "s"}`;
      items.push({
        label: `Very new token — first listed ${ageLabel} ago`,
        severity: "medium",
        points: pts.TOKEN_VERY_NEW,
        note: "New tokens carry higher uncertainty and rug pull risk.",
      });
    } else if (ageDays < 30) {
      items.push({
        label: `Token is ${Math.floor(ageDays)} days old — relatively new`,
        severity: "low",
        points: pts.TOKEN_NEW,
      });
    }
  }

  return items;
}

// ── Ethereum report ───────────────────────────────────────────────────────────

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

  // All four sources in parallel — one slow API doesn't block the others
  const [metaRes, hpRes, gpRes, dxRes] = await Promise.allSettled([
    etherscanContractMeta(address),
    honeypotCheck(address, 1),
    goplusSecurity(address, 1),
    dexscreenerToken(address),
  ]);

  // Etherscan metadata
  if (metaRes.status === "fulfilled") {
    const meta = metaRes.value;
    if (!meta) {
      limitedData = true;
      notes.push("Etherscan API key is missing or contract metadata is unavailable.");
    } else {
      tokenName = meta.tokenName || meta.contractName;
      tokenSymbol = meta.tokenSymbol;
      evidence.push(
        meta.isVerified
          ? { label: "Contract source verified on Etherscan", severity: "low", points: 0 }
          : { label: "Contract source not verified on Etherscan", severity: "high", points: ethPoints().CONTRACT_UNVERIFIED }
      );
    }
  } else {
    limitedData = true;
    notes.push("Could not retrieve Etherscan metadata.");
  }

  // Honeypot + tax
  if (hpRes.status === "fulfilled") {
    const hp = hpRes.value;
    const isHoneypot = Boolean(hp?.honeypotResult?.isHoneypot);
    const sellTax = hp?.simulationResult?.sellTax ?? 0;
    const buyTax = hp?.simulationResult?.buyTax ?? 0;

    if (isHoneypot) {
      evidence.push({
        label: "Honeypot simulation indicates sell failure / restriction",
        severity: "high",
        points: ethPoints().HONEYPOT_FAIL,
      });
    } else {
      evidence.push({ label: "Honeypot simulation did not detect sell failure", severity: "low", points: 0 });
      if (sellTax > 10) {
        evidence.push({
          label: `High sell tax detected: ${sellTax.toFixed(1)}%`,
          severity: sellTax > 25 ? "high" : "medium",
          points: sellTax > 25 ? 30 : 15,
        });
      }
      if (buyTax > 10) {
        evidence.push({
          label: `High buy tax detected: ${buyTax.toFixed(1)}%`,
          severity: buyTax > 25 ? "high" : "medium",
          points: buyTax > 25 ? 20 : 10,
        });
      }
    }
  } else {
    limitedData = true;
    notes.push("Honeypot simulation unavailable (rate-limited or endpoint error).");
  }

  // GoPlus contract security (10+ checks)
  if (gpRes.status === "fulfilled" && gpRes.value) {
    evidence.push(...buildGoplusEvidence(gpRes.value));
    if (!tokenName) tokenName = gpRes.value.token_name;
    if (!tokenSymbol) tokenSymbol = gpRes.value.token_symbol;
  } else {
    notes.push("GoPlus security analysis unavailable.");
  }

  // DexScreener liquidity & age
  if (dxRes.status === "fulfilled") {
    evidence.push(...buildDexscreenerEvidence(dxRes.value.pairs ?? []));
  }

  if (evidence.length === 0) {
    evidence.push({ label: "No high-confidence signals were available", severity: "medium", points: 0, note: "Limited data may reduce reliability." });
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

// ── Generic EVM report (BNB, Polygon, Arbitrum, Base, Avalanche, Optimism) ───

export async function buildEvmReport(
  address: string,
  chainKey: EvmChain
): Promise<RiskReport> {
  const chainConfig = EVM_CHAINS[chainKey];
  const evidence: EvidenceItem[] = [];
  const notes: string[] = [];
  const links = [
    { label: chainConfig.explorerName, url: `${chainConfig.explorerBase}/address/${address}` },
    { label: "Dexscreener", url: `https://dexscreener.com/${chainConfig.dexscreenerChain}/${address}` },
  ];

  let limitedData = false;

  const [hpRes, gpRes, dxRes] = await Promise.allSettled([
    honeypotCheck(address, chainConfig.chainId),
    goplusSecurity(address, chainConfig.chainId),
    dexscreenerToken(address),
  ]);

  // Honeypot + tax
  if (hpRes.status === "fulfilled") {
    const hp = hpRes.value;
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
      evidence.push({ label: "Honeypot simulation did not detect sell failure", severity: "low", points: 0 });
      if (sellTax > 10) {
        evidence.push({
          label: `High sell tax detected: ${sellTax.toFixed(1)}%`,
          severity: sellTax > 25 ? "high" : "medium",
          points: sellTax > 25 ? 30 : 15,
        });
      }
      if (buyTax > 10) {
        evidence.push({
          label: `High buy tax detected: ${buyTax.toFixed(1)}%`,
          severity: buyTax > 25 ? "high" : "medium",
          points: buyTax > 25 ? 20 : 10,
        });
      }
    }
  } else {
    limitedData = true;
    notes.push(`Honeypot simulation unavailable for ${chainConfig.name}.`);
  }

  // GoPlus contract security
  if (gpRes.status === "fulfilled" && gpRes.value) {
    evidence.push(...buildGoplusEvidence(gpRes.value));
  } else {
    notes.push(`GoPlus security analysis unavailable for ${chainConfig.name}.`);
  }

  // DexScreener liquidity & age
  if (dxRes.status === "fulfilled") {
    evidence.push(...buildDexscreenerEvidence(dxRes.value.pairs ?? []));
  }

  if (evidence.length === 0) {
    evidence.push({ label: "No high-confidence signals were available", severity: "medium", points: 0, note: "Limited data may reduce reliability." });
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

// ── Solana report ─────────────────────────────────────────────────────────────

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

  const [rcRes, dxRes] = await Promise.allSettled([
    rugcheckToken(mint),
    dexscreenerToken(mint),
  ]);

  // RugCheck
  if (rcRes.status === "fulfilled") {
    const data = rcRes.value;
    tokenName = data?.token?.name ?? data?.name;
    tokenSymbol = data?.token?.symbol ?? data?.symbol;

    const dangerFlags = Number(
      data?.risk?.danger?.length ?? data?.dangerFlags?.length ?? data?.scoreDetails?.danger ?? 0
    );
    const warnFlags = Number(
      data?.risk?.warning?.length ?? data?.warningFlags?.length ?? data?.scoreDetails?.warning ?? 0
    );

    if (dangerFlags > 0) {
      evidence.push({ label: `RugCheck danger flags detected (${dangerFlags})`, severity: "high", points: solPoints().DANGER_FLAG });
    }
    if (warnFlags > 0) {
      evidence.push({ label: `RugCheck warning flags detected (${warnFlags})`, severity: "medium", points: solPoints().WARN_FLAG });
    }
    if (dangerFlags === 0 && warnFlags === 0) {
      evidence.push({ label: "No RugCheck danger/warning flags reported", severity: "low", points: 0 });
    }

    // Top holder concentration
    const topHolders: Array<{ pct?: number; percent?: number }> =
      data?.topHolders ?? data?.holders ?? [];
    if (topHolders.length > 0) {
      const topPct = topHolders[0].pct ?? topHolders[0].percent ?? 0;
      if (topPct > 50) {
        evidence.push({
          label: `Largest holder controls ${topPct.toFixed(1)}% of supply`,
          severity: "high",
          points: goplusPoints().WHALE_MAJORITY,
          note: "One entity can collapse the price at any time.",
        });
      } else if (topPct > 20) {
        evidence.push({
          label: `Largest holder controls ${topPct.toFixed(1)}% of supply`,
          severity: "medium",
          points: goplusPoints().WHALE_SIGNIFICANT,
        });
      }
    }
  } else {
    limitedData = true;
    notes.push("RugCheck unavailable or rate-limited.");
    evidence.push({ label: "No RugCheck signal available", severity: "medium", points: 0, note: "Limited data may reduce reliability." });
  }

  // DexScreener liquidity & age
  if (dxRes.status === "fulfilled") {
    evidence.push(...buildDexscreenerEvidence(dxRes.value.pairs ?? []));
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
