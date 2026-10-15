"use client";

import Link from "next/link";
import Logo from "./Logo";

const links = [
  ["God Photo Shop", "/shop"],
  ["Divine Gallery", "/divine-gallery"],
  ["Hindu Deities", "/hindu-deities"],
  ["Sacred Temples", "/sacred-temples"],
  ["Sacred Sculptures", "/sacred-sculptures"],
  ["Sacred Heritage", "/sacred-heritage"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export default function Footer() {
  return (
    <footer className="theme-dark border-t border-ornamental px-4 py-14 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.1fr_1.4fr_0.8fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-7 text-white-ivory/64">
            A premium divine gallery for Hindu deities, temple architecture, sacred sculpture, and handcrafted devotional frames.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-xs uppercase tracking-[0.22em] text-white-ivory/64 transition-colors hover:text-white-pure">
              {label}
            </Link>
          ))}
        </nav>
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-grey-stone">Studio Note</p>
          <p className="mt-4 text-sm leading-7 text-white-ivory/64">
            Built for further client customization with local image assets and reusable editorial sections.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-4 border-t border-ornamental pt-6 text-xs text-white-ivory/45 md:flex-row">
        <p>&copy; {new Date().getFullYear()} Frames of Divine. All rights reserved.</p>
        <p>Black and ivory editorial devotional experience.</p>
      </div>
    </footer>
  );
}
