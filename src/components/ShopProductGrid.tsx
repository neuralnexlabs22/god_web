"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import DevotionalProductCard from "@/components/DevotionalProductCard";
import type { DevotionalProduct } from "@/data/devotionalProducts";
import { useProducts } from "@/context/ProductContext";

interface ShopProductGridProps {
  initialProducts: DevotionalProduct[];
  categories: { slug: string; name: string }[];
}

export default function ShopProductGrid({ initialProducts, categories }: ShopProductGridProps) {
  const { products: liveProducts, loaded } = useProducts();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

  const effectiveProducts: DevotionalProduct[] = useMemo(() => {
    if (loaded && liveProducts.length > 0) {
      return liveProducts.map((p) => ({
        id: p.id,
        slug: p.id.startsWith("prod-") ? p.id.replace("prod-", "") : p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice || Math.round(p.price * 1.35),
        description: p.description,
        image: p.images?.[0] || "/assets/devotional/deity-gallery-montage.png",
        imageAlt: p.name,
        badge: p.brand || p.category,
        size: p.sizes?.[0] || "12 x 18 in / Archival print",
      }));
    }
    return initialProducts;
  }, [liveProducts, loaded, initialProducts]);

  const filteredAndSorted = useMemo(() => {
    return effectiveProducts
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "all" ||
          product.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          (selectedCategory === "deity-prints" && product.category.toLowerCase().includes("deity")) ||
          (selectedCategory === "temple-prints" && product.category.toLowerCase().includes("temple")) ||
          (selectedCategory === "sculpture-prints" && product.category.toLowerCase().includes("sculpture")) ||
          (selectedCategory === "premium-sets" && product.category.toLowerCase().includes("set"));

        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0; // featured/original order
      });
  }, [initialProducts, search, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search, Filter Pills & Sorting Controls */}
      <div className="flex flex-col gap-4 border-b border-black-deep/10 pb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-stone" />
            <input
              type="text"
              placeholder="Search deities, temples, or themes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white-pure border border-black-deep/20 py-2.5 pl-10 pr-4 text-xs text-black-deep placeholder-grey-stone focus:border-black-deep focus:outline-none transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-grey-stone font-bold whitespace-nowrap">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white-pure border border-black-deep/20 py-2.5 px-3 text-xs text-black-deep font-semibold focus:border-black-deep focus:outline-none transition-colors cursor-pointer"
            >
              <option value="featured">Featured Sacred Art</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Deity Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border ${
              selectedCategory === "all"
                ? "bg-black-deep text-white-pure border-black-deep"
                : "bg-white-pure text-black-deep border-black-deep/20 hover:border-black-deep/40"
            }`}
          >
            All Prints ({initialProducts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border ${
                selectedCategory === cat.slug
                  ? "bg-black-deep text-white-pure border-black-deep"
                  : "bg-white-pure text-black-deep border-black-deep/20 hover:border-black-deep/40"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-grey-stone">
        <p>
          Showing <span className="font-bold text-black-deep">{filteredAndSorted.length}</span> sacred devotional prints
        </p>
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-[11px] underline uppercase tracking-wider text-black-deep"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-black-deep/20 p-8 bg-white-ivory/30">
          <Sparkles className="w-8 h-8 text-[#c9a227] mx-auto mb-3" />
          <h3 className="font-serif text-xl uppercase text-black-deep">No devotional prints found</h3>
          <p className="text-xs text-grey-stone mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or browsing all categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
            }}
            className="mt-4 px-5 py-2.5 bg-black-deep text-white-pure text-xs uppercase tracking-widest font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredAndSorted.map((product) => (
            <DevotionalProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
