import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient, verifyRazorpaySignature } from "@/lib/razorpay";
import { supabaseQuery } from "@/lib/supabaseDb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      internal_order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    // 1. Basic validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required payment verification parameters" },
        { status: 400 }
      );
    }

    // 2. Fetch the corresponding internal order from database
    let serverOrderId = razorpay_order_id;
    let expectedAmountPaise: number | null = null;
    let internalId = internal_order_id;

    if (internal_order_id) {
      const { data: orderData } = await supabaseQuery<any[]>("orders", {
        query: `id=eq.${encodeURIComponent(internal_order_id)}&limit=1`,
        useServiceRole: true,
      });

      if (orderData && orderData.length > 0) {
        const order = orderData[0];
        // Enforce that client's razorpay_order_id matches our database record
        if (order.razorpay_order_id && order.razorpay_order_id !== razorpay_order_id) {
          return NextResponse.json(
            { success: false, error: "Razorpay order ID mismatch" },
            { status: 400 }
          );
        }
        serverOrderId = order.razorpay_order_id || razorpay_order_id;
        expectedAmountPaise = Math.round(Number(order.total_amount) * 100);
      }
    }

    // 3. Cryptographic HMAC-SHA256 signature verification (constant-time)
    const isSignatureValid = verifyRazorpaySignature({
      razorpay_order_id: serverOrderId,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isSignatureValid) {
      console.error("Payment signature verification failed for order:", serverOrderId);
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // 4. Fetch actual payment from Razorpay API to confirm capture status, amount & currency
    const razorpay = getRazorpayClient();
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Unable to verify payment with gateway" },
        { status: 404 }
      );
    }

    // 5. Verify payment belongs to the expected Razorpay order
    if (payment.order_id !== serverOrderId) {
      return NextResponse.json(
        { success: false, error: "Payment does not match the generated order" },
        { status: 400 }
      );
    }

    // 6. Verify currency
    if (payment.currency !== "INR") {
      return NextResponse.json(
        { success: false, error: "Payment currency mismatch" },
        { status: 400 }
      );
    }

    // 7. Verify payment amount if expected amount is known
    if (expectedAmountPaise !== null && Number(payment.amount) !== expectedAmountPaise) {
      console.error(
        `Amount mismatch: expected ${expectedAmountPaise} paise, received ${payment.amount} paise`
      );
      return NextResponse.json(
        { success: false, error: "Payment amount does not match order total" },
        { status: 400 }
      );
    }

    // 8. Confirm captured status
    // Razorpay status can be "captured" or "authorized"
    if (payment.status !== "captured") {
      // If authorized, attempt auto-capture if needed or flag
      if (payment.status === "authorized") {
        try {
          await razorpay.payments.capture(
            razorpay_payment_id,
            Number(payment.amount),
            payment.currency
          );
        } catch (captureErr) {
          console.warn("Manual capture attempt notice:", captureErr);
        }
      } else {
        return NextResponse.json(
          { success: false, error: `Payment not captured. Current status: ${payment.status}` },
          { status: 400 }
        );
      }
    }

    // 9. Persist payment record into public.payment_records
    await supabaseQuery("payment_records", {
      method: "POST",
      body: {
        internal_order_id: internalId || serverOrderId,
        razorpay_order_id: serverOrderId,
        razorpay_payment_id,
        amount: Number(payment.amount) / 100,
        currency: payment.currency,
        status: "captured",
        payment_method: payment.method || "online",
        captured_at: new Date().toISOString(),
        raw_response: {
          id: payment.id,
          method: payment.method,
          bank: payment.bank,
          wallet: payment.wallet,
          vpa: payment.vpa,
        },
      },
      useServiceRole: true,
    });

    // 10. Update internal order to confirmed & paid
    if (internalId) {
      await supabaseQuery("orders", {
        method: "PATCH",
        query: `id=eq.${encodeURIComponent(internalId)}`,
        body: {
          payment_status: "captured",
          status: "confirmed",
          razorpay_payment_id,
          updated_at: new Date().toISOString(),
        },
        useServiceRole: true,
      });

      // Record coupon usage if applicable
      try {
        const { data: orderArr } = await supabaseQuery<any[]>("orders", {
          query: `id=eq.${encodeURIComponent(internalId)}&select=shipping_address`,
          useServiceRole: true,
        });

        if (orderArr && orderArr[0]?.shipping_address) {
          const parsed =
            typeof orderArr[0].shipping_address === "string"
              ? JSON.parse(orderArr[0].shipping_address)
              : orderArr[0].shipping_address;

          if (parsed.coupon_code) {
            await supabaseQuery("coupon_usages", {
              method: "POST",
              body: {
                coupon_code: String(parsed.coupon_code).toUpperCase(),
                order_id: internalId,
                customer_name: parsed.customer_name || "Online Customer",
                customer_phone: parsed.customer_phone || null,
                original_amount: Number(parsed.subtotal) || 0,
                discount_amount: Number(parsed.discount_amount) || 0,
                final_amount: Number(parsed.final_amount) || 0,
              },
              useServiceRole: true,
            });

            // Increment coupon count
            const { data: cpArr } = await supabaseQuery<any[]>("discount_coupons", {
              query: `code=eq.${encodeURIComponent(String(parsed.coupon_code).toUpperCase())}&select=id,used_count`,
              useServiceRole: true,
            });
            if (cpArr && cpArr[0]) {
              await supabaseQuery("discount_coupons", {
                method: "PATCH",
                query: `id=eq.${encodeURIComponent(cpArr[0].id)}`,
                body: {
                  used_count: (Number(cpArr[0].used_count) || 0) + 1,
                  updated_at: new Date().toISOString(),
                },
                useServiceRole: true,
              });
            }
          }
        }
      } catch (couponErr) {
        console.warn("Coupon record settlement warning:", couponErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and captured",
      orderId: internalId || serverOrderId,
      paymentId: razorpay_payment_id,
    });
  } catch (err: any) {
    console.error("Secure payment verification error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}

