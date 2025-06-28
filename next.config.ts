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

  // Ensure all pages are statically generated
  experimental: {
    // Disable any server-side features
  },

  // Environment variables for ICP
  env: {
    NEXT_PUBLIC_IC_HOST: process.env.NODE_ENV === 'production'
      ? 'https://ic0.app'
      : 'http://localhost:4943',
    NEXT_PUBLIC_BACKEND_CANISTER_ID: process.env.NEXT_PUBLIC_BACKEND_CANISTER_ID,
  },

  // Ensure no server-side code is included
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure client-side only
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
