import { NextRequest, NextResponse } from "next/server";
import {
  getRazorpayClient,
  getRazorpayCredentials,
  calculateAuthoritativeTotal,
} from "@/lib/razorpay";
import { supabaseQuery } from "@/lib/supabaseDb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      customer_name,
      customer_phone,
      customer_email,
      shipping_address,
      coupon_code,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customer_name || !customer_phone || !shipping_address) {
      return NextResponse.json(
        { error: "Customer name, phone, and delivery address are required" },
        { status: 400 }
      );
    }

    // 1. Authoritative Server-Side Price & Coupon Recalculation
    const pricing = await calculateAuthoritativeTotal(items, coupon_code);
    if (!pricing.valid) {
      return NextResponse.json({ error: pricing.error || "Invalid order items" }, { status: 400 });
    }

    const internalOrderId = `GOD-${Date.now().toString(36).toUpperCase()}`;

    // 2. Initialize Razorpay Client (strictly on backend)
    const razorpay = getRazorpayClient();
    const { keyId } = getRazorpayCredentials();

    // 3. Create Razorpay Order with authoritative amount in paise
    const razorpayOrder = await razorpay.orders.create({
      amount: pricing.amountInPaise,
      currency: "INR",
      receipt: internalOrderId,
      notes: {
        internal_order_id: internalOrderId,
        customer_name: String(customer_name).slice(0, 40),
        customer_phone: String(customer_phone).slice(0, 20),
        item_count: pricing.verifiedItems.length,
      },
    });

    if (!razorpayOrder || !razorpayOrder.id) {
      throw new Error("Failed to generate order from Razorpay gateway");
    }

    // 4. Save internal order in Supabase with payment_status = 'pending'
    const orderPayload = {
      id: internalOrderId,
      total_amount: pricing.finalAmount,
      subtotal: pricing.subtotal,
      discount_amount: pricing.discountAmount,
      currency: "INR",
      status: "pending",
      payment_status: "pending",
      payment_method: "razorpay",
      fulfillment_status: "pending",
      razorpay_order_id: razorpayOrder.id,
      customer_name: String(customer_name).trim(),
      customer_phone: String(customer_phone).trim(),
      customer_email: customer_email ? String(customer_email).trim() : null,
      shipping_address: JSON.stringify({
        customer_name: String(customer_name).trim(),
        customer_phone: String(customer_phone).trim(),
        customer_email: customer_email ? String(customer_email).trim() : null,
        address: String(shipping_address).trim(),
        payment_method: "razorpay",
        items: pricing.verifiedItems,
        subtotal: pricing.subtotal,
        discount_amount: pricing.discountAmount,
        final_amount: pricing.finalAmount,
        coupon_code: pricing.coupon?.code || null,
        razorpay_order_id: razorpayOrder.id,
      }),
    };

    const { error: dbError } = await supabaseQuery("orders", {
      method: "POST",
      body: orderPayload,
      useServiceRole: true,
    });

    if (dbError) {
      console.warn("Could not insert order in Supabase directly:", dbError);
    }

    // Return only public checkout requirements
    return NextResponse.json({
      success: true,
      orderId: internalOrderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
    });
  } catch (err: any) {
    console.error("Secure create-order error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to initialize secure checkout" },
      { status: 500 }
    );
  }
}

