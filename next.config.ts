import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '150mb', // Tăng lên 150MB để xử lý ~20 ảnh/chương
    },
  },
  // Empty turbopack config to silence warning (we don't need custom config)
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-c4503e185ff04871a0e98182fc18822b.r2.dev', // R2 Storage domain
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google avatar
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
