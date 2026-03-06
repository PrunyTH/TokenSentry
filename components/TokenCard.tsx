import { Candidate } from "@/lib/types";

export function TokenCard({ candidate }: { candidate: Candidate }) {
  const href =
    candidate.chain === "eth"
      ? `/eth/${candidate.address}`
      : `/sol/${candidate.address}`;

  return (
    <a
      href={href}
      className="panel block rounded-xl p-4 transition hover:border-amber-400/65"
    >
      <div className="flex items-center gap-3">
        {candidate.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={candidate.thumb}
            alt={`${candidate.name} logo`}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-slate-700" />
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">
            {candidate.name} ({candidate.symbol})
          </p>
          <p className="truncate text-xs text-slate-400">{candidate.address}</p>
        </div>
        <span className="ml-auto rounded-full border border-slate-600 bg-slate-900/70 px-2 py-1 text-xs uppercase text-slate-300">
          {candidate.chain}
        </span>
      </div>
    </a>
  );
}
