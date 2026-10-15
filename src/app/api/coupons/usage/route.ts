import { NextRequest, NextResponse } from "next/server";
import { supabaseQuery } from "@/lib/supabaseDb";
import { cookies } from "next/headers";
import { getAdminTokenFromCookies, verifyAdminSessionToken } from "@/lib/adminAuth";

async function isAuthorizedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = getAdminTokenFromCookies(cookieStore);
  return verifyAdminSessionToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const isAuthed = await isAuthorizedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const couponId = searchParams.get("coupon_id");

    const query = couponId
      ? `coupon_id=eq.${encodeURIComponent(couponId)}&order=created_at.desc`
      : "select=*&order=created_at.desc&limit=100";

    const { data, error } = await supabaseQuery("coupon_usages", { query });
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ usages: data || [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      coupon_id,
      coupon_code,
      order_id,
      customer_name,
      customer_phone,
      original_amount,
      discount_amount,
      final_amount,
    } = body;

    if (!coupon_code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    // Insert usage record into coupon_usages
    const usageRecord = {
      coupon_id: coupon_id || null,
      coupon_code: String(coupon_code).toUpperCase(),
      order_id: order_id || `ORD-${Date.now().toString(36).toUpperCase()}`,
      customer_name: customer_name ? String(customer_name).trim() : "Store Customer",
      customer_phone: customer_phone ? String(customer_phone).trim() : null,
      original_amount: Number(original_amount) || 0,
      discount_amount: Number(discount_amount) || 0,
      final_amount: Number(final_amount) || 0,
    };

    const { data: usageData, error: usageError } = await supabaseQuery("coupon_usages", {
      method: "POST",
      body: usageRecord,
    });

    if (usageError) {
      console.warn("Could not record coupon usage in Supabase:", usageError);
    }

    // Increment used_count in discount_coupons if coupon_id or coupon_code is present
    if (coupon_id) {
      const { data: couponData } = await supabaseQuery<any[]>("discount_coupons", {
        query: `id=eq.${encodeURIComponent(coupon_id)}&select=used_count`,
      });
      if (couponData && couponData[0]) {
        const currentCount = Number(couponData[0].used_count) || 0;
        await supabaseQuery("discount_coupons", {
          method: "PATCH",
          query: `id=eq.${encodeURIComponent(coupon_id)}`,
          body: { used_count: currentCount + 1, updated_at: new Date().toISOString() },
        });
      }
    } else {
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

    return NextResponse.json({ success: true, usage: usageData?.[0] || usageRecord });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
