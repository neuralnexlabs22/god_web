"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, MessageSquare, Plus, Minus, Check, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useContactInfo } from "@/context/ContactInfoContext";
import type { DevotionalProduct } from "@/data/devotionalProducts";

const materialOptions = [
  { label: "22 Carat Exclusive", priceDelta: 0 },
  { label: "24 Carat Exclusive", priceDelta: 2000 },
];

const sizeOptions = [
  { label: "13 × 15 inches", priceDelta: 0 },
  { label: "15 × 18 inches", priceDelta: 500 },
  { label: "17 × 21 inches", priceDelta: 1200 },
  { label: "20 × 24 inches", priceDelta: 2200 },
  { label: "22 × 28 inches", priceDelta: 3400 },
];

export default function ProductDetailActions({ product }: { product: DevotionalProduct }) {
  const { addItem, openCart } = useCart();
  const { contactInfo } = useContactInfo();
  const whatsappNumber = contactInfo?.whatsapp_number || "8122228386";

  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = product.price + selectedMaterial.priceDelta + selectedSize.priceDelta;
  const originalPrice = product.originalPrice
    ? product.originalPrice + selectedMaterial.priceDelta + selectedSize.priceDelta
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
      frame: selectedMaterial.label,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
    const msg = `*🕉️ ORDER INQUIRY — TANJORE PAINTINGS*\n\n` +
      `Product: *${product.name}*\n` +
      `Material: ${selectedMaterial.label}\n` +
      `Size: ${selectedSize.label}\n` +
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
      </div>

      {/* Material Selector */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-grey-stone font-bold block">Material</span>
        <div className="flex flex-wrap gap-2">
          {materialOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSelectedMaterial(opt)}
              className={`px-4 py-2 text-sm border rounded-sm transition-all ${
                selectedMaterial.label === opt.label
                  ? "border-black-deep bg-black-deep !text-white font-semibold shadow-sm"
                  : "border-black-deep/20 text-black-deep hover:border-black-deep/60 bg-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-grey-stone font-bold block">Size</span>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSelectedSize(opt)}
              className={`px-4 py-2 text-sm border rounded-sm transition-all ${
                selectedSize.label === opt.label
                  ? "border-black-deep bg-black-deep !text-white font-semibold shadow-sm"
                  : "border-black-deep/20 text-black-deep hover:border-black-deep/60 bg-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Counter */}
      <div className="flex items-center gap-4 pt-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-grey-stone font-bold">Quantity</span>
        <div className="flex items-center border border-black-deep/20 bg-white-pure rounded-sm">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-black-deep hover:bg-black-deep/5 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-5 text-sm font-bold text-black-deep">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 text-black-deep hover:bg-black-deep/5 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center gap-3 border border-black-deep px-6 py-4 text-sm font-semibold text-black-deep transition-cinematic hover:bg-black-deep hover:text-white"
        >
          {added ? (
            <><Check className="h-4 w-4 text-[#c9a227]" /> Added To Cart!</>
          ) : (
            <><ShoppingBag className="h-4 w-4" /> Add to cart</>
          )}
        </button>

        <button
          type="button"
          onClick={() => { handleAddToCart(); openCart(); }}
          className="inline-flex items-center justify-center gap-3 bg-[#c47a2b] px-6 py-4 text-sm font-semibold text-white transition-cinematic hover:bg-[#a8661f]"
        >
          Buy it now
        </button>

        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="inline-flex items-center justify-center gap-3 bg-[#25D366] px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-cinematic hover:bg-[#1ebe5b]"
        >
          <MessageSquare className="h-4 w-4" /> Order on WhatsApp
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
