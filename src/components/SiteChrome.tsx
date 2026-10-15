"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import AnalyticsTracker from "./AnalyticsTracker";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AnalyticsTracker />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <CartDrawer />
      <Footer />
    </>
  );
}
