import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_KANJI_API_BASE: process.env.NEXT_PUBLIC_KANJI_API_BASE,
  },
};

export default nextConfig;
