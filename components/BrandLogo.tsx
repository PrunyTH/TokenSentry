/**
 * TokenSentry brand logo — inline SVG (shield + honeycomb + wordmark).
 * Uses Montserrat SemiBold loaded by Next.js; works correctly as inline SVG.
 */

const SHIELD = "M 14 16 L 86 16 L 86 58 C 86 80 50 93 50 93 C 50 93 14 80 14 58 Z";

// Seven flat-top hexagons in honeycomb formation (r=8, centres spaced for r=9)
const HEX_POINTS = [
  "50,60 56.93,56 56.93,48 50,44 43.07,48 43.07,56",           // centre
  "42.2,46.5 49.13,42.5 49.13,34.5 42.2,30.5 35.27,34.5 35.27,42.5", // top-left
  "57.8,46.5 64.73,42.5 64.73,34.5 57.8,30.5 50.87,34.5 50.87,42.5", // top-right
  "34.4,60 41.33,56 41.33,48 34.4,44 27.47,48 27.47,56",        // mid-left
  "65.6,60 72.53,56 72.53,48 65.6,44 58.67,48 58.67,56",        // mid-right
  "42.2,73.5 49.13,69.5 49.13,61.5 42.2,57.5 35.27,61.5 35.27,69.5", // bot-left
  "57.8,73.5 64.73,69.5 64.73,61.5 57.8,57.5 50.87,61.5 50.87,69.5", // bot-right
];

function ShieldIcon() {
  return (
    <>
      <path
        d={SHIELD}
        fill="rgba(216,173,96,0.07)"
        stroke="#D8AD60"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {HEX_POINTS.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="rgba(216,173,96,0.09)"
          stroke="#D8AD60"
          strokeWidth="1.3"
        />
      ))}
    </>
  );
}

/** Full logo: icon + "Token Sentry" wordmark */
export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 100"
      className={className}
      aria-label="Token Sentry"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="scale(0.95)">
        <ShieldIcon />
      </g>
      <text
        x="100"
        y="62"
        fontSize="36"
        fontWeight="600"
        letterSpacing="1.2"
        fill="#D8AD60"
        style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
      >
        Token Sentry
      </text>
    </svg>
  );
}

/** Icon only: for compact / square contexts */
export function BrandIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-label="Token Sentry icon"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ShieldIcon />
    </svg>
  );
}
