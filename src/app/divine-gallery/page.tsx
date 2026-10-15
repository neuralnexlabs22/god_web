import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DeityPortrait from "@/components/DeityPortrait";
import { artworks, deities, devotionalAssets } from "@/data/devotional";

export default function DivineGalleryPage() {
  return (
    <div className="theme-light min-h-screen pt-28">
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="eyebrow text-grey-stone">Divine Gallery</p>
        <h1 className="section-title max-w-5xl text-black-deep">Hindu Deities, Temple Forms, And Sacred Artwork</h1>
        <p className="mt-7 max-w-3xl text-sm leading-8 text-black-charcoal/70">
          A curated visual archive of devotional forms, sacred temple architecture, sculptural details, and artwork studies.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 md:grid-cols-3 md:px-8">
        <Link href="/hindu-deities" className="gallery-card group block bg-black-deep text-white-pure md:col-span-2">
          <div className="relative min-h-[520px] overflow-hidden">
            <Image src={devotionalAssets.deityMontage.src} alt={devotionalAssets.deityMontage.alt} fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black-deep/88 to-transparent" />
            <div className="absolute bottom-0 p-8">
              <p className="eyebrow text-grey-stone">Twelve Sacred Forms</p>
              <h2 className="font-serif text-4xl">Hindu Deities</h2>
            </div>
          </div>
        </Link>
        <div className="grid gap-6">
          {artworks.slice(1).map((artwork) => (
            <Link key={artwork.slug} href={`/artworks/${artwork.slug}`} className="gallery-card group block bg-white-pure">
              <div className="relative min-h-[250px] overflow-hidden">
                <Image src={artwork.image.src} alt={artwork.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
              </div>
              <div className="border border-black-deep/15 p-5">
                <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-grey-stone">{artwork.type}</p>
                <h3 className="font-serif text-2xl text-black-deep">{artwork.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="theme-dark px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-grey-stone">Featured Deities</p>
              <h2 className="font-serif text-4xl uppercase text-white-pure">Explore Every Form</h2>
            </div>
            <Link href="/hindu-deities" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-white-ivory">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {deities.map((deity) => (
              <Link key={deity.slug} href={`/hindu-deities/${deity.slug}`} className="gallery-card group block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <DeityPortrait deity={deity} className="h-full w-full" imageClassName="group-hover:scale-110" />
                </div>
                <div className="p-4">
                  {deity.sacredTitle ? (
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#c9a227] font-semibold">{deity.sacredTitle}</p>
                  ) : null}
                  <h3 className="mt-1 font-serif text-xl text-white-pure">{deity.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
