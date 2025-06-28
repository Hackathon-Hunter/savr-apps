import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },

  // Disable server-side features for static export
  reactStrictMode: true,
  swcMinify: true,

  // Environment variables for ICP
  env: {
    NEXT_PUBLIC_IC_HOST: process.env.NODE_ENV === 'production'
      ? 'https://ic0.app'
      : 'http://localhost:4943',
    NEXT_PUBLIC_BACKEND_CANISTER_ID: process.env.NEXT_PUBLIC_BACKEND_CANISTER_ID,
  }
};

export default nextConfig;
