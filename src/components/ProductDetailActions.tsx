"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, MessageSquare, Plus, Minus, Check, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useContactInfo } from "@/context/ContactInfoContext";
import type { DevotionalProduct } from "@/data/devotionalProducts";

const sizeOptions = [
  { label: "12 x 18 in", subtitle: "Pooja Room Classic", priceDelta: 0 },
  { label: "16 x 24 in", subtitle: "Fine Art Living Room", priceDelta: 400 },
  { label: "20 x 30 in", subtitle: "Grand Sanctum Edition", priceDelta: 900 },
];

const frameOptions = [
  { label: "Teak Wood Frame", subtitle: "Seasoned wood & matte glass", priceDelta: 600 },
  { label: "22KT Gold Foil Accent", subtitle: "Traditional gold border", priceDelta: 1100 },
  { label: "Archival Print Only", subtitle: "Unframed 310 GSM canvas", priceDelta: 0 },
];

export default function ProductDetailActions({ product }: { product: DevotionalProduct }) {
  const { addItem, openCart } = useCart();
  const { contactInfo } = useContactInfo();
  const whatsappNumber = contactInfo?.whatsapp_number || "8122228386";

  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [selectedFrame, setSelectedFrame] = useState(frameOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = product.price + selectedSize.priceDelta + selectedFrame.priceDelta;
  const originalPrice = product.originalPrice
    ? product.originalPrice + selectedSize.priceDelta + selectedFrame.priceDelta
    : undefined;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: unitPrice,
      originalPrice,
      image: product.image,
      size: selectedSize.label,
      frame: selectedFrame.label,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
    const msg = `*🕉️ DEVOTIONAL ORDER INQUIRY — FRAMES OF DIVINE*\n\n` +
      `Product: *${product.name}*\n` +
      `Size: ${selectedSize.label} (${selectedSize.subtitle})\n` +
      `Framing: ${selectedFrame.label}\n` +
      `Quantity: ${quantity}\n` +
      `Price: ₹${(unitPrice * quantity).toLocaleString("en-IN")}\n\n` +
      `Please let me know about dispatch timeline and order confirmation. Thank you! 🙏`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="flex items-end gap-3 pt-2">
        <span className="font-serif text-4xl text-black-deep">
          ₹{unitPrice.toLocaleString("en-IN")}
        </span>
        {originalPrice && (
          <span className="pb-1 text-sm text-grey-stone line-through">
            ₹{originalPrice.toLocaleString("en-IN")}
          </span>
        )}
        <span className="pb-1 text-[10px] text-green-700 font-bold uppercase tracking-wider bg-green-50 px-2 py-0.5 border border-green-200">
          In Stock · Archival Quality
        </span>
      </div>

      {/* Size Option Selector */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-grey-stone font-bold block">
          Select Dimensions
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {sizeOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSelectedSize(opt)}
              className={`p-3 text-left border text-xs transition-all ${
                selectedSize.label === opt.label
                  ? "border-black-deep bg-black-deep text-white-pure"
                  : "border-black-deep/15 text-black-deep hover:border-black-deep/40 bg-white-pure"
              }`}
            >
              <span className="font-semibold block">{opt.label}</span>
              <span className={`text-[10px] block mt-0.5 ${selectedSize.label === opt.label ? "text-white-ivory/70" : "text-grey-stone"}`}>
                {opt.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Frame Option Selector */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-grey-stone font-bold block">
          Select Frame & Finish
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {frameOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSelectedFrame(opt)}
              className={`p-3 text-left border text-xs transition-all ${
                selectedFrame.label === opt.label
                  ? "border-black-deep bg-black-deep text-white-pure"
                  : "border-black-deep/15 text-black-deep hover:border-black-deep/40 bg-white-pure"
              }`}
            >
              <span className="font-semibold block">{opt.label}</span>
              <span className={`text-[10px] block mt-0.5 ${selectedFrame.label === opt.label ? "text-white-ivory/70" : "text-grey-stone"}`}>
                {opt.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Counter */}
      <div className="flex items-center gap-4 pt-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-grey-stone font-bold">
          Quantity:
        </span>
        <div className="flex items-center border border-black-deep/20 bg-white-pure">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-black-deep hover:bg-black-deep/5 transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="px-4 text-xs font-bold text-black-deep">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 text-black-deep hover:bg-black-deep/5 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center gap-3 border border-black-deep bg-black-deep px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white-pure transition-cinematic hover:bg-white-pure hover:text-black-deep shadow-md"
        >
          {added ? (
            <>
              <Check className="h-4 w-4 text-[#c9a227]" /> Added To Cart!
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> Add To Cart
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="inline-flex items-center justify-center gap-3 border border-black-deep px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-black-deep transition-cinematic hover:bg-black-deep hover:text-white-pure"
        >
          <MessageSquare className="h-4 w-4" /> Order via WhatsApp
        </button>
      </div>

      {/* Custom size helper link */}
      <div className="pt-2 flex items-center justify-between text-xs text-black-charcoal/70 border-t border-black-deep/10">
        <span>Need custom sanctum wall sizing?</span>
        <Link
          href="/custom-order"
          className="text-[11px] uppercase font-bold text-black-deep hover:underline flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c9a227]" /> Custom Commission →
        </Link>
      </div>
    </div>
  );
}
