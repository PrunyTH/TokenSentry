import type { NextConfig } from "next";

// ── Content Security Policy ───────────────────────────────────────────────────
// 'unsafe-inline' on scripts is required for Next.js hydration and the
// Google Analytics inline gtag config block. Tighten with nonces if needed.
const ContentSecurityPolicy = [
  "default-src 'self'",
  // Next.js inline scripts + Google Analytics
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  // Tailwind inline styles + Google Fonts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Google Fonts assets
  "font-src 'self' data: https://fonts.gstatic.com",
  // Token logos from CoinGecko and other CDNs
  "img-src 'self' data: blob: https:",
  // All our API calls go to external HTTPS endpoints
  "connect-src 'self' https:",
  // No iframes allowed
  "frame-src 'none'",
  // Block plugins / Flash / etc.
  "object-src 'none'",
  // Prevent base-tag injection
  "base-uri 'self'",
  // Only allow form submissions to same origin
  "form-action 'self'",
  // Force HTTPS for all subresource loads
  "upgrade-insecure-requests",
].join("; ");

// ── Security headers ──────────────────────────────────────────────────────────
const securityHeaders = [
  {
    // Prevent content-type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Clickjacking protection — allow same-origin framing only
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Force HTTPS for 2 years; include subdomains; submit to preload list
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Limit referrer data sent cross-origin
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Disable unnecessary browser features
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // DNS prefetch speeds up external links
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
];

// ── Next.js config ────────────────────────────────────────────────────────────
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
