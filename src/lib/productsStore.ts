import { products as defaultProducts } from "@/data/products";
import type { Product } from "@/context/ProductContext";

const STORAGE_KEY = "colour_seven_products";
let memoryCache: Product[] | null = null;

function buildDefaultProducts(): Product[] {
  return defaultProducts
    .map((product) => ({
      ...product,
      brand: product.brand || "Colour Seven",
      stock: product.stock ?? 10,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base", numeric: true }));
}

function readProducts(): Product[] {
  if (typeof window === "undefined") return buildDefaultProducts();

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return buildDefaultProducts();

    const parsed: unknown = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed as Product[];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return buildDefaultProducts();
}

function saveProducts(products: Product[]): void {
  memoryCache = products;
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    throw new Error("Could not save products in this browser. Check available local storage space.");
  }
}

export async function loadProducts(force = false): Promise<Product[]> {
  if (memoryCache && !force) return memoryCache;
  memoryCache = readProducts();
  return memoryCache;
}

export function getProductsSync(): Product[] {
  return memoryCache || readProducts();
}

export function invalidateProductsCache(): void {
  memoryCache = null;
}

export async function refreshProducts(): Promise<Product[]> {
  return loadProducts(true);
}

export async function addProduct(product: Omit<Product, "id">): Promise<Product> {
  const price = Number(product.price);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a valid non-negative number");
  }

  const created: Product = {
    ...product,
    price,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
  saveProducts([...getProductsSync(), created]);
  return created;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const products = getProductsSync();
  const index = products.findIndex((product) => product.id === id);
  if (index < 0) throw new Error("Product not found");

  if (updates.price !== undefined && (!Number.isFinite(Number(updates.price)) || Number(updates.price) < 0)) {
    throw new Error("Price must be a valid non-negative number");
  }

  const updated = products.map((product) =>
    product.id === id ? { ...product, ...updates } : product
  );
  saveProducts(updated);
}

export async function deleteProduct(id: string): Promise<void> {
  saveProducts(getProductsSync().filter((product) => product.id !== id));
}