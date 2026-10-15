"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Save,
  Plus,
  Minus,
  Edit2,
  ExternalLink,
} from "lucide-react";
import { useProducts, type Product } from "@/context/ProductContext";

export default function AdminInventoryPage() {
  const { products, updateProduct, loaded } = useProducts();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: "Out of Stock", color: "text-red-400 bg-red-950/40 border-red-800/40", icon: XCircle, status: "out_of_stock" };
    if (stock <= 5) return { label: "Low Stock Alert", color: "text-amber-400 bg-amber-950/40 border-amber-800/40", icon: AlertTriangle, status: "low_stock" };
    return { label: "In Stock", color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40", icon: CheckCircle2, status: "in_stock" };
  };

  const filteredProducts = products.filter((p) => {
    const stock = editingStock[p.id] !== undefined ? editingStock[p.id] : (p.stock ?? 10);
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const itemStatus = getStockStatus(stock).status;
    const matchesFilter = statusFilter === "all" || itemStatus === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const totalStock = products.reduce((acc, p) => acc + (p.stock ?? 10), 0);
  const lowStockCount = products.filter((p) => (p.stock ?? 10) > 0 && (p.stock ?? 10) <= 5).length;
  const outOfStockCount = products.filter((p) => (p.stock ?? 10) <= 0).length;
  const inStockCount = products.length - lowStockCount - outOfStockCount;

  const handleStockChange = (productId: string, val: number) => {
    setEditingStock((prev) => ({
      ...prev,
      [productId]: Math.max(0, val),
    }));
  };

  const handleSaveStock = async (product: Product) => {
    const newStock = editingStock[product.id];
    if (newStock === undefined) return;

    setSavingId(product.id);
    try {
      await updateProduct(product.id, { stock: newStock });
      setToastMessage(`✓ Updated stock for ${product.name}`);
      setTimeout(() => setToastMessage(null), 3000);
      setEditingStock((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    } catch (err: any) {
      alert(err?.message || "Failed to update stock");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0a0a0a] border border-[#c9a227] text-white px-5 py-3 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#c9a227]" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a227]">
            Frames of Divine Inventory
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-medium uppercase tracking-tight text-white mt-0.5">
            Artworks & Print Inventory
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Monitor sanctum art stock levels, set low inventory thresholds, and manage dispatch quantities
          </p>
        </div>
        <Link
          href="/admin/products/add"
          className="flex items-center justify-center gap-2 bg-[#c9a227] text-black font-black uppercase tracking-widest text-xs px-5 py-3 rounded-xl hover:brightness-110 transition-all shadow-md shadow-[#c9a227]/20"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Total Print Units</p>
          <p className="text-3xl font-serif font-bold text-white mt-1">{totalStock}</p>
          <p className="text-[11px] text-zinc-500 mt-1">{products.length} unique catalogue SKUs</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl">
          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-500">Healthy Stock</p>
          <p className="text-3xl font-serif font-bold text-emerald-400 mt-1">{inStockCount}</p>
          <p className="text-[11px] text-zinc-500 mt-1">&gt; 5 units available</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl">
          <p className="text-[10px] uppercase font-bold tracking-wider text-amber-500">Low Stock Alert</p>
          <p className="text-3xl font-serif font-bold text-amber-400 mt-1">{lowStockCount}</p>
          <p className="text-[11px] text-zinc-500 mt-1">1 to 5 units remaining</p>
        </div>
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl">
          <p className="text-[10px] uppercase font-bold tracking-wider text-red-500">Out of Stock</p>
          <p className="text-3xl font-serif font-bold text-red-400 mt-1">{outOfStockCount}</p>
          <p className="text-[11px] text-zinc-500 mt-1">Requires print replenishment</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by print name, category, or deity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-[#c9a227] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { id: "all", label: "All Items" },
              { id: "in_stock", label: "In Stock" },
              { id: "low_stock", label: "Low Stock" },
              { id: "out_of_stock", label: "Out of Stock" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === filter.id
                  ? "bg-[#c9a227] text-black shadow-md shadow-[#c9a227]/20"
                  : "bg-[#0a0a0a] text-zinc-400 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-black/60 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-white/10">
              <tr>
                <th className="py-4 px-6">Artwork / Deity Print</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Base Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Available Stock</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-600">
                    No artworks match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const currentStock = editingStock[product.id] !== undefined
                    ? editingStock[product.id]
                    : (product.stock ?? 10);
                  const isModified = editingStock[product.id] !== undefined && editingStock[product.id] !== (product.stock ?? 10);
                  const statusInfo = getStockStatus(currentStock);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-black border border-white/10 flex-shrink-0">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{product.name}</p>
                            <p className="text-[11px] text-zinc-500 mt-0.5">{product.brand || "Sacred Collection"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-zinc-400">
                        {product.category}
                      </td>
                      <td className="py-4 px-6 text-xs text-white font-serif">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStockChange(product.id, currentStock - 1)}
                            className="w-7 h-7 rounded-lg bg-black border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={currentStock}
                            onChange={(e) => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                            className={`w-16 bg-black border rounded-lg px-2 py-1 text-center text-xs font-bold text-white focus:outline-none transition-colors ${
                              isModified ? "border-[#c9a227] text-[#c9a227]" : "border-white/15"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleStockChange(product.id, currentStock + 1)}
                            className="w-7 h-7 rounded-lg bg-black border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isModified && (
                            <button
                              type="button"
                              onClick={() => handleSaveStock(product)}
                              disabled={savingId === product.id}
                              className="px-3 py-1.5 bg-[#c9a227] text-black text-[10px] font-bold uppercase rounded-lg hover:brightness-110 flex items-center gap-1 shadow-md shadow-[#c9a227]/20 transition-all"
                            >
                              <Save className="w-3 h-3" />
                              {savingId === product.id ? "Saving..." : "Save"}
                            </button>
                          )}
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="p-2 rounded-lg bg-black border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
                            title="Edit full product details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
