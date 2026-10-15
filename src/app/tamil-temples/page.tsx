import Image from "next/image";
import { devotionalAssets, templeCollections } from "@/data/devotional";

export default function TamilTemplesPage() {
  return (
    <div className="theme-dark min-h-screen pt-28">
      <section className="relative min-h-[72vh] overflow-hidden">
        <Image src={devotionalAssets.temple.src} alt={devotionalAssets.temple.alt} fill priority sizes="100vw" className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black-deep via-black-deep/55 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center px-4 md:px-8">
          <p className="eyebrow text-grey-stone">Sacred Temples</p>
          <h1 className="section-title max-w-5xl text-white-pure">Gopurams, Yali Pillars, And Dravidian Stone Rhythm</h1>
        </div>
      </section>
      <section className="theme-light px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {templeCollections.map((item) => (
            <article key={item.slug} className="border border-black-deep/15 bg-white-pure">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={item.image.src} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6">
                <p className="eyebrow text-grey-stone">{item.kicker}</p>
                <h2 className="font-serif text-3xl text-black-deep">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-black-charcoal/70">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
