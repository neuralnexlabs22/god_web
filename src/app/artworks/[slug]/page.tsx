import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { artworks, getArtwork } from "@/data/devotional";

export function generateStaticParams() {
  return artworks.map((artwork) => ({ slug: artwork.slug }));
}

export default async function ArtworkPage(props: PageProps<"/artworks/[slug]">) {
  const { slug } = await props.params;
  const artwork = getArtwork(slug);
  if (!artwork) notFound();

  return (
    <div className="min-h-screen pt-28 bg-[#f4f0e8] text-black-deep">
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <Link href="/sacred-sculptures" className="mb-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-grey-stone hover:text-black-deep">
          <ArrowLeft className="h-4 w-4" /> Sculpture Gallery
        </Link>
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div className="relative min-h-[650px] overflow-hidden border border-black-deep/15">
            <Image src={artwork.image.src} alt={artwork.title} fill priority sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow text-grey-stone">{artwork.type}</p>
            <h1 className="font-serif text-5xl uppercase leading-none text-black-deep md:text-7xl">{artwork.title}</h1>
            <p className="mt-7 text-sm leading-8 text-black-charcoal/75">{artwork.description}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
