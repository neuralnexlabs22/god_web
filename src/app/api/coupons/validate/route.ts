import { NextRequest, NextResponse } from "next/server";
import { supabaseQuery } from "@/lib/supabaseDb";

export interface CartItemPayload {
  id: string;
  slug?: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  frame?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, items, subtotal } = body as {
      code: string;
      items: CartItemPayload[];
      subtotal?: number;
    };

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { valid: false, message: "Please enter a coupon code" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { valid: false, message: "Your cart is empty" },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, "");

    // Fetch coupon from persistent Supabase database
    const { data, error } = await supabaseQuery<any[]>("discount_coupons", {
      query: `code=eq.${encodeURIComponent(normalizedCode)}&limit=1`,
      useServiceRole: true,
    });

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        valid: false,
        message: `Coupon '${normalizedCode}' not found. Please check the code and try again.`,
      });
    }

    const coupon = data[0];

    // Check active status
    if (!coupon.is_active) {
      return NextResponse.json({
        valid: false,
        message: `Coupon '${normalizedCode}' is currently inactive.`,
      });
    }

    // Check validity dates
    const now = new Date();
    if (coupon.start_date && new Date(coupon.start_date) > now) {
      return NextResponse.json({
        valid: false,
        message: `Coupon '${normalizedCode}' is not active yet. Starts on ${new Date(
          coupon.start_date
        ).toLocaleDateString("en-IN")}.`,
      });
    }

    if (coupon.expiry_date) {
      const expiry = new Date(coupon.expiry_date);
      // Allow through the end of the expiry day
      expiry.setHours(23, 59, 59, 999);
      if (now > expiry) {
        return NextResponse.json({
          valid: false,
          message: `Coupon '${normalizedCode}' expired on ${new Date(
            coupon.expiry_date
          ).toLocaleDateString("en-IN")}.`,
        });
      }
    }

    // Check usage limits
    if (
      coupon.max_uses !== null &&
      coupon.max_uses !== undefined &&
      coupon.used_count >= coupon.max_uses
    ) {
      return NextResponse.json({
        valid: false,
        message: `Coupon '${normalizedCode}' usage limit has been reached.`,
      });
    }

    // Calculate actual cart subtotal securely from items
    const authoritativeSubtotal = items.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Math.max(1, item.quantity) || 1),
      0
    );

    // Check minimum purchase amount
    const minAmount = Number(coupon.min_purchase_amount) || 0;
    if (minAmount > 0 && authoritativeSubtotal < minAmount) {
      return NextResponse.json({
        valid: false,
        message: `Minimum purchase of ₹${minAmount.toLocaleString("en-IN")} required for coupon '${normalizedCode}'. Current eligible: ₹${authoritativeSubtotal.toLocaleString("en-IN")}.`,
      });
    }

    let eligibleAmount = authoritativeSubtotal;
    let discountAmount = 0;

    if (coupon.applies_to === "product" && coupon.product_id) {
      // Find matching product in cart
      const matchingItem = items.find(
        (item) => item.id === coupon.product_id || item.slug === coupon.product_id
      );

      if (!matchingItem) {
        return NextResponse.json({
          valid: false,
          message: `Coupon '${normalizedCode}' is only valid for '${coupon.product_name || "the specified devotional print"}' which is not in your cart.`,
        });
      }

      eligibleAmount = (Number(matchingItem.price) || 0) * (Math.max(1, matchingItem.quantity) || 1);

      if (coupon.discount_percentage > 0) {
        discountAmount = Math.round((eligibleAmount * (coupon.discount_percentage / 100)) * 100) / 100;
      } else {
        discountAmount = Math.min(Number(coupon.discount_amount) || 0, eligibleAmount);
      }
    } else {
      // Whole order coupon
      eligibleAmount = authoritativeSubtotal;

      if (coupon.discount_percentage > 0) {
        discountAmount = Math.round((eligibleAmount * (coupon.discount_percentage / 100)) * 100) / 100;
      } else {
        discountAmount = Math.min(Number(coupon.discount_amount) || 0, eligibleAmount);
      }
    }

    // Cap discount so it cannot exceed eligible amount
    discountAmount = Math.min(discountAmount, eligibleAmount);
    const finalAmount = Math.max(0, authoritativeSubtotal - discountAmount);

    return NextResponse.json({
      valid: true,
      message: `Coupon '${normalizedCode}' applied successfully! Saved ₹${discountAmount.toLocaleString("en-IN")}.`,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        discount_amount: discountAmount,
        discount_percentage: coupon.discount_percentage,
        applies_to: coupon.applies_to,
        eligible_amount: eligibleAmount,
        subtotal: authoritativeSubtotal,
        final_amount: finalAmount,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { valid: false, message: err instanceof Error ? err.message : "Validation failed" },
      { status: 500 }
    );
  }
}
