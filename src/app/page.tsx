"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import DeityPortrait from "@/components/DeityPortrait";
import DevotionalProductCard from "@/components/DevotionalProductCard";
import { artworks, deities, devotionalAssets, templeCollections } from "@/data/devotional";
import { devotionalProducts } from "@/data/devotionalProducts";

const reveal = {
  hidden: { opacity: 0, y: 42 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, 150]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.08]);

  return (
    <div className="overflow-hidden bg-black-deep text-white-pure">
      <section className="theme-dark relative min-h-screen overflow-hidden border-b border-ornamental">
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <Image
            src={devotionalAssets.hero.src}
            alt={devotionalAssets.hero.alt}
            fill
            priority
            loading="eager"
            sizes="100vw"
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.94),rgba(8,8,8,0.52)_42%,rgba(8,8,8,0.15))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,transparent_0,rgba(8,8,8,0.18)_35%,#080808_100%)]" />
        </motion.div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pb-24 pt-32 md:px-8">
          <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.14 }} className="max-w-4xl">
            <motion.p variants={reveal} className="mb-5 font-tamil text-xs uppercase tracking-[0.38em] text-grey-stone">
              தமிழ் தெய்வீக பாரம்பரியம்
            </motion.p>
            <motion.h1 variants={reveal} className="font-serif text-5xl font-medium uppercase leading-[0.94] tracking-normal text-white-pure md:text-7xl lg:text-8xl">
              ETERNAL DIVINITY.
              <span className="block italic text-white-ivory">TIMELESS HERITAGE.</span>
            </motion.h1>
            <motion.p variants={reveal} className="mt-8 max-w-2xl text-base leading-8 text-white-ivory/80 md:text-lg">
              Discover the sacred beauty of Hindu deities, Tamil temples, and centuries of Dravidian craftsmanship.
            </motion.p>
            <motion.div variants={reveal} className="mt-11 flex flex-col gap-4 sm:flex-row">
              <Link href="/divine-gallery" className="group inline-flex w-fit items-center gap-3 border border-white-pure px-7 py-4 text-xs font-semibold uppercase tracking-[0.22em] transition-cinematic hover:bg-white-pure hover:text-black-deep">
                Explore Divine Gallery
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/tamil-temples" className="inline-flex w-fit items-center gap-3 border border-white-pure/25 px-7 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white-ivory transition-cinematic hover:border-white-pure">
                Temple Heritage
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white-pure/70">
          <ChevronDown className="h-7 w-7" />
        </motion.div>
      </section>

      <section className="theme-light section-pad border-b border-ornamental">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} transition={{ staggerChildren: 0.12 }} className="mb-14 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <motion.div variants={reveal}>
              <p className="eyebrow text-grey-stone">Featured Deities</p>
              <h2 className="section-title text-black-deep">A Living Gallery Of Sacred Forms</h2>
            </motion.div>
            <motion.p variants={reveal} className="max-w-2xl text-sm leading-7 text-black-charcoal/70 md:justify-self-end">
              Explore devotional portraits, temple artwork, and sacred forms through a premium Tamil heritage gallery.
            </motion.p>
          </motion.div>

          <div className="compact-deity-grid">
              {deities.map((deity, index) => (
                <motion.div key={deity.slug} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.68, delay: index * 0.065, ease: [0.65, 0, 0.35, 1] }}>
                  <Link href={`/hindu-deities/${deity.slug}`} className="gallery-card deity-card group block bg-white-pure">
                    <div className="relative aspect-[4/5] overflow-hidden bg-black-deep">
                      <DeityPortrait deity={deity} className="h-full w-full" imageClassName="group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black-deep/86 via-black-deep/12 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white-pure">
                        <p className="mb-1 font-tamil text-[11px] text-white-ivory/75">{deity.tamilName}</p>
                        <h3 className="font-serif text-xl leading-tight">{deity.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border border-t-0 border-black-deep/15 px-4 py-3 text-black-deep transition-cinematic group-hover:bg-black-deep group-hover:text-white-pure">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-grey-stone">{String(index + 1).padStart(2, "0")}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/hindu-deities" className="inline-flex items-center gap-3 border border-black-deep px-7 py-4 text-xs font-semibold uppercase tracking-[0.22em] transition-cinematic hover:bg-black-deep hover:text-white-pure">
              View All Sacred Forms <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="theme-dark section-pad border-b border-ornamental">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
            <p className="eyebrow text-grey-stone">Tamil Temple Collections</p>
            <h2 className="section-title text-white-pure">Gopurams, Yali Pillars, And Processional Corridors</h2>
            <p className="mt-7 text-sm leading-8 text-white-ivory/70">
              Temple architecture becomes a visual rhythm: deep shade, towering gateways, stone guardians, carved stories, and the measured silence of mandapam halls.
            </p>
            <Link href="/tamil-temples" className="mt-9 inline-flex items-center gap-3 border border-white-pure/40 px-6 py-4 text-xs uppercase tracking-[0.22em] transition-cinematic hover:bg-white-pure hover:text-black-deep">
              View Temples <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }} whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }} viewport={{ once: true, margin: "-90px" }} transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }} className="relative min-h-[560px] overflow-hidden border border-ornamental">
            <Image src={devotionalAssets.temple.src} alt={devotionalAssets.temple.alt} fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
          </motion.div>
        </div>
      </section>

      <section className="theme-light section-pad border-b border-ornamental">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-grey-stone">God Photo Shop</p>
              <h2 className="section-title text-black-deep">Devotional Prints Ready To Buy</h2>
            </div>
            <Link href="/shop" className="inline-flex w-fit items-center gap-3 border border-black-deep px-6 py-4 text-xs uppercase tracking-[0.22em] transition-cinematic hover:bg-black-deep hover:text-white-pure">
              Open Shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {devotionalProducts.slice(0, 8).map((product) => (
              <DevotionalProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="theme-light section-pad border-b border-ornamental">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-grey-stone">Sacred Sculpture Gallery</p>
              <h2 className="section-title text-black-deep">Carved Stone, Bronze Icons, Living Detail</h2>
            </div>
            <Link href="/sacred-sculptures" className="inline-flex w-fit items-center gap-3 border border-black-deep px-6 py-4 text-xs uppercase tracking-[0.22em] transition-cinematic hover:bg-black-deep hover:text-white-pure">
              Open Gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {artworks.map((artwork, index) => (
              <motion.div key={artwork.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: index * 0.1 }}>
                <Link href={`/artworks/${artwork.slug}`} className="gallery-card group block bg-white-pure">
                  <div className="relative aspect-[4/5] overflow-hidden bg-black-deep">
                    <Image src={artwork.image.src} alt={artwork.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[1400ms] ease-cinematic group-hover:scale-110" />
                  </div>
                  <div className="border border-t-0 border-black-deep/15 p-5 transition-cinematic group-hover:bg-black-deep group-hover:text-white-pure">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.26em] text-grey-stone">{artwork.type}</p>
                    <h3 className="font-serif text-2xl">{artwork.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="theme-dark section-pad">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid gap-10 border border-ornamental p-8 md:grid-cols-[1fr_0.9fr] md:p-14">
            <div>
              <p className="eyebrow text-grey-stone">Cultural Heritage</p>
              <h2 className="section-title text-white-pure">A Monochrome Rhythm For Devotional Storytelling</h2>
            </div>
            <div className="space-y-6 text-sm leading-8 text-white-ivory/72">
              <p>
                The site alternates between black exhibition spaces and warm ivory reading sections, creating a deliberate inversion as visitors move from deity portraits to architecture, sculpture, and heritage narratives.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {templeCollections.map((item) => (
                  <Link key={item.slug} href="/tamil-temples" className="border border-white-pure/15 p-4 transition-cinematic hover:bg-white-pure hover:text-black-deep">
                    <span className="block text-[10px] uppercase tracking-[0.22em] opacity-60">{item.kicker}</span>
                    <span className="mt-2 block font-serif text-xl">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
