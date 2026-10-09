import Image from "next/image";
import Link from "next/link";
import { Heart, HelpCircle, Scale, ShoppingBag, Zap } from "lucide-react";
import type { DevotionalProduct } from "@/data/devotionalProducts";

export default function DevotionalProductCard({ product }: { product: DevotionalProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block border border-black-deep/15 bg-white-pure">
      <div className="relative aspect-[4/5] overflow-hidden bg-black-deep">
        {product.cropPosition ? (
          <div
            className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-[1200ms] ease-cinematic group-hover:scale-110"
            role="img"
            aria-label={product.imageAlt}
            style={{
              backgroundImage: `url(${product.image})`,
              backgroundPosition: product.cropPosition,
              backgroundSize: "400% 300%",
            }}
          />
        ) : (
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-110"
          />
        )}
        <div className="absolute left-3 top-3 bg-white-pure px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black-deep">
          {product.badge}
        </div>
        <div className="absolute bottom-3 right-3 flex translate-y-3 flex-col gap-2 opacity-0 transition-cinematic group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex h-9 w-9 items-center justify-center bg-white-pure text-black-deep"><Heart className="h-4 w-4" /></span>
          <span className="inline-flex h-9 w-9 items-center justify-center bg-white-pure text-black-deep"><Scale className="h-4 w-4" /></span>
          <span className="inline-flex h-9 w-9 items-center justify-center bg-white-pure text-black-deep"><HelpCircle className="h-4 w-4" /></span>
        </div>
      </div>
      <div className="p-4 transition-cinematic group-hover:bg-black-deep group-hover:text-white-pure">
        <p className="text-[10px] uppercase tracking-[0.22em] text-grey-stone">{product.category}</p>
        <h3 className="mt-2 min-h-[3rem] font-serif text-xl leading-tight">{product.name}</h3>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <span className="font-semibold">₹{product.price.toLocaleString("en-IN")}</span>
            {product.originalPrice && (
              <span className="ml-2 text-xs text-grey-stone line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <span className="inline-flex items-center justify-center gap-2 border border-current px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
            <ShoppingBag className="h-3.5 w-3.5" /> Cart
          </span>
          <span className="inline-flex items-center justify-center gap-2 bg-black-deep px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white-pure group-hover:bg-white-pure group-hover:text-black-deep">
            <Zap className="h-3.5 w-3.5" /> Buy
          </span>
        </div>
      </div>
    </Link>
  );
}
