import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Configure image domains for Next.js
   */
  images: {
    /**
     * List of domains to allow image loading from
     */
    domains: ['news.peridot.com.np'],
  },
  /**
   * Other Next.js configurations can be added here
   */
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;