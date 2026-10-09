import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquare, ShoppingBag } from "lucide-react";
import { devotionalProducts, getDevotionalProduct } from "@/data/devotionalProducts";

export function generateStaticParams() {
  return devotionalProducts.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = getDevotionalProduct(slug);
  if (!product) notFound();

  return (
    <div className="theme-light min-h-screen pt-28">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1fr_0.9fr] md:px-8 md:items-start">
        <div>
          <Link href="/shop" className="mb-8 inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-grey-stone hover:text-black-deep">
            <ArrowLeft className="h-4 w-4" /> Shop
          </Link>
          <div className="relative min-h-[680px] overflow-hidden border border-black-deep/15 bg-black-deep">
            {product.cropPosition ? (
              <div
                className="absolute inset-0 bg-cover bg-no-repeat"
                role="img"
                aria-label={product.imageAlt}
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundPosition: product.cropPosition,
                  backgroundSize: "400% 300%",
                }}
              />
            ) : (
              <Image src={product.image} alt={product.imageAlt} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
            )}
          </div>
        </div>
        <div className="sticky top-28 border border-black-deep/15 bg-white-pure p-7">
          <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-grey-stone">{product.category}</p>
          <h1 className="font-serif text-4xl uppercase leading-none text-black-deep md:text-5xl">{product.name}</h1>
          <p className="mt-6 text-sm leading-8 text-black-charcoal/72">{product.description}</p>
          <p className="mt-5 text-sm font-semibold text-black-deep">{product.size}</p>
          <div className="mt-8 flex items-end gap-3">
            <span className="font-serif text-4xl text-black-deep">₹{product.price.toLocaleString("en-IN")}</span>
            {product.originalPrice && <span className="pb-1 text-sm text-grey-stone line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>}
          </div>
          <div className="mt-8 grid gap-3">
            <button className="inline-flex items-center justify-center gap-3 border border-black-deep bg-black-deep px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white-pure transition-cinematic hover:bg-white-pure hover:text-black-deep">
              <ShoppingBag className="h-4 w-4" /> Add To Cart
            </button>
            <Link href="/contact" className="inline-flex items-center justify-center gap-3 border border-black-deep px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-black-deep transition-cinematic hover:bg-black-deep hover:text-white-pure">
              <MessageSquare className="h-4 w-4" /> WhatsApp / Custom Order
            </Link>
          </div>
          <div className="mt-8 grid gap-3 text-xs leading-6 text-black-charcoal/65">
            <p>Premium devotional print for home, pooja room, gifting, and wall decor.</p>
            <p>Frame, size, and bulk order customization available on request.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
