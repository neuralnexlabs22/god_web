import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DeityPortrait from "@/components/DeityPortrait";
import { deities, getDeity } from "@/data/devotional";

export function generateStaticParams() {
  return deities.map((deity) => ({ slug: deity.slug }));
}

export default async function DeityDetailPage(props: PageProps<"/hindu-deities/[slug]">) {
  const { slug } = await props.params;
  const deity = getDeity(slug);
  if (!deity) notFound();

  return (
    <div className="theme-dark min-h-screen pt-28">
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[0.95fr_1.05fr] md:px-8 md:items-center">
        <div className="relative min-h-[640px] overflow-hidden border border-ornamental">
          <DeityPortrait deity={deity} className="h-full min-h-[640px] w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black-deep/45 to-transparent" />
        </div>
        <div>
          <Link href="/hindu-deities" className="mb-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-grey-stone hover:text-white-pure">
            <ArrowLeft className="h-4 w-4" /> All Deities
          </Link>
          <p className="font-tamil text-lg text-grey-stone">{deity.tamilName}</p>
          <h1 className="mt-4 font-serif text-5xl uppercase leading-none text-white-pure md:text-7xl">{deity.name}</h1>
          <p className="mt-7 text-xl leading-8 text-white-ivory">{deity.title}</p>
          <p className="mt-7 max-w-2xl text-sm leading-8 text-white-ivory/72">{deity.description}</p>
          <div className="mt-10 border border-ornamental p-6">
            <p className="text-[10px] uppercase tracking-[0.28em] text-grey-stone">Sacred Symbol</p>
            <p className="mt-3 font-serif text-2xl text-white-pure">{deity.symbol}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
