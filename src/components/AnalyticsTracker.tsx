"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VISITOR_ID_KEY = "god_store_vid";

function getOrSetVisitorId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = "v_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return "anon_cookie_disabled";
  }
}

function getDeviceCategory(): "Mobile" | "Tablet" | "Desktop" {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
}

function getBrowserName(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("SamsungBrowser")) return "Samsung Browser";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  if (ua.includes("Edge") || ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Other";
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Never track admin paths or API requests
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Deduplicate rapid repeat fires for same path
    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    const visitorId = getOrSetVisitorId();
    const deviceCategory = getDeviceCategory();
    const browser = getBrowserName();
    const referrer = document.referrer || null;
    const title = document.title || pathname;

    // Send pageview asynchronously
    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          title,
          visitorId,
          referrer,
          deviceCategory,
          browser,
        }),
      }).catch(() => {
        // Silent fail so customer experience is unaffected
      });
    } catch {
      // Ignore network errors
    }
  }, [pathname]);

  return null;
}
