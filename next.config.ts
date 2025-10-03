import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  allowedDevOrigins: process.env.REPLIT_DEV_DOMAIN 
    ? [process.env.REPLIT_DEV_DOMAIN, '127.0.0.1', 'localhost'] 
    : ['127.0.0.1', 'localhost'],
};

export default nextConfig;
