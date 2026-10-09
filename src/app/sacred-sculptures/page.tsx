import Image from "next/image";
import Link from "next/link";
import { artworks, devotionalAssets } from "@/data/devotional";

export default function SacredSculpturesPage() {
  return (
    <div className="theme-light min-h-screen pt-28">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1fr_1fr] md:px-8 md:items-end">
        <div>
          <p className="eyebrow text-grey-stone">Sacred Sculptures</p>
          <h1 className="section-title text-black-deep">Bronze Icons, Stone Guardians, And Temple Reliefs</h1>
        </div>
        <p className="text-sm leading-8 text-black-charcoal/70">
          A focused gallery of sculptural surfaces: yali guardians, friezes, bronze devotional icons, lotus carving, and architectural fragments.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="relative mb-6 min-h-[560px] overflow-hidden border border-black-deep/15">
          <Image src={devotionalAssets.sculptures.src} alt={devotionalAssets.sculptures.alt} fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {artworks.map((artwork) => (
            <Link href={`/artworks/${artwork.slug}`} key={artwork.slug} className="border border-black-deep/15 p-6 transition-cinematic hover:bg-black-deep hover:text-white-pure">
              <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-grey-stone">{artwork.type}</p>
              <h2 className="font-serif text-2xl">{artwork.title}</h2>
              <p className="mt-4 text-sm leading-7 opacity-70">{artwork.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
