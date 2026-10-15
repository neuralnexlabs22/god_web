import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { devotionalAssets } from "@/data/devotional";

export default function TamilHeritagePage() {
  return (
    <div className="theme-dark min-h-screen pt-28">
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:items-center">
        <div>
          <p className="eyebrow text-grey-stone">Sacred Heritage</p>
          <h1 className="section-title text-white-pure">Devotion Held In Stone, Bronze, Song, And Procession</h1>
          <p className="mt-7 text-sm leading-8 text-white-ivory/72">
            Sacred devotional culture is not a single object. It is architecture, music, inscription, sculpture, ritual movement,
            local memory, and the devotional imagination carried across generations.
          </p>
          <Link href="/divine-gallery" className="mt-9 inline-flex items-center gap-3 border border-white-pure/35 px-6 py-4 text-xs uppercase tracking-[0.22em] transition-cinematic hover:bg-white-pure hover:text-black-deep">
            Visit Gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative min-h-[560px] overflow-hidden border border-ornamental">
          <Image src={devotionalAssets.sculptures.src} alt={devotionalAssets.sculptures.alt} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
        </div>
      </section>
      <section className="theme-light px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {["Temple Craft", "Devotional Image", "Cultural Memory"].map((item, index) => (
            <article key={item} className="border border-black-deep/15 p-7">
              <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-grey-stone">0{index + 1}</p>
              <h2 className="font-serif text-3xl text-black-deep">{item}</h2>
              <p className="mt-5 text-sm leading-7 text-black-charcoal/70">
                {index === 0 && "Carving, proportion, corridor, and gopuram form a sacred architectural language."}
                {index === 1 && "Deity images become visual anchors for devotion, ritual, music, and festival life."}
                {index === 2 && "Heritage lives through stories, local practice, pilgrimage, and careful preservation."}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
