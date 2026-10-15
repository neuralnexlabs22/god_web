"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Plus,
  Percent,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Clock,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Search,
  X,
  History,
} from "lucide-react";
import { devotionalProducts } from "@/data/devotionalProducts";

export interface CouponItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  original_price: number;
  desired_price: number;
  discount_amount: number;
  discount_percentage: number;
  applies_to: "order" | "product";
  product_id?: string;
  product_name?: string;
  min_purchase_amount: number;
  max_uses?: number | null;
  used_count: number;
  max_uses_per_customer?: number;
  start_date?: string | null;
  expiry_date?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface CouponUsageItem {
  id: string;
  coupon_id?: string;
  coupon_code: string;
  order_id: string;
  customer_name: string;
  customer_phone?: string;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  created_at: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState<CouponItem | null>(null);
  const [usageRecords, setUsageRecords] = useState<CouponUsageItem[]>([]);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form state for reverse-price calculation
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formOriginalPrice, setFormOriginalPrice] = useState<string>("4999");
  const [formDesiredPrice, setFormDesiredPrice] = useState<string>("3999");
  const [formAppliesTo, setFormAppliesTo] = useState<"order" | "product">("order");
  const [formProductId, setFormProductId] = useState<string>("");
  const [formMinPurchase, setFormMinPurchase] = useState<string>("0");
  const [formMaxUses, setFormMaxUses] = useState<string>("");
  const [formStartDate, setFormStartDate] = useState<string>("");
  const [formExpiryDate, setFormExpiryDate] = useState<string>("");
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate live reverse-price figures
  const reverseCalc = useMemo(() => {
    const orig = parseFloat(formOriginalPrice) || 0;
    const desired = parseFloat(formDesiredPrice) || 0;
    if (orig <= 0 || desired < 0 || desired >= orig) {
      return {
        discountAmount: 0,
        discountPercentage: 0,
        isValid: false,
        error:
          orig <= 0
            ? "Original price must be greater than zero."
            : desired >= orig
            ? "Desired price must be less than original price."
            : null,
      };
    }
    const discountAmount = Math.round((orig - desired) * 100) / 100;
    const discountPercentage = Math.round(((discountAmount / orig) * 100) * 100) / 100;
    return {
      discountAmount,
      discountPercentage,
      isValid: true,
      error: null,
    };
  }, [formOriginalPrice, formDesiredPrice]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/coupons");
      const json = await res.json();
      if (json.coupons) {
        setCoupons(json.coupons);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleGenerateCode = () => {
    const prefixes = ["DEVOTION", "SACRED", "GODSTORE", "POOJA", "TEMPLE", "DIVINE", "CHOLA", "SANCTUM"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const pct = Math.round(reverseCalc.discountPercentage) || 20;
    setFormCode(`${prefix}${pct}`);
  };

  const handleToggleActive = async (coupon: CouponItem) => {
    try {
      const res = await fetch(`/api/coupons/${coupon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !coupon.is_active }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, is_active: !c.is_active } : c))
        );
      }
    } catch (err) {
      console.error("Failed to toggle coupon:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        setDeleteConfirm(null);
        setMessage({ text: "Coupon deleted successfully", type: "success" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleViewUsage = async (coupon: CouponItem) => {
    setShowUsageModal(coupon);
    setLoadingUsage(true);
    try {
      const res = await fetch(`/api/coupons/usage?coupon_id=${encodeURIComponent(coupon.id)}`);
      const json = await res.json();
      setUsageRecords(json.usages || []);
    } catch (err) {
      console.error("Failed to fetch usages:", err);
      setUsageRecords([]);
    } finally {
      setLoadingUsage(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Please enter a coupon name");
      return;
    }
    if (!formCode.trim()) {
      setFormError("Please enter or generate a coupon code");
      return;
    }
    if (!reverseCalc.isValid) {
      setFormError(reverseCalc.error || "Please enter valid original and desired selling prices");
      return;
    }

    let selectedProductName = null;
    if (formAppliesTo === "product") {
      if (!formProductId) {
        setFormError("Please select an eligible devotional product");
        return;
      }
      const prod = devotionalProducts.find((p) => p.id === formProductId || p.slug === formProductId);
      selectedProductName = prod ? prod.name : formProductId;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        code: formCode.trim().toUpperCase(),
        description: formDescription.trim(),
        original_price: parseFloat(formOriginalPrice),
        desired_price: parseFloat(formDesiredPrice),
        applies_to: formAppliesTo,
        product_id: formAppliesTo === "product" ? formProductId : null,
        product_name: selectedProductName,
        min_purchase_amount: parseFloat(formMinPurchase) || 0,
        max_uses: formMaxUses ? parseInt(formMaxUses, 10) : null,
        start_date: formStartDate || null,
        expiry_date: formExpiryDate || null,
        is_active: formIsActive,
      };

      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setFormError(json.error || "Failed to create coupon");
        return;
      }

      setMessage({ text: `✓ Coupon ${payload.code} created successfully!`, type: "success" });
      setTimeout(() => setMessage(null), 4000);
      setShowAddModal(false);
      resetForm();
      loadCoupons();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormCode("");
    setFormDescription("");
    setFormOriginalPrice("4999");
    setFormDesiredPrice("3999");
    setFormAppliesTo("order");
    setFormProductId("");
    setFormMinPurchase("0");
    setFormMaxUses("");
    setFormStartDate("");
    setFormExpiryDate("");
    setFormIsActive(true);
    setFormError(null);
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.product_name && c.product_name.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter =
      filter === "all" ? true : filter === "active" ? c.is_active : !c.is_active;
    return matchesSearch && matchesFilter;
  });

  const activeCount = coupons.filter((c) => c.is_active).length;
  const totalUses = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a227]">
            Promotions & Discounts
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-medium uppercase tracking-tight text-white mt-0.5">
            Dynamic Discount Coupons
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Create promotional coupons with reverse-price calculation, usage limits, and product eligibility
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            handleGenerateCode();
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#c9a227] text-black font-black uppercase tracking-widest text-xs px-5 py-3 rounded-xl hover:brightness-110 transition-all shadow-md shadow-[#c9a227]/20"
        >
          <Plus className="w-4 h-4" />
          Create New Coupon
        </button>
      </div>

      {/* Global Message Banner */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-semibold border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#070707] border border-[#c9a227]/20 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Total Coupons
            </span>
            <Ticket className="w-4 h-4 text-[#c9a227]" />
          </div>
          <p className="text-3xl font-black text-white">{coupons.length}</p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Configured promotional offers</span>
        </div>

        <div className="bg-[#070707] border border-white/5 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Active Offers
            </span>
            <Sparkles className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-3xl font-black text-white">{activeCount}</p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Currently eligible at checkout</span>
        </div>

        <div className="bg-[#070707] border border-white/5 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
              Total Redemptions
            </span>
            <Percent className="w-4 h-4 text-[#c9a227]" />
          </div>
          <p className="text-3xl font-black text-white">{totalUses}</p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Recorded orders with applied discounts</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by coupon code, offer name, or eligible product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-[#c9a227] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === tab
                  ? "bg-[#c9a227] text-black shadow-md shadow-[#c9a227]/20"
                  : "bg-[#070707] border border-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table / Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-zinc-500">
          <RefreshCw className="w-6 h-6 animate-spin text-[#c9a227]" />
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="bg-[#070707] border border-white/5 rounded-2xl p-12 text-center">
          <Ticket className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-white font-serif text-lg">No discount coupons found</h3>
          <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
            Create your first reverse-price discount coupon to give customers special devotional offers.
          </p>
          <button
            onClick={() => {
              resetForm();
              handleGenerateCode();
              setShowAddModal(true);
            }}
            className="mt-5 inline-flex items-center gap-2 bg-[#c9a227] text-black font-black uppercase tracking-widest text-xs px-5 py-2.5 rounded-xl hover:brightness-110"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>
      ) : (
        <div className="bg-[#070707] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/5 text-[10px] uppercase tracking-wider text-zinc-400 font-bold bg-white/[0.01]">
                <tr>
                  <th className="px-5 py-4">Coupon Code</th>
                  <th className="px-5 py-4">Offer Name & Scope</th>
                  <th className="px-5 py-4">Reverse Calculation</th>
                  <th className="px-5 py-4 text-center">Usage Limit</th>
                  <th className="px-5 py-4">Validity</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[#c9a227] bg-[#c9a227]/10 border border-[#c9a227]/30 px-2.5 py-1 rounded-lg">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          title="Copy Code"
                          className="p-1 text-zinc-500 hover:text-white transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {copiedCode === coupon.code && (
                          <span className="text-[10px] text-green-400 font-bold">Copied!</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{coupon.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                            coupon.applies_to === "product"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {coupon.applies_to === "product" ? "Specific Product" : "Whole Order"}
                        </span>
                        {coupon.product_name && (
                          <span className="text-xs text-zinc-400 truncate max-w-[180px]">
                            {coupon.product_name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <span className="line-through text-zinc-500">
                            ₹{coupon.original_price?.toLocaleString("en-IN")}
                          </span>
                          <span>→</span>
                          <span className="font-bold text-white">
                            ₹{coupon.desired_price?.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-green-400 mt-0.5">
                          -₹{coupon.discount_amount?.toLocaleString("en-IN")} ({coupon.discount_percentage}%)
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="text-xs">
                        <span className="font-bold text-white">{coupon.used_count || 0}</span>
                        <span className="text-zinc-500">
                          {coupon.max_uses ? ` / ${coupon.max_uses}` : " (unlimited)"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleViewUsage(coupon)}
                        className="text-[10px] text-[#c9a227] hover:underline uppercase font-bold mt-1 inline-flex items-center gap-1"
                      >
                        <History className="w-3 h-3" /> View Records
                      </button>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-400">
                      {coupon.expiry_date ? (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Expires {new Date(coupon.expiry_date).toLocaleDateString("en-IN")}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-500">No Expiry</span>
                      )}
                      {coupon.min_purchase_amount > 0 && (
                        <span className="text-[10px] text-zinc-500 block mt-0.5">
                          Min. ₹{coupon.min_purchase_amount.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        title={coupon.is_active ? "Click to Deactivate" : "Click to Activate"}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors"
                      >
                        {coupon.is_active ? (
                          <span className="inline-flex items-center gap-1 text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                            <Eye className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
                            <EyeOff className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {deleteConfirm === coupon.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="px-2.5 py-1 text-xs font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2.5 py-1 text-xs font-bold bg-white/5 text-zinc-400 hover:bg-white/10 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(coupon.id)}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Coupon with Live Reverse-Price Preview */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#c9a227]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#c9a227]">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold uppercase tracking-wider text-white">
                      Create Discount Coupon
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Configure reverse-price formula and devotional coupon conditions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateCoupon} className="space-y-5">
                {/* Coupon Name & Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      Coupon Name *
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      placeholder="e.g. Navratri Special or Murugan Festive Offer"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                        Coupon Code *
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateCode}
                        className="text-[10px] text-[#c9a227] hover:underline font-bold"
                      >
                        Generate Unique
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                      required
                      placeholder="e.g. GODDEVOTION20"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-[#c9a227] focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>
                </div>

                {/* REVERSE-PRICE CALCULATION SECTION */}
                <div className="bg-[#050505] border border-[#c9a227]/25 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-[#c9a227]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        Reverse-Price Calculation
                      </h3>
                    </div>
                    <span className="text-[10px] text-[#c9a227] font-semibold">
                      Enter original price & customer price
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                        Original Eligible Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(e.target.value)}
                        required
                        placeholder="4999"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:border-[#c9a227] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                        Desired Final Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formDesiredPrice}
                        onChange={(e) => setFormDesiredPrice(e.target.value)}
                        required
                        placeholder="3999"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:border-[#c9a227] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* LIVE PREVIEW BOX */}
                  <div className="border border-dashed border-[#c9a227]/40 rounded-xl p-4 bg-[#c9a227]/5">
                    <p className="text-[10px] uppercase tracking-widest text-[#c9a227] font-bold mb-2">
                      Live Reverse-Calculation Preview
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="bg-black/60 rounded-lg p-2.5 border border-white/5">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">
                          Original Price
                        </span>
                        <span className="text-sm font-bold text-zinc-300">
                          ₹{parseFloat(formOriginalPrice) ? parseFloat(formOriginalPrice).toLocaleString("en-IN") : "0"}
                        </span>
                      </div>
                      <div className="bg-black/60 rounded-lg p-2.5 border border-white/5">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">
                          Discount Amount
                        </span>
                        <span className="text-sm font-bold text-green-400">
                          ₹{reverseCalc.discountAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="bg-black/60 rounded-lg p-2.5 border border-white/5">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">
                          Discount %
                        </span>
                        <span className="text-sm font-bold text-[#c9a227]">
                          {reverseCalc.discountPercentage.toFixed(2)}%
                        </span>
                      </div>
                      <div className="bg-black/60 rounded-lg p-2.5 border border-white/5">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">
                          Final Price
                        </span>
                        <span className="text-sm font-bold text-white">
                          ₹{parseFloat(formDesiredPrice) ? parseFloat(formDesiredPrice).toLocaleString("en-IN") : "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scope: Whole Order or Product Specific */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                    Applies To *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormAppliesTo("order")}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider text-center transition-all ${
                        formAppliesTo === "order"
                          ? "bg-[#c9a227]/20 border-[#c9a227] text-[#c9a227]"
                          : "bg-black border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Entire Order
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormAppliesTo("product")}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider text-center transition-all ${
                        formAppliesTo === "product"
                          ? "bg-[#c9a227]/20 border-[#c9a227] text-[#c9a227]"
                          : "bg-black border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Specific Devotional Print
                    </button>
                  </div>
                </div>

                {/* Specific Product Select */}
                {formAppliesTo === "product" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      Select Eligible Devotional Print *
                    </label>
                    <select
                      value={formProductId}
                      onChange={(e) => setFormProductId(e.target.value)}
                      required
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    >
                      <option value="">-- Choose Devotional Artwork --</option>
                      {devotionalProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (₹{p.price.toLocaleString("en-IN")})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Rules & Limits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      Min Purchase Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formMinPurchase}
                      onChange={(e) => setFormMinPurchase(e.target.value)}
                      placeholder="0 (no minimum)"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      Max Redemptions / Uses
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formMaxUses}
                      onChange={(e) => setFormMaxUses(e.target.value)}
                      placeholder="e.g. 50 (leave empty for unlimited)"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Validity Period */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      Start Date (optional)
                    </label>
                    <input
                      type="date"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      Expiry Date (optional)
                    </label>
                    <input
                      type="date"
                      value={formExpiryDate}
                      onChange={(e) => setFormExpiryDate(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                    Description / Admin Note
                  </label>
                  <input
                    type="text"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="e.g. 20% discount on orders above ₹4,999"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                  />
                </div>

                {/* Active switch */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="formIsActive"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-5 h-5 rounded border-white/10 bg-black text-[#c9a227] focus:ring-[#c9a227]"
                  />
                  <label htmlFor="formIsActive" className="text-xs text-zinc-300 font-semibold cursor-pointer">
                    Enable and activate this coupon immediately
                  </label>
                </div>

                {/* Submit buttons */}
                <div className="flex gap-3 pt-3 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={submitting || !reverseCalc.isValid}
                    className="flex-1 bg-[#c9a227] text-black font-black uppercase tracking-widest text-xs py-3.5 rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-md shadow-[#c9a227]/20"
                  >
                    {submitting ? "Saving Coupon..." : "Save Coupon"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3.5 border border-white/10 rounded-xl text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: View Redemption Records */}
      <AnimatePresence>
        {showUsageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#c9a227]/30 rounded-3xl p-6 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold uppercase text-white">
                    Redemption Records: <span className="text-[#c9a227]">{showUsageModal.code}</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {showUsageModal.name} · Used {showUsageModal.used_count || 0} times
                  </p>
                </div>
                <button
                  onClick={() => setShowUsageModal(null)}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loadingUsage ? (
                <div className="py-12 flex justify-center text-zinc-500">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#c9a227]" />
                </div>
              ) : usageRecords.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs">
                  No redemptions recorded for this coupon yet.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {usageRecords.map((rec) => (
                    <div key={rec.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white">{rec.customer_name || "Customer"}</p>
                        <p className="text-[11px] text-zinc-500">
                          Order: <span className="font-mono text-zinc-400">{rec.order_id}</span>
                          {rec.customer_phone && ` · ${rec.customer_phone}`}
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-0.5">
                          {new Date(rec.created_at).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-400">
                          -₹{rec.discount_amount?.toLocaleString("en-IN")}
                        </span>
                        <p className="text-[10px] text-zinc-500">
                          Final: ₹{rec.final_amount?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 text-right">
                <button
                  onClick={() => setShowUsageModal(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
