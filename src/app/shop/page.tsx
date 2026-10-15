import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import DevotionalProductCard from "@/components/DevotionalProductCard";
import ShopProductGrid from "@/components/ShopProductGrid";
import { devotionalCategories, devotionalProducts } from "@/data/devotionalProducts";
import { devotionalAssets } from "@/data/devotional";

export default function ShopPage() {
  return (
    <div className="theme-light min-h-screen pt-28">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:items-center">
        <div>
          <p className="eyebrow text-grey-stone">God Photo Shop</p>
          <h1 className="section-title text-black-deep">Devotional Prints For Home, Pooja Room, And Gifting</h1>
          <p className="mt-7 max-w-2xl text-sm leading-8 text-black-charcoal/72">
            Shop premium Hindu deity photos, sacred temple prints, sculpture artwork, and curated devotional wall sets.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="#products" className="inline-flex w-fit items-center gap-3 border border-black-deep px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] transition-cinematic hover:bg-black-deep hover:text-white-pure">
              Shop Prints <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex w-fit items-center gap-3 border border-black-deep/25 px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] transition-cinematic hover:border-black-deep">
              Custom Order
            </Link>
          </div>
        </div>
        <div className="relative min-h-[520px] overflow-hidden border border-black-deep/15">
          <Image src={devotionalAssets.hero.src} alt={devotionalAssets.hero.alt} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
        </div>
      </section>

      <section className="theme-dark px-4 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-grey-stone">Collections</p>
              <h2 className="font-serif text-4xl uppercase text-white-pure">Shop By Devotional Category</h2>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {devotionalCategories.map((category) => (
              <Link key={category.slug} href={`/shop/${category.slug}`} className="group block border border-ornamental bg-black-charcoal">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={category.image} alt={category.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black-deep/86 to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <Sparkles className="mb-4 h-5 w-5 text-grey-stone" />
                    <h3 className="font-serif text-2xl text-white-pure">{category.name}</h3>
                    <p className="mt-3 text-xs leading-6 text-white-ivory/70">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="section-pad px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-grey-stone">Featured Products</p>
              <h2 className="section-title text-black-deep">Sacred Photo Prints</h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-black-charcoal/70">
              Browse divine deities, architectural temple wonders, and sanctum wall artwork with search, category filtering, and sorting.
            </p>
          </div>
          <ShopProductGrid
            initialProducts={devotionalProducts}
            categories={devotionalCategories.map((c) => ({ slug: c.slug, name: c.name }))}
          />
        </div>
      </section>
    </div>
  );
}
