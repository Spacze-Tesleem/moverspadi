import type { NextConfig } from "next";

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

// Security headers applied to every response.
// CSP is intentionally permissive for the map/geocoding integrations;
// tighten per-route once all third-party origins are catalogued.
const securityHeaders = [
  // Prevent the page from being embedded in iframes (clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stop browsers from MIME-sniffing the content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send the origin as referrer when crossing origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features not used by the app.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), payment=()" },
  // Force HTTPS for 1 year in production; include subdomains.
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
  // Content Security Policy.
  // - default-src 'self': block everything not explicitly allowed.
  // - script-src 'self' 'unsafe-inline': Next.js inline scripts require unsafe-inline;
  //   replace with nonce-based CSP once Next.js supports it end-to-end.
  // - connect-src: backend API + Nominatim geocoding.
  // - img-src: allow data URIs (leaflet icons) and tile servers.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      `connect-src 'self' ${BACKEND_URL} https://nominatim.openstreetmap.org https://maps.googleapis.com`,
      "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://maps.gstatic.com https://maps.googleapis.com",
      "font-src 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.replit.dev",
    "*.riker.replit.dev",
    "*.picard.replit.dev",
    "*.gitpod.dev",
    "*.gitpod.io",
  ],

  // Empty turbopack config silences the "webpack config ignored" error.
  // HMR WebSocket failures on Gitpod preview URLs are a proxy limitation
  // and don't affect functionality — pages still reload on file changes.
  turbopack: {},

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async rewrites() {
    // Local dev only — on Vercel, vercel.json handles this rewrite instead.
    // Set NEXT_PUBLIC_API_URL=https://moverspadi.onrender.com in .env.local.
    if (!BACKEND_URL) return [];
    return [
      {
        source: "/backend/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
