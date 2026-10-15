import { NextRequest, NextResponse } from "next/server";
import { supabaseQuery } from "@/lib/supabaseDb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      path,
      title,
      visitorId,
      referrer,
      deviceCategory = "Desktop",
      browser,
    } = body;

    // Do not track admin routes or internal api routes
    if (!path || typeof path !== "string" || path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ignored: true });
    }

    const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const timestamp = new Date().toISOString();

    const eventRecord = {
      path,
      title: title || path,
      visitor_id: visitorId || "anon",
      referrer: referrer || null,
      device_category: deviceCategory,
      browser: browser || "Unknown",
      created_at: timestamp,
      date: todayDate,
    };

    // Load existing summary from site_settings table in Supabase
    const { data: summaryRows } = await supabaseQuery<any[]>("site_settings", {
      query: `setting_key=eq.analytics_summary&select=*`,
      useServiceRole: true,
    });

    let summary: {
      totalViews: number;
      uniqueVisitors: string[];
      dailyViews: Record<string, number>;
      dailyVisitors: Record<string, string[]>;
      pathCounts: Record<string, number>;
      deviceCounts: Record<string, number>;
      recentEvents: any[];
    } = {
      totalViews: 0,
      uniqueVisitors: [],
      dailyViews: {},
      dailyVisitors: {},
      pathCounts: {},
      deviceCounts: {},
      recentEvents: [],
    };

    if (summaryRows && summaryRows[0]?.setting_value) {
      summary = { ...summary, ...summaryRows[0].setting_value };
    }

    // Increment totals
    summary.totalViews = (summary.totalViews || 0) + 1;

    // Track unique visitors globally (capped at last 5000 IDs for storage sanity)
    if (!summary.uniqueVisitors.includes(visitorId)) {
      summary.uniqueVisitors = [visitorId, ...summary.uniqueVisitors.slice(0, 4999)];
    }

    // Track daily views and daily unique visitors
    summary.dailyViews[todayDate] = (summary.dailyViews[todayDate] || 0) + 1;
    if (!summary.dailyVisitors[todayDate]) {
      summary.dailyVisitors[todayDate] = [];
    }
    if (!summary.dailyVisitors[todayDate].includes(visitorId)) {
      summary.dailyVisitors[todayDate].push(visitorId);
    }

    // Track path counts
    summary.pathCounts[path] = (summary.pathCounts[path] || 0) + 1;

    // Track device counts
    summary.deviceCounts[deviceCategory] = (summary.deviceCounts[deviceCategory] || 0) + 1;

    // Store recent 100 events
    summary.recentEvents = [eventRecord, ...(summary.recentEvents || []).slice(0, 99)];

    // Persist to Supabase site_settings
    if (summaryRows && summaryRows.length > 0) {
      await supabaseQuery("site_settings", {
        method: "PATCH",
        query: `setting_key=eq.analytics_summary`,
        body: {
          setting_value: summary,
          description: "Persistent website visitor analytics aggregate",
          updated_at: timestamp,
        },
      });
    } else {
      await supabaseQuery("site_settings", {
        method: "POST",
        body: {
          setting_key: "analytics_summary",
          setting_value: summary,
          description: "Persistent website visitor analytics aggregate",
          updated_at: timestamp,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
