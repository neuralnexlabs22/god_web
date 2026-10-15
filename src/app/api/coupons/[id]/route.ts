import { NextRequest, NextResponse } from "next/server";
import { supabaseQuery } from "@/lib/supabaseDb";
import { cookies } from "next/headers";
import { getAdminTokenFromCookies, verifyAdminSessionToken } from "@/lib/adminAuth";

async function isAuthorizedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = getAdminTokenFromCookies(cookieStore);
  return verifyAdminSessionToken(token);
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthed = await isAuthorizedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const body = await request.json();

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.description !== undefined) updates.description = body.description ? body.description.trim() : null;
    if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);
    if (body.max_uses !== undefined) updates.max_uses = body.max_uses ? parseInt(body.max_uses, 10) : null;
    if (body.min_purchase_amount !== undefined) updates.min_purchase_amount = Number(body.min_purchase_amount) || 0;
    if (body.start_date !== undefined) updates.start_date = body.start_date || null;
    if (body.expiry_date !== undefined) updates.expiry_date = body.expiry_date || null;

    if (body.original_price !== undefined && body.desired_price !== undefined) {
      const origPrice = Number(body.original_price);
      const desPrice = Number(body.desired_price);
      if (origPrice <= 0 || desPrice < 0 || desPrice > origPrice) {
        return NextResponse.json({ error: "Invalid price calculation values" }, { status: 400 });
      }
      updates.original_price = origPrice;
      updates.desired_price = desPrice;
      updates.discount_amount = Math.round((origPrice - desPrice) * 100) / 100;
      updates.discount_percentage = Math.round(((updates.discount_amount / origPrice) * 100) * 100) / 100;
    }

    const { data, error } = await supabaseQuery("discount_coupons", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(id)}`,
      body: updates,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, coupon: data?.[0] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthed = await isAuthorizedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const { error } = await supabaseQuery("discount_coupons", {
      method: "DELETE",
      query: `id=eq.${encodeURIComponent(id)}`,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
