import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const notoSansTamil = Noto_Sans_Tamil({ subsets: ["tamil"], weight: ["400", "500", "700"], variable: "--font-noto-tamil" });

export const metadata: Metadata = {
  title: "Sacred Tamil Gallery | Devotional Art & Prints",
  description: "Shop premium Hindu devotional photo prints, Tamil temple art, and sacred Dravidian architecture photography.",
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
    <html lang="en" className={`h-full antialiased ${inter.variable} ${playfair.variable} ${notoSansTamil.variable} bg-black-deep text-white-pure`}>
      <body className="min-h-full flex flex-col font-sans transition-colors duration-700 ease-cinematic">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
