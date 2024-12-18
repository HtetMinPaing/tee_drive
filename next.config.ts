import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "50MB"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com*'
      },
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io'
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com'
      }
    ]
  }
};

export default nextConfig;
