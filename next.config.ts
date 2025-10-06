import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "artitians-assets.s3.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;