import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { supabaseQuery } from "@/lib/supabaseDb";

export async function POST(req: NextRequest) {
  try {
    // 1. Read exact raw HTTP request body as text BEFORE any parsing
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.warn("Razorpay Webhook: Missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    // 2. Validate cryptographic HMAC-SHA256 signature using RAZORPAY_WEBHOOK_SECRET
    let isSignatureValid = false;
    try {
      isSignatureValid = verifyRazorpayWebhookSignature(rawBody, signature);
    } catch (secErr: any) {
      console.error("Razorpay Webhook: Verification secret configuration error:", secErr.message);
      return NextResponse.json({ error: "Webhook secret unconfigured" }, { status: 500 });
    }

    if (!isSignatureValid) {
      console.warn("Razorpay Webhook: Signature verification failed");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    // 3. Parse JSON only after successful signature validation
    const event = JSON.parse(rawBody);
    const eventId = event.id || req.headers.get("x-razorpay-event-id");
    const eventType = event.event;

    if (!eventId || !eventType) {
      return NextResponse.json({ error: "Malformed event payload" }, { status: 400 });
    }

    // 4. Duplicate Webhook Protection (Deduplication)
    // Check if event has already been processed
    const { data: existingEvents } = await supabaseQuery<any[]>("razorpay_webhook_events", {
      query: `event_id=eq.${encodeURIComponent(eventId)}&limit=1`,
      useServiceRole: true,
    });

    if (existingEvents && existingEvents.length > 0) {
      // Event already processed, return 200 to acknowledge
      return NextResponse.json({ status: "already_processed", eventId }, { status: 200 });
    }

    // 5. Process according to event type
    const payload = event.payload;
    const paymentEntity = payload?.payment?.entity;
    const orderEntity = payload?.order?.entity;

    const rzpOrderId = paymentEntity?.order_id || orderEntity?.id;
    const rzpPaymentId = paymentEntity?.id;

    // Record webhook event in database
    await supabaseQuery("razorpay_webhook_events", {
      method: "POST",
      body: {
        event_id: eventId,
        event_type: eventType,
        order_id: rzpOrderId || null,
        payment_id: rzpPaymentId || null,
        status: "processed",
        signature_verified: true,
        payload: {
          event: eventType,
          created_at: event.created_at,
          order_id: rzpOrderId,
          payment_id: rzpPaymentId,
        },
      },
      useServiceRole: true,
    });

    if (rzpOrderId) {
      // Find internal order associated with this Razorpay order ID
      const { data: orderData } = await supabaseQuery<any[]>("orders", {
        query: `razorpay_order_id=eq.${encodeURIComponent(rzpOrderId)}&limit=1`,
        useServiceRole: true,
      });

      const order = orderData?.[0];

      if (eventType === "payment.captured" || eventType === "order.paid") {
        // Record payment in payment_records if paymentEntity exists
        if (rzpPaymentId && paymentEntity) {
          await supabaseQuery("payment_records", {
            method: "POST",
            body: {
              internal_order_id: order?.id || rzpOrderId,
              razorpay_order_id: rzpOrderId,
              razorpay_payment_id: rzpPaymentId,
              amount: Number(paymentEntity.amount) / 100,
              currency: paymentEntity.currency || "INR",
              status: "captured",
              payment_method: paymentEntity.method || "online",
              captured_at: new Date(paymentEntity.created_at * 1000).toISOString(),
              raw_response: {
                id: paymentEntity.id,
                method: paymentEntity.method,
                bank: paymentEntity.bank,
                wallet: paymentEntity.wallet,
                vpa: paymentEntity.vpa,
              },
            },
            useServiceRole: true,
          });
        }

        // Update order status: NEVER downgrade if already confirmed/delivered
        if (order && order.payment_status !== "captured") {
          await supabaseQuery("orders", {
            method: "PATCH",
            query: `id=eq.${encodeURIComponent(order.id)}`,
            body: {
              payment_status: "captured",
              status: "confirmed",
              razorpay_payment_id: rzpPaymentId || order.razorpay_payment_id,
              updated_at: new Date().toISOString(),
            },
            useServiceRole: true,
          });
        }
      } else if (eventType === "payment.failed") {
        if (order && order.payment_status !== "captured") {
          await supabaseQuery("orders", {
            method: "PATCH",
            query: `id=eq.${encodeURIComponent(order.id)}`,
            body: {
              payment_status: "failed",
              updated_at: new Date().toISOString(),
            },
            useServiceRole: true,
          });
        }
      } else if (eventType === "refund.processed") {
        if (order) {
          await supabaseQuery("orders", {
            method: "PATCH",
            query: `id=eq.${encodeURIComponent(order.id)}`,
            body: {
              payment_status: "refunded",
              updated_at: new Date().toISOString(),
            },
            useServiceRole: true,
          });
        }
      }
    }

    return NextResponse.json({ status: "ok", received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Razorpay webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}

