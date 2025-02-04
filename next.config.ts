import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  i18n: {
    locales: ["en", "ru"],
    defaultLocale: "en",
  },
};

export default nextConfig;
