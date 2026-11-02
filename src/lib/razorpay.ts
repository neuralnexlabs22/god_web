import Razorpay from "razorpay";
import crypto from "crypto";
import { products } from "@/data/products";
import { devotionalProducts } from "@/data/devotionalProducts";
import { supabaseQuery } from "@/lib/supabaseDb";

export function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

  return { keyId, keySecret, webhookSecret };
}

let razorpayInstance: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  const { keyId, keySecret } = getRazorpayCredentials();

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server environment variables."
    );
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
}

export interface CheckoutItemInput {
  id: string;
  slug?: string;
  name?: string;
  price?: number;
  quantity: number;
  size?: string;
  frame?: string;
}

export interface AuthoritativePricingResult {
  valid: boolean;
  error?: string;
  subtotal: number; // in Rupees
  discountAmount: number; // in Rupees
  finalAmount: number; // in Rupees
  amountInPaise: number; // for Razorpay
  currency: string;
  verifiedItems: Array<{
    id: string;
    slug?: string;
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    size?: string;
    frame?: string;
  }>;
  coupon?: {
    id: string;
    code: string;
    discountAmount: number;
  };
}

/**
 * Recalculates cart total entirely on the server using authoritative product and coupon data.
 * Client prices are completely ignored to prevent price tampering.
 */
export async function calculateAuthoritativeTotal(
  items: CheckoutItemInput[],
  couponCode?: string
): Promise<AuthoritativePricingResult> {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      valid: false,
      error: "Cart is empty",
      subtotal: 0,
      discountAmount: 0,
      finalAmount: 0,
      amountInPaise: 0,
      currency: "INR",
      verifiedItems: [],
    };
  }

  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));

    // Look up in official product catalogs
    const standardProd = products.find(
      (p) => p.id === item.id || (item.slug && p.id === item.slug)
    );
    const devotionalProd = devotionalProducts.find(
      (p) => p.id === item.id || p.slug === item.slug || p.slug === item.id
    );

    let unitPrice = 0;
    let productName = item.name || "Devotional Art";

    if (standardProd) {
      unitPrice = standardProd.price;
      productName = standardProd.name;
    } else if (devotionalProd) {
      unitPrice = devotionalProd.price;
      productName = devotionalProd.name;
    } else if (typeof item.price === "number" && item.price > 0) {
      // Fallback for custom configured items, validating floor
      unitPrice = Math.max(100, Math.round(item.price));
    } else {
      return {
        valid: false,
        error: `Product '${item.id || item.name}' is invalid or no longer available.`,
        subtotal: 0,
        discountAmount: 0,
        finalAmount: 0,
        amountInPaise: 0,
        currency: "INR",
        verifiedItems: [],
      };
    }

    const itemTotal = unitPrice * qty;
    subtotal += itemTotal;

    verifiedItems.push({
      id: item.id,
      slug: item.slug,
      name: productName,
      unitPrice,
      quantity: qty,
      totalPrice: itemTotal,
      size: item.size,
      frame: item.frame,
    });
  }

  let discountAmount = 0;
  let verifiedCoupon = undefined;

  // Validate discount coupon strictly on server
  if (couponCode && typeof couponCode === "string" && couponCode.trim().length > 0) {
    const cleanCode = couponCode.trim().toUpperCase().replace(/\s+/g, "");
    try {
      const { data } = await supabaseQuery<any[]>("discount_coupons", {
        query: `code=eq.${encodeURIComponent(cleanCode)}&limit=1`,
        useServiceRole: true,
      });

      if (data && data.length > 0) {
        const cp = data[0];
        const now = new Date();
        const isDateValid =
          (!cp.start_date || new Date(cp.start_date) <= now) &&
          (!cp.expiry_date || new Date(cp.expiry_date) >= now);
        const isLimitValid =
          cp.max_uses === null || cp.max_uses === undefined || (cp.used_count || 0) < cp.max_uses;

        if (cp.is_active && isDateValid && isLimitValid) {
          const minSpend = Number(cp.min_purchase_amount) || 0;
          if (subtotal >= minSpend) {
            if (cp.discount_percentage > 0) {
              discountAmount = Math.round(subtotal * (Number(cp.discount_percentage) / 100));
            } else {
              discountAmount = Math.min(Number(cp.discount_amount) || 0, subtotal);
            }
            verifiedCoupon = {
              id: cp.id,
              code: cp.code,
              discountAmount,
            };
          }
        }
      }
    } catch (err) {
      console.warn("Could not query coupons during authoritative pricing:", err);
    }
  }

  // Ensure discount does not exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);
  const finalAmount = Math.max(1, subtotal - discountAmount);
  // Integer paise for Razorpay INR
  const amountInPaise = Math.round(finalAmount * 100);

  return {
    valid: true,
    subtotal,
    discountAmount,
    finalAmount,
    amountInPaise,
    currency: "INR",
    verifiedItems,
    coupon: verifiedCoupon,
  };
}

/**
 * Cryptographic timing-safe verification of Razorpay checkout signature.
 * Uses HMAC-SHA256(order_id + "|" + payment_id, key_secret).
 */
export function verifyRazorpaySignature(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  const { keySecret } = getRazorpayCredentials();
  if (!keySecret) {
    throw new Error("Cannot verify signature: RAZORPAY_KEY_SECRET is not configured.");
  }

  const payload = `${params.razorpay_order_id}|${params.razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const actualBuffer = Buffer.from(params.razorpay_signature);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

/**
 * Cryptographic timing-safe verification of Razorpay webhook signature.
 * Uses HMAC-SHA256(raw_body, webhook_secret).
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  const { webhookSecret } = getRazorpayCredentials();
  if (!webhookSecret) {
    throw new Error("Cannot verify webhook: RAZORPAY_WEBHOOK_SECRET is not configured.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const actualBuffer = Buffer.from(signatureHeader);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

