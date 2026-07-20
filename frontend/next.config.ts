import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - this is required by Next.js 14+ for local network access
  allowedDevOrigins: ["192.168.1.8"],
};
export default nextConfig;
