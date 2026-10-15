import { NextRequest, NextResponse } from "next/server";
import { supabaseQuery } from "@/lib/supabaseDb";
import { cookies } from "next/headers";
import { getAdminTokenFromCookies, verifyAdminSessionToken } from "@/lib/adminAuth";

async function isAuthorizedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = getAdminTokenFromCookies(cookieStore);
  return verifyAdminSessionToken(token);
}

export async function GET() {
  try {
    const isAuthed = await isAuthorizedAdmin();
    // Admin gets all coupons, public only gets basic query or none directly
    const query = isAuthed
      ? "select=*&order=created_at.desc"
      : "is_active=eq.true&select=id,code,name,description,original_price,desired_price,discount_amount,discount_percentage,applies_to,product_id,product_name,min_purchase_amount,start_date,expiry_date,is_active";

    const { data, error } = await supabaseQuery("discount_coupons", { query });
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({ coupons: data || [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthed = await isAuthorizedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      code,
      description,
      original_price,
      desired_price,
      applies_to = "order",
      product_id = null,
      product_name = null,
      min_purchase_amount = 0,
      max_uses = null,
      max_uses_per_customer = 1,
      start_date = null,
      expiry_date = null,
      is_active = true,
    } = body;

    const origPrice = Number(original_price);
    const desPrice = Number(desired_price);

    // Backend validation rules
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Coupon name is required" }, { status: 400 });
    }

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, "");

    if (!Number.isFinite(origPrice) || origPrice <= 0) {
      return NextResponse.json(
        { error: "Original price must be greater than zero" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(desPrice) || desPrice < 0) {
      return NextResponse.json(
        { error: "Desired selling price cannot be negative" },
        { status: 400 }
      );
    }

    if (desPrice > origPrice) {
      return NextResponse.json(
        { error: "Desired selling price cannot exceed original price" },
        { status: 400 }
      );
    }

    const discountAmount = Math.round((origPrice - desPrice) * 100) / 100;
    if (discountAmount <= 0) {
      return NextResponse.json(
        { error: "Cannot create a zero-discount coupon. Desired selling price must be less than original price." },
        { status: 400 }
      );
    }

    const discountPercentage = Math.round(((discountAmount / origPrice) * 100) * 100) / 100;

    // Check if code already exists
    const { data: existing } = await supabaseQuery("discount_coupons", {
      query: `code=eq.${encodeURIComponent(normalizedCode)}&select=id`,
    });
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: `Coupon code '${normalizedCode}' already exists. Please choose a unique code.` },
        { status: 400 }
      );
    }

    const newCoupon = {
      name: name.trim(),
      code: normalizedCode,
      description: description ? description.trim() : null,
      original_price: origPrice,
      desired_price: desPrice,
      discount_amount: discountAmount,
      discount_percentage: discountPercentage,
      applies_to: applies_to === "product" ? "product" : "order",
      product_id: applies_to === "product" ? product_id : null,
      product_name: applies_to === "product" ? product_name : null,
      min_purchase_amount: Math.max(0, Number(min_purchase_amount) || 0),
      max_uses: max_uses ? Math.max(1, parseInt(max_uses, 10)) : null,
      used_count: 0,
      max_uses_per_customer: Math.max(1, parseInt(max_uses_per_customer, 10) || 1),
      start_date: start_date || null,
      expiry_date: expiry_date || null,
      is_active: Boolean(is_active),
    };

    const { data, error } = await supabaseQuery("discount_coupons", {
      method: "POST",
      body: newCoupon,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ coupon: data?.[0] || newCoupon, success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
