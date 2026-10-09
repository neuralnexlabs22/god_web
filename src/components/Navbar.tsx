"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Scale, Search, ShoppingCart, X } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { name: "Gallery", href: "/divine-gallery" },
  { name: "Shop", href: "/shop" },
  { name: "Deities", href: "/hindu-deities" },
  { name: "Temples", href: "/tamil-temples" },
  { name: "Sculptures", href: "/sacred-sculptures" },
  { name: "Heritage", href: "/tamil-heritage" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const categoryLinks = [
  ["God Photo Prints", "/shop/deity-prints"],
  ["Temple Prints", "/shop/temple-prints"],
  ["Sculpture Prints", "/shop/sculpture-prints"],
  ["Premium Sets", "/shop/premium-sets"],
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed left-0 top-0 z-50 w-full border-b border-ornamental bg-black-deep/92 backdrop-blur-md transition-cinematic ${scrolled ? "py-3" : "py-0"}`}>
      <div className="hidden border-b border-white-pure/10 px-4 py-2 text-center text-[10px] uppercase tracking-[0.18em] text-white-ivory/70 md:block">
        Traditional God Photo Prints & Devotional Artworks | Customization available | WhatsApp: 8122228386
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <button className="text-white-pure md:hidden" onClick={() => setIsOpen(true)} aria-label="Open navigation">
          <Menu className="h-6 w-6" />
        </button>
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} className={`group relative py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${active ? "text-white-pure" : "text-white-pure/72 hover:text-white-pure"}`}>
                {link.name}
                <span className={`absolute bottom-0 left-0 h-px bg-white-pure transition-cinematic ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-4 text-white-pure sm:flex">
          <Link href="/shop" aria-label="Search products" className="transition-colors hover:text-grey-stone"><Search className="h-5 w-5 stroke-[1.5]" /></Link>
          <Link href="/shop" aria-label="Wishlist" className="relative transition-colors hover:text-grey-stone"><Heart className="h-5 w-5 stroke-[1.5]" /><span className="absolute -right-2 -top-2 text-[9px]">0</span></Link>
          <Link href="/shop" aria-label="Compare" className="relative transition-colors hover:text-grey-stone"><Scale className="h-5 w-5 stroke-[1.5]" /><span className="absolute -right-2 -top-2 text-[9px]">0</span></Link>
          <Link href="/shop" aria-label="Cart" className="inline-flex items-center gap-2 border border-white-pure/25 px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition-cinematic hover:bg-white-pure hover:text-black-deep">
            <ShoppingCart className="h-4 w-4" /> 0 item(s)
          </Link>
        </div>
      </div>
      <nav className="hidden border-t border-white-pure/10 md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-8 overflow-x-auto px-8 py-3">
          {categoryLinks.map(([label, href]) => (
            <Link key={href} href={href} className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-white-ivory/65 transition-colors hover:text-white-pure">
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black-deep/98 p-6 backdrop-blur-xl md:hidden">
            <div className="mb-12 flex items-center justify-between border-b border-ornamental pb-6">
              <Logo />
              <button onClick={() => setIsOpen(false)} aria-label="Close navigation">
                <X className="h-6 w-6 text-white-pure" />
              </button>
            </div>
            <nav className="flex flex-col gap-7">
              {navLinks.map((link, index) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link href={link.href} onClick={() => setIsOpen(false)} className="font-serif text-3xl uppercase text-white-pure">
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
