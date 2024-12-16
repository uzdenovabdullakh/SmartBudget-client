import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Smart Budget",
  description: "App for your personal finance managemnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
