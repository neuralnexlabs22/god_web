"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Sparkles,
  Landmark,
  Crown,
  Layers,
  PlusCircle,
  ExternalLink,
  Tag,
  Store,
  Phone,
} from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { useCatalog } from "@/context/CatalogContext";
import { brandOptionKey } from "@/lib/catalogHelpers";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Deity Prints": Sparkles,
  "Temple Prints": Landmark,
  "Sculpture Prints": Crown,
  "Premium Sets": Layers,
  Watches: Sparkles,
  Shoes: Landmark,
  Clothing: Crown,
  Accessories: Layers,
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const categoryIconBySlug: Record<string, React.ComponentType<{ className?: string }>> = {
  "deity-prints": Sparkles,
  "temple-prints": Landmark,
  "sculpture-prints": Crown,
  "premium-sets": Layers,
  watches: Sparkles,
  shoes: Landmark,
  clothing: Crown,
  accessories: Layers,
};

export default function AdminDashboard() {
  const { products, loaded } = useProducts();
  const { categories: catalogCategories, brands: catalogBrands } = useCatalog();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#c9a227] border-t-transparent rounded-full" />
      </div>
    );
  }

  const categoryCounts: Record<string, number> = {
    "Deity Prints": products.filter(
      (p) => p.category === "Deity Prints" || p.category === "Watches"
    ).length,
    "Temple Prints": products.filter(
      (p) => p.category === "Temple Prints" || p.category === "Shoes"
    ).length,
    "Sculpture Prints": products.filter(
      (p) => p.category === "Sculpture Prints" || p.category === "Clothing"
    ).length,
    "Premium Sets": products.filter(
      (p) => p.category === "Premium Sets" || p.category === "Accessories"
    ).length,
  };

  const recentProducts = [...products].reverse().slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a227]">
            Sacred Tamil Gallery • Admin
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-medium uppercase tracking-tight text-white mt-1">
            Devotional Store Dashboard
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Manage deity photos, Tamil temple prints, sculpture artworks, and custom orders
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 bg-[#c9a227] text-black font-black uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl hover:brightness-110 transition-all shadow-md shadow-[#c9a227]/20"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Print
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 border border-white/10 hover:border-[#c9a227]/40 text-white font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            <ExternalLink className="w-4 h-4 text-[#c9a227]" />
            Live Gallery
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Products */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#070707] border border-[#c9a227]/20 rounded-2xl p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Total Devotional Prints
            </span>
            <Package className="w-4 h-4 text-[#c9a227]" />
          </div>
          <p className="text-3xl font-black text-white">{products.length}</p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Live gallery catalog items</span>
        </motion.div>

        {/* Category Cards */}
        {Object.entries(categoryCounts).map(([cat, count], i) => {
          const Icon = categoryIcons[cat] || Package;
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="bg-[#070707] border border-white/5 hover:border-[#c9a227]/30 transition-all rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                  {cat}
                </span>
                <Icon className="w-4 h-4 text-[#c9a227]" />
              </div>
              <p className="text-3xl font-black text-white">{count}</p>
              <span className="text-[10px] text-zinc-500 mt-1 block">Archival fine art editions</span>
            </motion.div>
          );
        })}
      </div>

      {/* Catalog: Categories & Deities */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-serif font-bold text-white uppercase tracking-wider">
              Sacred Collections & Themes
            </h2>
            <p className="text-xs text-zinc-400">
              Browse categories or filter by deities and temple architectures
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/categories"
              className="text-xs font-bold text-[#c9a227] hover:underline uppercase tracking-wider"
            >
              Manage Categories →
            </Link>
            <Link
              href="/admin/brands"
              className="text-xs font-bold text-[#c9a227] hover:underline uppercase tracking-wider"
            >
              Manage Deities & Themes →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {catalogCategories.map((cat) => {
            const Icon = categoryIconBySlug[cat.slug] || Layers;
            const brandCount = catalogBrands.filter(
              (b) => b.category_id === cat.id || b.category_id === cat.slug
            ).length;
            return (
              <Link
                key={cat.id}
                href={`/admin/brands?category=${cat.slug}`}
                className="bg-[#070707] border border-white/10 rounded-xl p-4 hover:border-[#c9a227]/40 transition-all group"
              >
                <Icon className="w-5 h-5 text-[#c9a227] mb-2" />
                <p className="font-bold text-white text-sm uppercase leading-tight group-hover:text-[#c9a227] transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs font-semibold text-zinc-400 mt-1">
                  {brandCount > 0 ? `${brandCount} deities / themes` : "All editions"}
                </p>
              </Link>
            );
          })}
        </div>

        {catalogBrands.length > 0 && (
          <div className="bg-[#070707] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#c9a227]" />
                <h3 className="font-bold text-white uppercase text-xs tracking-wider">
                  Featured Deities & Temples
                </h3>
              </div>
              <Link href="/admin/brands" className="text-xs text-[#c9a227] hover:underline">
                View all ({catalogBrands.length})
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {catalogBrands
                .filter((b) => b.featured)
                .slice(0, 16)
                .map((b) => (
                  <span
                    key={brandOptionKey(b)}
                    className="px-3 py-1.5 rounded-lg bg-[#c9a227]/10 border border-[#c9a227]/30 text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <span>🕉️</span> {b.name}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/products/add"
          className="group flex items-center gap-4 p-5 bg-[#070707] border border-white/5 rounded-2xl hover:border-[#c9a227]/40 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center group-hover:bg-[#c9a227]/20 transition-colors">
            <PlusCircle className="w-5 h-5 text-[#c9a227]" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Add Deity / Temple Print</h3>
            <p className="text-xs text-zinc-500">Upload high-res devotional photo art</p>
          </div>
        </Link>
        <Link
          href="/admin/homepage"
          className="group flex items-center gap-4 p-5 bg-[#070707] border border-white/5 rounded-2xl hover:border-[#c9a227]/40 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center group-hover:bg-[#c9a227]/20 transition-colors">
            <Store className="w-5 h-5 text-[#c9a227]" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Homepage Hero & Banners</h3>
            <p className="text-xs text-zinc-500">Edit devotional titles and imagery</p>
          </div>
        </Link>
        <Link
          href="/admin/contact"
          className="group flex items-center gap-4 p-5 bg-[#070707] border border-white/5 rounded-2xl hover:border-[#c9a227]/40 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center group-hover:bg-[#c9a227]/20 transition-colors">
            <Phone className="w-5 h-5 text-[#c9a227]" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">WhatsApp & Custom Orders</h3>
            <p className="text-xs text-zinc-500">Configure phone and custom order info</p>
          </div>
        </Link>
      </div>

      {/* Recent Products */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-white">Recent Products</h2>
        {recentProducts.length === 0 ? (
          <p className="text-zinc-500 text-sm">No products yet.</p>
        ) : (
          <div className="bg-[#070707] border border-white/5 rounded-2xl overflow-hidden">
            {recentProducts.map((product, i) => (
              <Link
                key={product.id}
                href={`/admin/products/edit/${product.id}`}
                className={`flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors ${
                  i < recentProducts.length - 1
                    ? "border-b border-white/5"
                    : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-900 overflow-hidden flex-shrink-0">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Package className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {product.category} · {product.brand}
                  </p>
                </div>
                <span className="text-sm font-bold text-[var(--accent-1)]">
                  {currency.format(product.price)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
