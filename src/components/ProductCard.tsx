"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    slug?: string;
    name: string;
    brand?: string;
    price: number;
    images: string[];
    category: string;
    isNew?: boolean;
  };
}

function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div
      className="group flex flex-col bg-transparent border border-transparent p-0 transition-colors duration-200 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-black-deep mb-4 border border-ornamental" style={{ position: "relative" }}>
        {product.isNew && (
          <span className="absolute top-4 left-4 z-10 bg-white-pure text-black-deep text-[9px] font-medium uppercase tracking-[0.15em] px-3 py-1 shadow-sm">
            NEW
          </span>
        )}
        <Link href={`/products/${product.slug || product.id}`} className="relative block w-full h-full">
          <Image
            src={product.images[0] || "https://placehold.co/600x800/080808/B8B8B8?text=Artifact"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover transition-transform duration-[1s] ease-cinematic ${
              isHovered ? "scale-105 filter grayscale-0" : "scale-100 filter grayscale"
            }`}
            loading="lazy"
          />
        </Link>
        <div
          className={`absolute bottom-4 right-4 flex gap-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-3 bg-black-deep/90 text-white-pure hover:bg-white-pure hover:text-black-deep transition-cinematic border border-ornamental"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </div>

      <Link href={`/products/${product.slug || product.id}`} className="flex flex-col flex-1 px-1">
        {product.brand && (
          <span className="text-[9px] uppercase tracking-[0.2em] text-grey-stone font-medium mb-2">
            {product.brand}
          </span>
        )}
        <h3 className="text-base font-serif font-medium text-current line-clamp-2">
          {product.name}
        </h3>
        <p className="text-current text-sm mt-3 tracking-widest text-xs">
          INR {product.price.toLocaleString("en-IN")}
        </p>
      </Link>
    </div>
  );
}

export default memo(ProductCard);
