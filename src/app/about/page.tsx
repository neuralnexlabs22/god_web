import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { devotionalAssets } from "@/data/devotional";

const sections = [
  {
    title: "Devotional Image",
    text: "The gallery treats deity imagery with visual restraint, strong framing, and readable context so the site can serve as a premium devotional portfolio.",
  },
  {
    title: "Tamil Temple Craft",
    text: "Gopurams, yali pillars, mandapam corridors, and sacred stone reliefs shape the visual language across the experience.",
  },
  {
    title: "Ready For Customization",
    text: "The content is centralized, route-driven, and asset-backed so additional client images and written histories can be added without rebuilding the site.",
  },
];

export default function AboutPage() {
  return (
    <div className="theme-light min-h-screen pt-28">
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:items-center">
        <div>
          <p className="eyebrow text-grey-stone">About</p>
          <h1 className="section-title text-black-deep">A Premium Tamil Devotional Visual Archive</h1>
          <p className="mt-7 text-sm leading-8 text-black-charcoal/72">
            Sacred Tamil Gallery presents Hindu deity imagery, South Indian temple architecture, and Dravidian sculpture with a refined black-and-white editorial rhythm.
          </p>
          <Link href="/divine-gallery" className="mt-9 inline-flex items-center gap-3 border border-black-deep px-6 py-4 text-xs uppercase tracking-[0.22em] transition-cinematic hover:bg-black-deep hover:text-white-pure">
            Explore The Gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative min-h-[560px] overflow-hidden border border-black-deep/15">
          <Image src={devotionalAssets.hero.src} alt={devotionalAssets.hero.alt} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
        </div>
      </section>
      <section className="theme-dark px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {sections.map((section, index) => (
            <article key={section.title} className="border border-ornamental p-7">
              <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-grey-stone">0{index + 1}</p>
              <h2 className="font-serif text-3xl text-white-pure">{section.title}</h2>
              <p className="mt-5 text-sm leading-7 text-white-ivory/70">{section.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
