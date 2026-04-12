import type { NextConfig } from "next";

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.replit.dev", "*.riker.replit.dev"],

  async rewrites() {
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
