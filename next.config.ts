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
  env: {
    OFD_TOKEN: process.env.OFD_TOKEN,
    OFD_API_URL: process.env.OFD_API_URL,
  },
};

export default nextConfig;
