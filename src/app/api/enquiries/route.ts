import { NextRequest, NextResponse } from "next/server";
import { supabaseQuery } from "@/lib/supabaseDb";
import { cookies } from "next/headers";
import { getAdminTokenFromCookies, verifyAdminSessionToken } from "@/lib/adminAuth";

async function isAuthorizedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = getAdminTokenFromCookies(cookieStore);
  return verifyAdminSessionToken(token);
}

export interface CustomEnquiry {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  requested_deity: string;
  dimensions: string;
  frame_preference: string;
  customization_details: string;
  reference_image?: string | null;
  notes?: string;
  status: "new" | "contacted" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const isAuthed = await isAuthorizedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: rows, error } = await supabaseQuery<any[]>("site_settings", {
      query: `setting_key=eq.custom_devotional_enquiries&select=*`,
      useServiceRole: true,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    const enquiries: CustomEnquiry[] = rows?.[0]?.setting_value?.enquiries || [];
    return NextResponse.json({ enquiries });
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
      customer_name,
      phone,
      email = "",
      requested_deity,
      dimensions = "16 x 24 in",
      frame_preference = "Teak Wood Frame",
      customization_details = "",
      reference_image = null,
      notes = "",
    } = body;

    if (!customer_name || typeof customer_name !== "string" || !customer_name.trim()) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json({ error: "Contact phone number is required" }, { status: 400 });
    }

    if (!requested_deity || typeof requested_deity !== "string" || !requested_deity.trim()) {
      return NextResponse.json({ error: "Requested deity or artwork is required" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const newEnquiry: CustomEnquiry = {
      id: `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : "",
      requested_deity: requested_deity.trim(),
      dimensions: dimensions ? dimensions.trim() : "16 x 24 in",
      frame_preference: frame_preference ? frame_preference.trim() : "Teak Wood Frame",
      customization_details: customization_details ? customization_details.trim() : "",
      reference_image: reference_image || null,
      notes: notes ? notes.trim() : "",
      status: "new",
      created_at: timestamp,
      updated_at: timestamp,
    };

    // Load existing enquiries
    const { data: rows } = await supabaseQuery<any[]>("site_settings", {
      query: `setting_key=eq.custom_devotional_enquiries&select=*`,
      useServiceRole: true,
    });

    let currentList: CustomEnquiry[] = [];
    if (rows && rows[0]?.setting_value?.enquiries) {
      currentList = rows[0].setting_value.enquiries;
    }

    const updatedList = [newEnquiry, ...currentList];

    // Save to Supabase site_settings
    if (rows && rows.length > 0) {
      await supabaseQuery("site_settings", {
        method: "PATCH",
        query: `setting_key=eq.custom_devotional_enquiries`,
        body: {
          setting_value: { enquiries: updatedList },
          description: "Persistent custom devotional photo enquiries",
          updated_at: timestamp,
        },
      });
    } else {
      await supabaseQuery("site_settings", {
        method: "POST",
        body: {
          setting_key: "custom_devotional_enquiries",
          setting_value: { enquiries: updatedList },
          description: "Persistent custom devotional photo enquiries",
          updated_at: timestamp,
        },
      });
    }

    return NextResponse.json({ success: true, enquiry: newEnquiry }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
