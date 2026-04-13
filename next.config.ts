import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok domains for development
  allowedDevOrigins: [
    'purging-guide-caption.ngrok-free.dev',
    'localhost:3000',
  ],
};

export default nextConfig;
