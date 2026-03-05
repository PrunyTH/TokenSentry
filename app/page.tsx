import { InputForm } from "@/components/InputForm";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-4xl font-bold text-white">
          TokenSentry
        </h1>
        <p className="max-w-3xl text-slate-300">
          Educational crypto token risk checker for Ethereum and Solana.
          Enter a token name or contract/mint address to generate a transparent
          heuristic report.
        </p>
      </section>
      <InputForm />
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">What this is</p>
        <p>
          TokenSentry focuses on security education. It does not provide trading
          signals, buy/sell calls, or investment advice.
        </p>
      </section>
    </div>
  );
}
