import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
      {
        protocol: "https",
        hostname: "thedailynewtimes.com",
      },
    ],
  },
};

export default withPayload(nextConfig);
