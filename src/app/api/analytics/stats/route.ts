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

    const { data: summaryRows, error } = await supabaseQuery<any[]>("site_settings", {
      query: `setting_key=eq.analytics_summary&select=*`,
      useServiceRole: true,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    const summary = summaryRows?.[0]?.setting_value || {
      totalViews: 0,
      uniqueVisitors: [],
      dailyViews: {},
      dailyVisitors: {},
      pathCounts: {},
      deviceCounts: {},
      recentEvents: [],
    };

    const todayDate = new Date().toISOString().split("T")[0];

    // Compute metrics
    const totalViews = summary.totalViews || 0;
    const totalUniqueVisitors = (summary.uniqueVisitors || []).length;
    const todayViews = summary.dailyViews?.[todayDate] || 0;
    const todayUniqueVisitors = (summary.dailyVisitors?.[todayDate] || []).length;

    // Past 7 days calculation
    const now = new Date();
    const last7DaysList: { date: string; views: number; visitors: number }[] = [];
    const last30DaysList: { date: string; views: number; visitors: number }[] = [];

    let viewsLast7Days = 0;
    let viewsLast30Days = 0;
    const uniqueVisitors7Set = new Set<string>();
    const uniqueVisitors30Set = new Set<string>();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const views = summary.dailyViews?.[dateStr] || 0;
      const visitors = summary.dailyVisitors?.[dateStr] || [];

      viewsLast30Days += views;
      visitors.forEach((id: string) => uniqueVisitors30Set.add(id));

      if (i < 7) {
        viewsLast7Days += views;
        visitors.forEach((id: string) => uniqueVisitors7Set.add(id));
        last7DaysList.push({
          date: dateStr,
          views,
          visitors: visitors.length,
        });
      }

      last30DaysList.push({
        date: dateStr,
        views,
        visitors: visitors.length,
      });
    }

    // Top pages list
    const topPages = Object.entries(summary.pathCounts || {})
      .map(([path, count]) => ({ path, count: Number(count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Device breakdown
    const deviceBreakdown = summary.deviceCounts || { Desktop: 0, Mobile: 0, Tablet: 0 };

    return NextResponse.json({
      metrics: {
        totalViews,
        totalUniqueVisitors,
        todayViews,
        todayUniqueVisitors,
        viewsLast7Days,
        uniqueVisitorsLast7Days: uniqueVisitors7Set.size,
        viewsLast30Days,
        uniqueVisitorsLast30Days: uniqueVisitors30Set.size,
      },
      last7Days: last7DaysList,
      last30Days: last30DaysList,
      topPages,
      deviceBreakdown,
      recentEvents: (summary.recentEvents || []).slice(0, 30),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
