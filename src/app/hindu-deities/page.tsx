import Image from "next/image";
import Link from "next/link";
import DeityPortrait from "@/components/DeityPortrait";
import { deities, devotionalAssets } from "@/data/devotional";

export default function HinduDeitiesPage() {
  return (
    <div className="theme-dark min-h-screen pt-28">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:items-center">
        <div>
          <p className="eyebrow text-grey-stone">Hindu Deities</p>
          <h1 className="section-title text-white-pure">Sacred Forms Across Devotion And Temple Art</h1>
          <p className="mt-7 text-sm leading-8 text-white-ivory/72">
            Twelve featured deity pages with devotional context, Tamil names, symbols, and visual detail.
          </p>
        </div>
        <div className="relative min-h-[440px] overflow-hidden border border-ornamental">
          <Image src={devotionalAssets.deityMontage.src} alt={devotionalAssets.deityMontage.alt} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
        </div>
      </section>

      <section className="theme-light px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deities.map((deity) => (
            <Link key={deity.slug} href={`/hindu-deities/${deity.slug}`} className="gallery-card group block bg-white-pure">
              <div className="relative aspect-[4/5] overflow-hidden bg-black-deep">
                <DeityPortrait deity={deity} className="h-full w-full" imageClassName="group-hover:scale-110" />
              </div>
              <div className="border border-black-deep/15 p-6 transition-cinematic group-hover:bg-black-deep group-hover:text-white-pure">
                <p className="font-tamil text-sm text-grey-stone">{deity.tamilName}</p>
                <h2 className="mt-2 font-serif text-3xl">{deity.name}</h2>
                <p className="mt-4 text-sm leading-7 opacity-75">{deity.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
