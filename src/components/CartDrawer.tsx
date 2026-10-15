"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Ticket,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useContactInfo } from "@/context/ContactInfoContext";

export default function CartDrawer() {
  const {
    items,
    totalItems,
    subtotal,
    finalTotal,
    discountAmount,
    appliedCoupon,
    couponError,
    couponSuccess,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const { contactInfo } = useContactInfo();
  const whatsappNumber = contactInfo?.whatsapp_number || "8122228386";

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponCodeInput);
    setApplyingCoupon(false);
  };

  const handleWhatsAppCheckout = async () => {
    // Format message
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
    const itemsList = items
      .map(
        (i, idx) =>
          `${idx + 1}. *${i.name}*\n   Options: ${i.size || "Standard"} | ${i.frame || "Fine Art Print"}\n   Qty: ${i.quantity} × ₹${i.price.toLocaleString("en-IN")}`
      )
      .join("\n\n");

    let message = `*🕉️ NEW ORDER REQUEST — FRAMES OF DIVINE*\n\n`;
    message += `Hello! I would like to order the following devotional prints:\n\n`;
    message += `${itemsList}\n\n`;
    message += `──────────────────\n`;
    message += `*Subtotal:* ₹${subtotal.toLocaleString("en-IN")}\n`;
    if (appliedCoupon) {
      message += `*Coupon Applied:* ${appliedCoupon.code} (-₹${discountAmount.toLocaleString("en-IN")})\n`;
    }
    message += `*Final Amount:* ₹${finalTotal.toLocaleString("en-IN")}\n`;
    message += `──────────────────\n`;

    if (customerName || customerPhone || customerAddress) {
      message += `*Delivery Details:*\n`;
      if (customerName) message += `Name: ${customerName}\n`;
      if (customerPhone) message += `Phone: ${customerPhone}\n`;
      if (customerAddress) message += `Address: ${customerAddress}\n`;
    }

    message += `\nPlease confirm availability and payment details. Thank you! 🙏`;

    // Record order in background
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName || "WhatsApp Customer",
          customer_phone: customerPhone || null,
          shipping_address: customerAddress || "WhatsApp Order",
          items,
          subtotal,
          discount_amount: discountAmount,
          final_amount: finalTotal,
          coupon_code: appliedCoupon?.code,
          coupon_id: appliedCoupon?.id,
          payment_method: "whatsapp",
        }),
      });
    } catch (err) {
      console.warn("Could not record order:", err);
    }

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleDirectOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert("Please fill in your name, phone, and delivery address.");
      return;
    }

    setOrderSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          shipping_address: customerAddress.trim(),
          items,
          subtotal,
          discount_amount: discountAmount,
          final_amount: finalTotal,
          coupon_code: appliedCoupon?.code,
          coupon_id: appliedCoupon?.id,
          payment_method: "cash_on_delivery",
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setOrderSuccess(json.order_id || "GOD-ORDER");
        clearCart();
      } else {
        alert(json.error || "Failed to place order");
      }
    } catch (err) {
      alert("Failed to connect to server. Please try again.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#070707] text-white border-l border-white/10 shadow-2xl"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-[#c9a227]" />
                <h2 className="font-serif text-lg uppercase tracking-wider text-white">
                  Sacred Cart
                </h2>
                <span className="rounded-full bg-[#c9a227]/20 border border-[#c9a227]/40 px-2 py-0.5 text-[10px] font-bold text-[#c9a227]">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Area */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-600">
                  <ShoppingBag className="h-8 w-8 text-[#c9a227]/40" />
                </div>
                <h3 className="font-serif text-xl uppercase tracking-wider text-white">
                  Your Cart Is Empty
                </h3>
                <p className="mt-2 text-xs leading-5 text-zinc-400 max-w-xs">
                  Discover curated Hindu deities, sacred temples, and devotional art prints.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 inline-flex items-center gap-2 border border-[#c9a227] bg-[#c9a227] px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:brightness-110 transition-all"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <>
                {/* Scrollable Item List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-white/5">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="py-4 flex gap-4 items-start">
                      {/* Image Thumbnail */}
                      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden border border-white/10 bg-black">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-700">
                            🕉️
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="font-serif text-sm font-semibold text-white hover:text-[#c9a227] line-clamp-1 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-zinc-400">
                          {item.size && <span>{item.size}</span>}
                          {item.frame && <span>· {item.frame}</span>}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-semibold text-sm text-[#c9a227]">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>
                          {item.originalPrice && (
                            <span className="text-[11px] text-zinc-500 line-through">
                              ₹{item.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="px-2 py-1 text-zinc-400 hover:text-white transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="px-2 py-1 text-zinc-400 hover:text-white transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        aria-label="Remove item"
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer Section: Coupon & Totals */}
                <div className="border-t border-white/10 bg-[#040404] p-6 space-y-4">
                  {/* Coupon Application Box */}
                  <div className="space-y-2">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between rounded-xl bg-green-500/10 border border-green-500/30 px-3.5 py-2.5 text-xs text-green-400">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 shrink-0" />
                          <div>
                            <span className="font-mono font-bold tracking-wider uppercase">
                              {appliedCoupon.code}
                            </span>
                            <span className="text-[11px] text-green-300 ml-1.5">
                              (-₹{discountAmount.toLocaleString("en-IN")})
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-[10px] uppercase font-bold text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="Enter coupon code..."
                            value={couponCodeInput}
                            onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                            className="w-full rounded-xl bg-black border border-white/10 pl-9 pr-3 py-2 text-xs uppercase text-white placeholder-zinc-500 focus:border-[#c9a227] focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={applyingCoupon || !couponCodeInput.trim()}
                          className="rounded-xl border border-[#c9a227]/40 bg-[#c9a227]/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#c9a227] hover:bg-[#c9a227] hover:text-black disabled:opacity-40 transition-all"
                        >
                          {applyingCoupon ? "Applying..." : "Apply"}
                        </button>
                      </form>
                    )}

                    {couponError && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="h-3 w-3 shrink-0" /> {couponError}
                      </p>
                    )}
                    {couponSuccess && !appliedCoupon && (
                      <p className="text-[11px] text-green-400 flex items-center gap-1.5">
                        <CheckCircle className="h-3 w-3 shrink-0" /> {couponSuccess}
                      </p>
                    )}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-white/5">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-white">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-400 font-semibold">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[11px]">
                      <span>Packaging & Delivery</span>
                      <span className="text-zinc-500">Free Insured Packaging</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 text-base font-serif font-bold text-white">
                      <span>Final Total</span>
                      <span className="text-[#c9a227]">
                        ₹{finalTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleWhatsAppCheckout}
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-[#c9a227] bg-[#c9a227] px-4 py-3.5 text-xs font-black uppercase tracking-widest text-black hover:brightness-110 transition-all shadow-lg shadow-[#c9a227]/20"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Order via WhatsApp
                    </button>
                    <button
                      onClick={() => setShowCheckoutModal(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/30 transition-all"
                    >
                      Direct Checkout (Cash on Delivery)
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}

      {/* Direct Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg rounded-3xl bg-[#0a0a0a] border border-[#c9a227]/30 p-6 sm:p-8 space-y-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {orderSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-2xl uppercase tracking-wider text-white">
                  Order Placed Successfully!
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                  Thank you for ordering with Frames of Divine. Your order reference is:
                </p>
                <div className="font-mono text-sm font-bold text-[#c9a227] bg-[#c9a227]/10 py-2 px-4 rounded-xl inline-block border border-[#c9a227]/30">
                  {orderSuccess}
                </div>
                <p className="text-[11px] text-zinc-500">
                  Our team will contact you via WhatsApp to confirm framing details and dispatch timing.
                </p>
                <button
                  onClick={() => {
                    setShowCheckoutModal(false);
                    setOrderSuccess(null);
                    closeCart();
                  }}
                  className="mt-4 bg-[#c9a227] text-black font-black uppercase tracking-widest text-xs px-8 py-3.5 rounded-xl hover:brightness-110"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#c9a227]/15 border border-[#c9a227]/30 flex items-center justify-center text-[#c9a227]">
                      🕉️
                    </div>
                    <div>
                      <h3 className="font-serif text-lg uppercase tracking-wider text-white">
                        Delivery & Checkout
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {totalItems} items · Total: ₹{finalTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="p-2 text-zinc-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleDirectOrder} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rohith Lakshman"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      WhatsApp / Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                      Delivery Address & Pincode *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="House / Flat No, Street, City, State, Pincode"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c9a227] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Summary */}
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 space-y-1.5 text-xs text-zinc-400">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-white">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-400">
                        <span>Coupon ({appliedCoupon.code}):</span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-white/5">
                      <span>Total Payable:</span>
                      <span className="text-[#c9a227]">₹{finalTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 pt-1">
                      Payment method: Cash on delivery / UPI on delivery. Insured transit.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={orderSubmitting}
                      className="flex-1 bg-[#c9a227] text-black font-black uppercase tracking-widest text-xs py-3.5 rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-md shadow-[#c9a227]/20"
                    >
                      {orderSubmitting ? "Placing Order..." : "Confirm & Place Order"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCheckoutModal(false)}
                      className="px-5 py-3.5 border border-white/10 rounded-xl text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
