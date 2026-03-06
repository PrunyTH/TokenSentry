"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChainAuto } from "@/lib/types";
import { isEthAddress, isSolMint } from "@/lib/validation";
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

    if (chain === "eth" && isEthAddress(value)) {
      router.push(`/eth/${value}`);
      return;
    }
    if (chain === "sol" && isSolMint(value)) {
      router.push(`/sol/${value}`);
      return;
    }
    if (chain === "eth" && !isEthAddress(value)) {
      router.push(`/search?q=${encodeURIComponent(value)}&chain=eth`);
      return;
    }
    if (chain === "sol" && !isSolMint(value)) {
      router.push(`/search?q=${encodeURIComponent(value)}&chain=sol`);
      return;
    }

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
    <form onSubmit={handleSubmit} className="rounded-2xl border border-amber-200/25 bg-white/[0.02] p-4 md:p-5">
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
          className="rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-white outline-none focus:border-amber-300"
        >
          <option value="auto">Auto</option>
          <option value="eth">Ethereum</option>
          <option value="sol">Solana</option>
        </select>
        <Button type="submit">Analyze Token</Button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
        <span className="rounded-full border border-slate-700 px-2 py-1">Ethereum</span>
        <span className="rounded-full border border-slate-700 px-2 py-1">Solana</span>
        <span className="rounded-full border border-slate-700 px-2 py-1">BNB (soon)</span>
      </div>
    </form>
  );
}
