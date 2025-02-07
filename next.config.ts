import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "@chakra-ui/react",
      "@chakra-ui/icons",
      "react-icons",
      "date-fns",
      "framer-motion",
    ],
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: process.env.NODE_ENV !== "production",
  compress: true,
  i18n: {
    locales: ["en", "ru"],
    defaultLocale: "en",
    localeDetection: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    emotion: true,
  },
};

export default nextConfig;
