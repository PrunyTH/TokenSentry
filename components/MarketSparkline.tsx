"use client";

type Point = {
  time: number;
  price: number;
};

type Props = {
  points: Point[];
  strokeClassName?: string;
  fillClassName?: string;
};

export function MarketSparkline({
  points,
  strokeClassName = "stroke-sky-300",
  fillClassName = "fill-sky-500/10",
}: Props) {
  if (points.length < 2) {
    return <div className="h-40 rounded-2xl border border-slate-800/80 bg-slate-950/50" />;
  }

  const width = 420;
  const height = 180;
  const padding = 8;
  const prices = points.map((point) => point.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = Math.max(max - min, 1e-9);

  const line = points
    .map((point, index) => {
      const x = padding + (index / (points.length - 1)) * (width - padding * 2);
      const y = height - padding - ((point.price - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full overflow-visible">
      <defs>
        <linearGradient id="sparkline-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(56 189 248 / 0.28)" />
          <stop offset="100%" stopColor="rgb(56 189 248 / 0)" />
        </linearGradient>
      </defs>
      <path d={`M ${area}`} className={fillClassName} fill="url(#sparkline-fill)" />
      <polyline
        fill="none"
        points={line}
        className={strokeClassName}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
