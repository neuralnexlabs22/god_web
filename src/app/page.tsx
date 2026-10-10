"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { devotionalAssets } from "@/data/devotional";
import { devotionalProducts } from "@/data/devotionalProducts";
import DevotionalProductCard from "@/components/DevotionalProductCard";

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] } },
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.05]);

  return (
    <div ref={containerRef} className="overflow-hidden bg-black-deep text-white-pure">
      {/* HERO SECTION */}
      <section className="theme-light relative min-h-screen overflow-hidden border-b border-ornamental bg-[#f8f6f0]">
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <Image
            src={devotionalAssets.hero.src}
            alt={devotionalAssets.hero.alt}
            fill
            priority
            loading="eager"
            sizes="100vw"
            className="object-cover opacity-100 object-center brightness-[1.8] contrast-[1.1] saturate-[0.8]"
          />
          {/* Smoke vignette effect requested by user */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_80%,rgba(0,0,0,0.9)_100%)] mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
        </motion.div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pb-24 pt-32 md:px-8">
          <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.14 }} className="max-w-4xl drop-shadow-2xl">
            <motion.p variants={reveal} className="mb-5 font-tamil text-xs uppercase tracking-[0.38em] text-[#c9a227] [text-shadow:_0_2px_4px_rgba(0,0,0,0.8)]">
              தமிழ் தெய்வீக பாரம்பரியம்
            </motion.p>
            <motion.h1 variants={reveal} className="font-serif text-5xl font-medium uppercase leading-[0.94] tracking-normal text-white-pure md:text-7xl lg:text-8xl [text-shadow:_0_4px_16px_rgba(0,0,0,0.8)]">
              ETERNAL DIVINITY.
              <span className="block italic text-white-ivory">TIMELESS HERITAGE.</span>
            </motion.h1>
            <motion.p variants={reveal} className="mt-8 max-w-2xl text-base leading-8 text-white-ivory/90 md:text-lg [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
              Discover the sacred beauty of Hindu deities, Tamil temples, and centuries of Dravidian craftsmanship.
            </motion.p>
            <motion.div variants={reveal} className="mt-11 flex flex-col gap-4 sm:flex-row">
              <Link href="/shop" className="group inline-flex w-fit items-center gap-3 border border-white-pure bg-white-pure px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-black-deep transition-cinematic hover:bg-transparent hover:text-white-pure shadow-xl">
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SHOPPING SECTION - FEATURED PRODUCTS */}
      <section id="shop-section" className="theme-dark section-pad border-b border-ornamental bg-black-deep">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow text-[#c9a227]">Featured Collection</p>
              <h2 className="section-title text-white-pure mb-6">Devotional Prints</h2>
              <p className="text-white-ivory/70 text-base leading-relaxed">
                Explore our curated selection of premium fine-art prints. Each piece is carefully restored, color-graded, and printed on archival museum-quality paper to preserve the divine essence and intricate craftsmanship of ancient Dravidian temple art.
              </p>
            </div>
            <Link href="/shop" className="inline-flex w-fit items-center gap-3 border border-white-pure/30 px-6 py-4 text-xs uppercase tracking-[0.22em] text-white-pure transition-cinematic hover:border-white-pure">
              View All Prints <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="flex w-full gap-4 overflow-x-auto pb-8 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {devotionalProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="min-w-[260px] md:min-w-[300px] shrink-0 snap-start">
                <DevotionalProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link href="/shop" className="group inline-flex items-center gap-3 border border-[#c9a227] text-[#c9a227] px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] transition-cinematic hover:bg-[#c9a227] hover:text-black-deep">
              Explore Entire Shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
