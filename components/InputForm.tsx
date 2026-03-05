"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ChainAuto } from "@/lib/types";
import { isEthAddress, isSolMint } from "@/lib/validation";

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
      router.push(`/search?q=${encodeURIComponent(value)}`);
      return;
    }
    if (chain === "sol" && !isSolMint(value)) {
      router.push(`/search?q=${encodeURIComponent(value)}`);
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
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg"
    >
      <label htmlFor="token-input" className="mb-2 block text-sm text-slate-300">
        Token name or address
      </label>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          id="token-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. PEPE or 0x... or Solana mint"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
        />
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value as ChainAuto)}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
        >
          <option value="auto">Auto</option>
          <option value="eth">Ethereum</option>
          <option value="sol">Solana</option>
        </select>
        <button
          type="submit"
          className="rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400"
        >
          Check Risk
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
      <p className="mt-3 text-xs text-slate-400">
        TokenSentry provides educational risk heuristics only, not trading advice.
      </p>
    </form>
  );
}
