import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  reactStrictMode: true,
  i18n: {
    locales: ["en", "ru"],
    defaultLocale: "en",
    localeDetection: false,
  },
};

export default nextConfig;
