import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '150mb', // Tăng lên 150MB để xử lý ~20 ảnh/chương
    },
  },
  // Empty turbopack config to silence warning (we don't need custom config)
  turbopack: {},
};

export default nextConfig;
