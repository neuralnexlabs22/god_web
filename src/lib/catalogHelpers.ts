import type { Product } from "@/context/ProductContext";
import type { Brand } from "@/types/catalog";

export { brandOptionKey } from "@/lib/catalogStore";

export const PRODUCT_CATEGORIES = [
  "Deity Paintings",
  "Temple Paintings",
  "Sculpture Paintings",
  "Premium Sets",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

const SLUG_TO_CATEGORY: Record<string, ProductCategory> = {
  "deity-prints": "Deity Paintings",
  "temple-prints": "Temple Paintings",
  "sculpture-prints": "Sculpture Paintings",
  "premium-sets": "Premium Sets",
};

const CATEGORY_TO_SLUG: Record<ProductCategory, string> = {
  "Deity Paintings": "deity-prints",
  "Temple Paintings": "temple-prints",
  "Sculpture Paintings": "sculpture-prints",
  "Premium Sets": "premium-sets",
};

export function slugToProductCategory(slug: string): ProductCategory {
  return SLUG_TO_CATEGORY[slug] || "Deity Paintings";
}

export function productCategoryToSlug(category: ProductCategory): string {
  return CATEGORY_TO_SLUG[category] || "deity-prints";
}

export function getBrandsForProductCategory(
  category: string,
  brands: Brand[]
): Brand[] {
  const normalizedSlug =
    CATEGORY_TO_SLUG[category as ProductCategory] ||
    SLUG_TO_CATEGORY[category.toLowerCase()] ? productCategoryToSlug(slugToProductCategory(category.toLowerCase())) : "deity-prints";
  return brands.filter(
    (b) => (b.category_id === normalizedSlug || b.category_id === category.toLowerCase()) && b.is_active !== false
  );
}

export const ADMIN_SELECT_CLASS =
  "w-full bg-zinc-900 border border-white/20 rounded-lg px-4 py-3 text-white font-bold focus:border-[#c9a227] focus:outline-none transition-colors appearance-none cursor-pointer";

export const ADMIN_OPTION_CLASS = "bg-zinc-900 text-white font-semibold";
