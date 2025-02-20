import "./globals.css";

import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Pokemon List - Next.js App",
  description: "A Pokemon list app built with Next.js and PokeAPI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
