"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  RefreshCw,
  Globe,
  Compass,
  ArrowUpRight,
} from "lucide-react";

interface AnalyticsData {
  metrics: {
    totalViews: number;
    totalUniqueVisitors: number;
    todayViews: number;
    todayUniqueVisitors: number;
    viewsLast7Days: number;
    uniqueVisitorsLast7Days: number;
    viewsLast30Days: number;
    uniqueVisitorsLast30Days: number;
  };
  last7Days: { date: string; views: number; visitors: number }[];
  last30Days: { date: string; views: number; visitors: number }[];
  topPages: { path: string; count: number }[];
  deviceBreakdown: Record<string, number>;
  recentEvents: {
    path: string;
    title: string;
    visitor_id: string;
    device_category: string;
    browser: string;
    created_at: string;
  }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7days" | "30days">("7days");
  const [hoveredBar, setHoveredBar] = useState<{ date: string; views: number; visitors: number } | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics/stats");
      const json = await res.json();
      if (json.metrics) {
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const chartData = timeRange === "7days" ? data?.last7Days || [] : data?.last30Days || [];
  const maxViews = useMemo(() => {
    if (chartData.length === 0) return 10;
    return Math.max(...chartData.map((d) => d.views), 10);
  }, [chartData]);

  // Total devices
  const totalDeviceHits = useMemo(() => {
    if (!data?.deviceBreakdown) return 0;
    return Object.values(data.deviceBreakdown).reduce((a, b) => a + Number(b), 0);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a227]">
            Traffic & Insights
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-medium uppercase tracking-tight text-white mt-0.5">
            Website Visitor Analytics
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Genuine visitor activity, daily page view trends, and top devotional gallery sections
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="flex items-center justify-center gap-2 border border-white/10 hover:border-[#c9a227]/40 text-white font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-[#c9a227] ${loading ? "animate-spin" : ""}`} />
          Refresh Stats
        </button>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-28 text-zinc-500">
          <RefreshCw className="w-8 h-8 animate-spin text-[#c9a227]" />
        </div>
      ) : !data ? (
        <div className="bg-[#070707] border border-white/5 rounded-2xl p-12 text-center text-zinc-500">
          <Globe className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p>No analytics data available yet. Public visits will be automatically recorded.</p>
        </div>
      ) : (
        <>
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#070707] border border-[#c9a227]/25 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                  Total Page Views
                </span>
                <Eye className="w-4 h-4 text-[#c9a227]" />
              </div>
              <p className="text-3xl font-black text-white">
                {data.metrics.totalViews.toLocaleString("en-IN")}
              </p>
              <span className="text-[10px] text-zinc-500 mt-1 block">
                All-time recorded public page views
              </span>
            </div>

            <div className="bg-[#070707] border border-white/5 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                  Unique Devotees
                </span>
                <Users className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-3xl font-black text-white">
                {data.metrics.totalUniqueVisitors.toLocaleString("en-IN")}
              </p>
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Distinct anonymous visitors
              </span>
            </div>

            <div className="bg-[#070707] border border-white/5 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                  Today&apos;s Traffic
                </span>
                <TrendingUp className="w-4 h-4 text-[#c9a227]" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white">{data.metrics.todayViews}</p>
                <span className="text-xs text-zinc-400">
                  ({data.metrics.todayUniqueVisitors} visitors)
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Recorded since midnight
              </span>
            </div>

            <div className="bg-[#070707] border border-white/5 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                  Last 7 Days
                </span>
                <BarChart3 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white">
                  {data.metrics.viewsLast7Days.toLocaleString("en-IN")}
                </p>
                <span className="text-xs text-zinc-400">
                  ({data.metrics.uniqueVisitorsLast7Days} visitors)
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Weekly traffic trajectory
              </span>
            </div>
          </div>

          {/* Daily Visitor Trend Chart */}
          <div className="bg-[#070707] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-serif font-bold uppercase tracking-wider text-white">
                  Daily Traffic Trend
                </h3>
                <p className="text-xs text-zinc-400">
                  Pageviews and distinct unique visitors over time
                </p>
              </div>

              {/* Time Range Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeRange("7days")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    timeRange === "7days"
                      ? "bg-[#c9a227] text-black"
                      : "bg-black border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setTimeRange("30days")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    timeRange === "30days"
                      ? "bg-[#c9a227] text-black"
                      : "bg-black border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  Last 30 Days
                </button>
              </div>
            </div>

            {/* Hover tooltip readout */}
            {hoveredBar && (
              <div className="text-xs bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-4 w-fit">
                <span className="text-[#c9a227] font-semibold">{hoveredBar.date}:</span>
                <span className="text-white font-bold">{hoveredBar.views} views</span>
                <span className="text-zinc-400 font-medium">({hoveredBar.visitors} unique visitors)</span>
              </div>
            )}

            {/* Responsive Chart Bars */}
            <div className="h-48 flex items-end gap-2 pt-6 pb-2 border-b border-white/5 overflow-x-auto">
              {chartData.map((item) => {
                const heightPct = Math.max(8, Math.round((item.views / maxViews) * 100));
                return (
                  <div
                    key={item.date}
                    onMouseEnter={() => setHoveredBar(item)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="flex-1 flex flex-col items-center justify-end h-full min-w-[28px] group cursor-pointer"
                  >
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-t-lg bg-[#c9a227]/30 border-t border-x border-[#c9a227]/60 group-hover:bg-[#c9a227] transition-all relative"
                    >
                      {item.views > 0 && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#c9a227] opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.views}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-zinc-500 font-mono mt-2 truncate w-full text-center">
                      {item.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lower Two Column: Top Pages & Device Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Visited Pages */}
            <div className="bg-[#070707] border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#c9a227]" />
                <h3 className="font-serif font-bold text-white uppercase text-sm tracking-wider">
                  Most Visited Pages
                </h3>
              </div>

              {data.topPages.length === 0 ? (
                <p className="text-xs text-zinc-500 py-6 text-center">No page traffic recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.topPages.map((page, idx) => {
                    const pct = Math.round((page.count / (data.metrics.totalViews || 1)) * 100);
                    return (
                      <div key={page.path} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-zinc-300 truncate max-w-[280px]">
                            {idx + 1}. {page.path}
                          </span>
                          <span className="font-bold text-white">{page.count} views ({pct}%)</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full bg-[#c9a227] rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Device Breakdown */}
            <div className="bg-[#070707] border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#c9a227]" />
                <h3 className="font-serif font-bold text-white uppercase text-sm tracking-wider">
                  Visitor Device Breakdown
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { label: "Desktop", icon: Monitor, key: "Desktop" },
                  { label: "Mobile", icon: Smartphone, key: "Mobile" },
                  { label: "Tablet", icon: Tablet, key: "Tablet" },
                ].map(({ label, icon: Icon, key }) => {
                  const count = data.deviceBreakdown[key] || 0;
                  const pct = totalDeviceHits > 0 ? Math.round((count / totalDeviceHits) * 100) : 0;
                  return (
                    <div
                      key={label}
                      className="bg-black/60 border border-white/10 rounded-xl p-4 text-center"
                    >
                      <Icon className="w-5 h-5 mx-auto text-[#c9a227] mb-2" />
                      <p className="text-xs font-semibold text-zinc-300">{label}</p>
                      <p className="text-xl font-black text-white mt-1">{count}</p>
                      <span className="text-[10px] text-zinc-500 font-mono">{pct}% of visitors</span>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity Feed */}
              <div className="pt-4 border-t border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#c9a227]" /> Live Recent Visits
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {data.recentEvents.slice(0, 8).map((event, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.03]"
                    >
                      <div className="flex items-center gap-2 truncate max-w-[240px]">
                        <span className="text-[10px] text-[#c9a227] font-mono">
                          [{event.device_category}]
                        </span>
                        <span className="text-zinc-300 truncate">{event.path}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 whitespace-nowrap ml-2">
                        {new Date(event.created_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
