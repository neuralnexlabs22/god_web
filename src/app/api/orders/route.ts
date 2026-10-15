import { NextRequest, NextResponse } from "next/server";
import { supabaseQuery } from "@/lib/supabaseDb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      customer_email,
      shipping_address,
      items,
      subtotal,
      discount_amount = 0,
      final_amount,
      coupon_code,
      coupon_id,
      payment_method = "whatsapp_direct",
    } = body;

    const orderId = `GOD-${Date.now().toString(36).toUpperCase()}`;

    // Record order in Supabase orders table
    const orderData = {
      total_amount: Number(final_amount) || Number(subtotal) || 0,
      status: "pending",
      payment_status: payment_method === "cod" ? "pending_cod" : "pending_verification",
      shipping_address: JSON.stringify({
        customer_name,
        customer_phone,
        customer_email,
        address: shipping_address,
        payment_method,
        items,
        subtotal,
        discount_amount,
        coupon_code,
      }),
    };

    const { data: createdOrder, error: orderError } = await supabaseQuery("orders", {
      method: "POST",
      body: orderData,
    });

    if (orderError) {
      console.warn("Could not write order directly to orders table:", orderError);
    }

    // If coupon was applied, record in coupon_usages table
    if (coupon_code) {
      const usageRecord = {
        coupon_id: coupon_id || null,
        coupon_code: String(coupon_code).toUpperCase(),
        order_id: orderId,
        customer_name: customer_name ? String(customer_name).trim() : "Store Customer",
        customer_phone: customer_phone ? String(customer_phone).trim() : null,
        original_amount: Number(subtotal) || 0,
        discount_amount: Number(discount_amount) || 0,
        final_amount: Number(final_amount) || 0,
      };

      await supabaseQuery("coupon_usages", {
        method: "POST",
        body: usageRecord,
      });

      // Increment used count on coupon
      const { data: couponData } = await supabaseQuery<any[]>("discount_coupons", {
        query: `code=eq.${encodeURIComponent(String(coupon_code).toUpperCase())}&select=id,used_count`,
      });
      if (couponData && couponData[0]) {
        const currentCount = Number(couponData[0].used_count) || 0;
        await supabaseQuery("discount_coupons", {
          method: "PATCH",
          query: `id=eq.${encodeURIComponent(couponData[0].id)}`,
          body: { used_count: currentCount + 1, updated_at: new Date().toISOString() },
        });
      }
    }

    return NextResponse.json({
      success: true,
      order_id: orderId,
      order: createdOrder?.[0] || { id: orderId, ...orderData },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to record order" },
      { status: 500 }
    );
  }
}
