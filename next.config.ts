import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.dailytarot.org',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
