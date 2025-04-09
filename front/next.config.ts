import type { NextConfig } from "next";
import path from 'node:path';


const nextConfig: NextConfig = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};

export default nextConfig;
