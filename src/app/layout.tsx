import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import SiteChrome from "@/components/SiteChrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Frames of Divine | Devotional Art & Frames",
  description: "Shop premium Hindu devotional photo prints, framed deities, temple art, and sacred Dravidian architecture photography.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${playfair.variable} bg-black-deep text-white-pure`}>
      <body className="min-h-full flex flex-col font-sans transition-colors duration-700 ease-cinematic">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
