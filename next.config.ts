import type { NextConfig } from "next";

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

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
