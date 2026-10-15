"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { devotionalAssets } from "@/data/devotional";
import { devotionalProducts } from "@/data/devotionalProducts";
import DevotionalProductCard from "@/components/DevotionalProductCard";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { useHomepageContent } from "@/context/HomepageContentContext";
import { useProducts } from "@/context/ProductContext";

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] as const } },
};

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.05]);

  const { getSection } = useHomepageContent();
  const heroConfig = getSection("hero") as { title?: string; subtitle?: string } | undefined;

  const { products: liveProducts, loaded } = useProducts();
  const displayProducts = (loaded && liveProducts.length > 0)
    ? liveProducts.map((p) => ({
        id: p.id,
        slug: p.id.startsWith("prod-") ? p.id.replace("prod-", "") : p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice || Math.round(p.price * 1.35),
        description: p.description,
        image: p.images?.[0] || "/assets/devotional/deity-gallery-montage.png",
        imageAlt: p.name,
        badge: p.brand || p.category,
        size: p.sizes?.[0] || "Archival Print",
      }))
    : devotionalProducts;

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
            className="object-cover opacity-95 object-center md:object-[center_25%]"
          />
          {/* Natural shading to preserve rich gold foil luster and jewel tones */}
          <div className="absolute inset-0 bg-gradient-to-t from-black-deep/90 via-black-deep/35 to-black-deep/15" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_85%,rgba(0,0,0,0.85)_100%)]" />
        </motion.div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pb-24 pt-32 md:px-8">
          <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.14 }} className="max-w-4xl drop-shadow-2xl">
            <motion.h1 variants={reveal} className="font-serif text-5xl font-medium uppercase leading-[0.94] tracking-normal text-white-pure md:text-7xl lg:text-8xl [text-shadow:_0_4px_16px_rgba(0,0,0,0.8)]">
              {heroConfig?.title ? (
                heroConfig.title
              ) : (
                <>
                  22 KT GOLD
                  <span className="block italic text-white-ivory">TANJORE PAINTING</span>
                </>
              )}
            </motion.h1>
            <motion.p variants={reveal} className="mt-8 max-w-2xl text-base leading-8 text-white-ivory/90 md:text-lg [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]">
              {heroConfig?.subtitle ||
                "Discover the sacred beauty of Hindu deities, divine temples, and centuries of sacred heritage craftsmanship."}
            </motion.p>
            <motion.div variants={reveal} className="mt-11 flex flex-col gap-4 sm:flex-row">
              <Link href="/shop" className="group inline-flex w-fit items-center gap-3 border border-white-pure bg-white-pure px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-black-deep transition-cinematic hover:bg-transparent hover:text-white-pure shadow-xl">
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/custom-order" className="inline-flex w-fit items-center gap-3 border border-white-pure/40 px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-white-pure transition-cinematic hover:bg-white-pure hover:text-black-deep shadow-xl backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-[#c9a227]" />
                Custom Devotional Order
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
            {displayProducts.slice(0, 8).map((product) => (
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

      {/* CUSTOMER TESTIMONIALS CAROUSEL */}
      <TestimonialCarousel />
    </div>
  );
}
