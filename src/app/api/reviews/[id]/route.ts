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

    if (body.customer_name !== undefined) updates.customer_name = body.customer_name.trim();
    if (body.customer_image !== undefined) updates.customer_image = body.customer_image || null;
    if (body.rating !== undefined) updates.rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    if (body.review_text !== undefined) updates.review_text = body.review_text.trim();
    if (body.designation !== undefined) updates.designation = body.designation ? body.designation.trim() : null;
    if (body.is_published !== undefined) updates.is_published = Boolean(body.is_published);
    if (body.review_date !== undefined) updates.review_date = body.review_date;
    if (body.display_order !== undefined) updates.display_order = parseInt(String(body.display_order), 10) || 0;

    const { data, error } = await supabaseQuery("customer_reviews", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(id)}`,
      body: updates,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, review: data?.[0] });
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
    const { error } = await supabaseQuery("customer_reviews", {
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
