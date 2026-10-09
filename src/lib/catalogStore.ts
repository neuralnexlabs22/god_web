import { allBrands, categories as defaultCategories } from "@/data/brands";
import type { Brand, Category } from "@/types/catalog";

const STORAGE_KEY = "colour_seven_catalog";

export type CatalogData = { categories: Category[]; brands: Brand[] };

let memoryCache: CatalogData | null = null;

export function slugifyName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function buildBrandId(categoryId: string, name: string): string {
  return `${categoryId}-${slugifyName(name)}`;
}

export function brandOptionKey(brand: { category_id: string; id: string }): string {
  return `${brand.category_id}::${brand.id}`;
}

function buildDefaultCatalog(): CatalogData {
  const now = new Date().toISOString();
  const categories: Category[] = defaultCategories.map((category, index) => ({
    id: category.slug,
    slug: category.slug,
    name: category.name,
    description: category.description || "",
    image: "",
    icon: "",
    display_order: index,
    is_active: true,
    created_at: now,
    updated_at: now,
  }));

  const brands = allBrands.map((brand, index): Brand => {
    const categoryId = brand.category.toLowerCase();
    return {
      id: buildBrandId(categoryId, brand.name),
      category_id: categoryId,
      name: brand.name,
      slug: slugifyName(brand.name),
      logo: "",
      banner: "",
      description: brand.description || `Premium products from ${brand.name}`,
      display_order: index,
      is_active: true,
      featured: brand.featured || false,
      created_at: now,
      updated_at: now,
    };
  });

  const seenIds = new Set<string>();
  for (const brand of brands) {
    const baseId = brand.id;
    let suffix = 2;
    while (seenIds.has(brand.id)) brand.id = `${baseId}-${suffix++}`;
    seenIds.add(brand.id);
  }

  brands.sort((first, second) =>
    first.name.localeCompare(second.name, undefined, { sensitivity: "base", numeric: true })
  );
  return { categories, brands };
}

function readCatalog(): CatalogData {
  if (typeof window === "undefined") return buildDefaultCatalog();

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray((parsed as CatalogData).categories) &&
        Array.isArray((parsed as CatalogData).brands)
      ) {
        return parsed as CatalogData;
      }
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return buildDefaultCatalog();
}

function saveCatalog(catalog: CatalogData): void {
  memoryCache = catalog;
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
  } catch {
    throw new Error("Could not save the catalog in this browser. Check available local storage space.");
  }
}

export async function loadCatalog(force = false): Promise<CatalogData> {
  if (memoryCache && !force) return memoryCache;
  memoryCache = readCatalog();
  return memoryCache;
}

export function getCatalogSync(): CatalogData {
  return memoryCache || readCatalog();
}

export function invalidateCatalogCache(): void {
  memoryCache = null;
}

export async function refreshCatalog(): Promise<CatalogData> {
  return loadCatalog(true);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCatalogSync().categories.find((category) => category.slug === slug);
}

export function getBrandsForCategorySlug(slug: string): Brand[] {
  return getCatalogSync().brands.filter(
    (brand) => brand.category_id === slug && brand.is_active !== false
  );
}

export function getBrandBySlug(categorySlug: string, brandSlug: string): Brand | undefined {
  return getCatalogSync().brands.find(
    (brand) => brand.slug === brandSlug && brand.category_id === categorySlug
  );
}

export function getBrandById(id: string): Brand | undefined {
  return getCatalogSync().brands.find((brand) => brand.id === id);
}

export async function addCategory(
  data: Omit<Category, "id" | "created_at" | "updated_at">
): Promise<Category> {
  const catalog = getCatalogSync();
  if (catalog.categories.some((category) => category.slug === data.slug)) {
    throw new Error("A category with this URL slug already exists");
  }

  const now = new Date().toISOString();
  const category: Category = { ...data, id: data.slug, created_at: now, updated_at: now };
  saveCatalog({ ...catalog, categories: [...catalog.categories, category] });
  return category;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  const catalog = getCatalogSync();
  const existing = catalog.categories.find((category) => category.id === id || category.slug === id);
  if (!existing) throw new Error("Category not found");

  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  if (catalog.categories.some((category) => category.id !== existing.id && category.slug === updated.slug)) {
    throw new Error("A category with this URL slug already exists");
  }

  const categories = catalog.categories.map((category) => category.id === existing.id ? updated : category);
  const brands = catalog.brands.map((brand) =>
    brand.category_id === existing.slug ? { ...brand, category_id: updated.slug } : brand
  );
  saveCatalog({ categories, brands });
}

export async function deleteCategory(id: string): Promise<void> {
  const catalog = getCatalogSync();
  const category = catalog.categories.find((entry) => entry.id === id || entry.slug === id);
  if (!category) throw new Error("Category not found");
  saveCatalog({
    categories: catalog.categories.filter((entry) => entry.id !== category.id),
    brands: catalog.brands.filter((brand) => brand.category_id !== category.slug),
  });
}

export async function addBrand(
  data: Omit<Brand, "id" | "created_at" | "updated_at"> & { name: string; category_id: string }
): Promise<Brand> {
  const catalog = getCatalogSync();
  if (!catalog.categories.some((category) => category.slug === data.category_id)) {
    throw new Error(`Category "${data.category_id}" not found`);
  }

  const brand: Brand = {
    ...data,
    id: buildBrandId(data.category_id, data.name),
    slug: data.slug || slugifyName(data.name),
    logo: data.logo || "",
    banner: data.banner || "",
    description: data.description || "",
    display_order: data.display_order ?? 0,
    is_active: data.is_active ?? true,
    featured: data.featured ?? false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  if (catalog.brands.some((entry) => entry.id === brand.id)) {
    throw new Error("This brand already exists in the selected category");
  }
  saveCatalog({ ...catalog, brands: [...catalog.brands, brand] });
  return brand;
}

export async function updateBrand(id: string, updates: Partial<Brand>): Promise<void> {
  const catalog = getCatalogSync();
  const existing = catalog.brands.find((brand) => brand.id === id);
  if (!existing) throw new Error("Brand not found");

  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  if (!catalog.categories.some((category) => category.slug === updated.category_id)) {
    throw new Error(`Category "${updated.category_id}" not found`);
  }
  updated.id = buildBrandId(updated.category_id, updated.name);
  if (catalog.brands.some((brand) => brand.id !== id && brand.id === updated.id)) {
    throw new Error("This brand already exists in the selected category");
  }
  saveCatalog({
    ...catalog,
    brands: catalog.brands.map((brand) => brand.id === id ? updated : brand),
  });
}

export async function deleteBrand(id: string): Promise<void> {
  const catalog = getCatalogSync();
  if (!catalog.brands.some((brand) => brand.id === id)) throw new Error("Brand not found");
  saveCatalog({ ...catalog, brands: catalog.brands.filter((brand) => brand.id !== id) });
}

export const loadAdminCatalog = getCatalogSync;
export const getStoredCategories = () => getCatalogSync().categories;
export const getStoredBrands = () => getCatalogSync().brands;
export const saveStoredCategories = (categories: Category[]) => {
  saveCatalog({ ...getCatalogSync(), categories });
};
export const saveStoredBrands = (brands: Brand[]) => {
  saveCatalog({ ...getCatalogSync(), brands });
};
export const updateStoredCategory = (id: string, updates: Partial<Category>) => {
  void updateCategory(id, updates);
};
export const deleteStoredCategory = (id: string) => {
  void deleteCategory(id);
};
export const updateStoredBrand = (id: string, updates: Partial<Brand>) => {
  void updateBrand(id, updates);
};
export const deleteStoredBrand = (id: string) => {
  void deleteBrand(id);
};
export const addStoredCategory = addCategory;
export const addStoredBrand = addBrand;