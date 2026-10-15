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
    const { searchParams } = new URL(request.url);
    const isAuthed = await isAuthorizedAdmin();
    const showAll = isAuthed && searchParams.get("all") === "true";

    const query = showAll
      ? "select=*&order=display_order.asc,created_at.desc"
      : "is_published=eq.true&select=*&order=display_order.asc,created_at.desc";

    const { data, error } = await supabaseQuery("customer_reviews", {
      query,
      useServiceRole: true,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ reviews: data || [] });
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
    const body = await request.json();

    const {
      customer_name,
      customer_image = null,
      rating = 5,
      review_text,
      designation = "Devotee & Art Collector",
      is_published = isAuthed ? true : false, // public submissions require admin approval
      review_date = new Date().toISOString().split("T")[0],
      display_order = 0,
    } = body;

    if (!customer_name || typeof customer_name !== "string" || !customer_name.trim()) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }

    if (!review_text || typeof review_text !== "string" || !review_text.trim()) {
      return NextResponse.json({ error: "Review text is required" }, { status: 400 });
    }

    const numRating = Math.min(5, Math.max(1, parseInt(String(rating), 10) || 5));

    const newReview = {
      customer_name: customer_name.trim(),
      customer_image: customer_image || null,
      rating: numRating,
      review_text: review_text.trim(),
      designation: designation ? designation.trim() : null,
      is_published: Boolean(is_published),
      review_date: review_date || new Date().toISOString().split("T")[0],
      display_order: parseInt(String(display_order), 10) || 0,
    };

    const { data, error } = await supabaseQuery("customer_reviews", {
      method: "POST",
      body: newReview,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, review: data?.[0] || newReview },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
