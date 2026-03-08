"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChainAuto } from "@/lib/types";
import { isEthAddress, isSolMint } from "@/lib/validation";
import { isEvmChain } from "@/lib/chains";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function InputForm() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [chain, setChain] = useState<ChainAuto>("auto");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const value = input.trim();
    if (!value) {
      setError("Please enter a token name or address.");
      return;
    }

    // Specific EVM chain selected
    if (chain !== "auto" && chain !== "sol" && isEvmChain(chain)) {
      if (isEthAddress(value)) {
        router.push(`/${chain}/${value}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(value)}&chain=${chain}`);
      }
      return;
    }

    if (chain === "sol") {
      if (isSolMint(value)) {
        router.push(`/sol/${value}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(value)}&chain=sol`);
      }
      return;
    }

    // Auto detection
    if (isEthAddress(value)) {
      router.push(`/eth/${value}`);
      return;
    }
    if (isSolMint(value)) {
      router.push(`/sol/${value}`);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-700/50 bg-white/[0.02] p-4 md:p-5">
      <div className="mb-3">
        <label htmlFor="token-input" className="text-sm font-medium text-slate-100">
          Token name or contract address
        </label>
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          id="token-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. PEPE, 0x..., or Solana mint"
        />
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value as ChainAuto)}
          className="rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-white"
        >
          <option value="auto">Auto-detect</option>
          <optgroup label="EVM Chains">
            <option value="eth">Ethereum</option>
            <option value="bnb">BNB Chain</option>
            <option value="polygon">Polygon</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="base">Base</option>
            <option value="avalanche">Avalanche</option>
            <option value="optimism">Optimism</option>
          </optgroup>
          <optgroup label="Other">
            <option value="sol">Solana</option>
          </optgroup>
        </select>
        <Button type="submit">Analyze Token</Button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
        <span className="rounded-full border border-slate-700 px-2 py-1">Ethereum</span>
        <span className="rounded-full border border-slate-700 px-2 py-1">BNB Chain</span>
        <span className="rounded-full border border-slate-700 px-2 py-1">Polygon</span>
        <span className="rounded-full border border-slate-700 px-2 py-1">Arbitrum</span>
        <span className="rounded-full border border-slate-700 px-2 py-1">Base</span>
        <span className="rounded-full border border-slate-700 px-2 py-1">Avalanche</span>
        <span className="rounded-full border border-slate-700 px-2 py-1">Optimism</span>
        <span className="rounded-full border border-slate-700 px-2 py-1">Solana</span>
      </div>
    </form>
  );
}
