/**
 * TokenSentry brand logo — Sentry Eye with honeycomb iris.
 * Inline SVG: scales perfectly, uses Montserrat loaded by Next.js.
 *
 * Icon concept: almond eye silhouette with 7-hex honeycomb iris + white pupil.
 * The eye = protection/surveillance. The honeycomb = structured intelligence.
 */

// Almond eye outline path (left tip → top arc → right tip → bottom arc)
const EYE_PATH = "M 8 50 Q 50 14 92 50 Q 50 86 8 50 Z";

// Iris circle params
const IRIS_R = 19;

// Seven flat-top hexagons inside the iris (r=4 each, tight honeycomb)
const HEX_POINTS = [
  "50,54 53.46,52 53.46,48 50,46 46.54,48 46.54,52",              // centre
  "46.1,47.25 49.56,45.25 49.56,41.25 46.1,39.25 42.64,41.25 42.64,45.25", // top-left
  "53.9,47.25 57.36,45.25 57.36,41.25 53.9,39.25 50.44,41.25 50.44,45.25", // top-right
  "42.21,54 45.67,52 45.67,48 42.21,46 38.75,48 38.75,52",         // mid-left
  "57.79,54 61.25,52 61.25,48 57.79,46 54.33,48 54.33,52",         // mid-right
  "46.1,60.75 49.56,58.75 49.56,54.75 46.1,52.75 42.64,54.75 42.64,58.75", // bot-left
  "53.9,60.75 57.36,58.75 57.36,54.75 53.9,52.75 50.44,54.75 50.44,58.75", // bot-right
];

// 12 tick marks around the iris edge (every 30°)
const IRIS_TICKS = Array.from({ length: 12 }, (_, i) => {
  const θ = (i * 30 * Math.PI) / 180;
  const cos = Math.cos(θ), sin = Math.sin(θ);
  return {
    x1: 50 + IRIS_R * cos,       y1: 50 + IRIS_R * sin,
    x2: 50 + (IRIS_R + 3) * cos, y2: 50 + (IRIS_R + 3) * sin,
  };
});

function EyeIcon() {
  return (
    <>
      {/* Outer eye almond */}
      <path d={EYE_PATH} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />

      {/* Horizontal scan lines (iris edge → eye tip) */}
      <line x1="8"  y1="50" x2={50 - IRIS_R} y2="50" stroke="#ffffff" strokeWidth="0.8" opacity="0.35" />
      <line x1={50 + IRIS_R} y1="50" x2="92" y2="50" stroke="#ffffff" strokeWidth="0.8" opacity="0.35" />

      {/* Iris ring */}
      <circle cx="50" cy="50" r={IRIS_R} fill="rgba(255,255,255,0.03)" stroke="#ffffff" strokeWidth="1.6" />

      {/* Iris tick marks */}
      {IRIS_TICKS.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="#ffffff" strokeWidth="0.9" opacity="0.45" />
      ))}

      {/* Honeycomb hexagons inside iris */}
      {HEX_POINTS.map((pts, i) => (
        <polygon key={i} points={pts}
                 fill="rgba(255,255,255,0.06)" stroke="#ffffff" strokeWidth="0.9" />
      ))}

      {/* Pupil — bright white dot with blue core */}
      <circle cx="50" cy="50" r="4.5" fill="#ffffff" opacity="0.92" />
      <circle cx="50" cy="50" r="2.2" fill="#00bfff" opacity="0.7" />
    </>
  );
}

/** Full logo: eye icon + "Token Sentry" wordmark */
export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 100"
      className={className}
      aria-label="Token Sentry"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="scale(0.95)">
        <EyeIcon />
      </g>
      <text
        x="100"
        y="62"
        fontSize="36"
        fontWeight="600"
        letterSpacing="1.2"
        fill="#ffffff"
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
      <EyeIcon />
    </svg>
  );
}
