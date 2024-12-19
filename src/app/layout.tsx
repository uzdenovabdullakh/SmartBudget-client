import type { Metadata } from "next";
import "../styles/fonts/fonts.css";
import Favicon from "@/components/ui/Favicon";
import Providers from "./provider";

export const metadata: Metadata = {
  title: "Smart Budget",
  description: "App for your personal finance management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Favicon />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
