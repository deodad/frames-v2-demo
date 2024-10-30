import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zora.co",
      },
    ],
  },
  // ConnectKit uses WalletConnect's SDK to help with connecting wallets. WalletConnect 2.0 pulls in Node.js dependencies that Next.js does not support by default.
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;
