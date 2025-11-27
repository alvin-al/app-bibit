import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "app-bibit-be-production.up.railway.app",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
