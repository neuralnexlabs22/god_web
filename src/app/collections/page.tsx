"use client";

import { collections } from "@/data/products";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Collections() {
  return (
    <div className="pt-24 pb-24 bg-black-deep min-h-screen text-white-pure">
      {/* Header Banner */}
      <div className="bg-[#050505] border-b border-ornamental py-16 mb-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#c9a227]/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <p className="text-[#c9a227] text-xs md:text-sm tracking-[0.3em] uppercase font-bold mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c9a227]" />
            Frames of Divine &bull; Sacred Collections
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-medium tracking-tight uppercase text-white-pure">
            Curated Devotional Collections
          </h1>
          <p className="mt-4 text-white-ivory/70 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Explore authentic Hindu deity artwork, monumental temple corridors, sacred Dravidian sculpture studies, and complete pooja room sets.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col space-y-16 md:space-y-24">
          {collections.map((collection, index) => (
            <motion.div 
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${
                index % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Collection Image */}
              <div className="w-full lg:w-3/5 aspect-[4/3] relative overflow-hidden bg-zinc-950 group rounded-2xl border border-ornamental shadow-2xl">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-transparent to-transparent" />
              </div>

              {/* Collection Details */}
              <div className="w-full lg:w-2/5 flex flex-col justify-center text-center lg:text-left px-4">
                <span className="text-[#c9a227] uppercase tracking-[0.25em] text-[10px] font-bold mb-3">
                  COLLECTION #0{index + 1}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-white-pure mb-5 uppercase tracking-wide">
                  {collection.name}
                </h2>
                <p className="text-white-ivory/70 font-normal leading-relaxed mb-8 text-sm">
                  {collection.description} Handcrafted with archival paper, custom teak framing, and museum-grade color calibration.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center space-x-3 text-black bg-[#c9a227] hover:brightness-110 transition-all px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg mx-auto lg:mx-0 w-fit"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
