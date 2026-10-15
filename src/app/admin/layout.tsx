"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  PlusCircle,
  Store,
  Tag,
  Layers,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Ticket,
  MessageSquare,
  BarChart3,
  Send,
  Boxes,
} from "lucide-react";
import { useState } from "react";
import { ProductProvider } from "@/context/ProductContext";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Devotional Prints", icon: Package },
  { href: "/admin/products/add", label: "Add Print", icon: PlusCircle },
  { href: "/admin/inventory", label: "Inventory Stock", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/brands", label: "Deities & Themes", icon: Tag },
  { href: "/admin/coupons", label: "Discount Coupons", icon: Ticket },
  { href: "/admin/reviews", label: "Customer Reviews", icon: MessageSquare },
  { href: "/admin/analytics", label: "Visitor Analytics", icon: BarChart3 },
  { href: "/admin/enquiries", label: "Custom Enquiries", icon: Send },
  { href: "/admin/homepage", label: "Homepage Hero", icon: Store },
  { href: "/admin/settings", label: "Store Settings", icon: Eye },
  { href: "/admin/contact", label: "Contact & WhatsApp", icon: Lock },
];

/* ───── Login Screen ───── */
function AdminLoginScreen() {
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(username.trim(), password);
    if (!ok) {
      setError("Invalid username or password");
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[rgba(201,162,39,0.08)] rounded-full filter blur-[120px] pointer-events-none" />

      <div
        className={`relative w-full max-w-sm bg-[#0a0a0a] border border-[#c9a227]/30 rounded-3xl p-8 space-y-8 shadow-2xl ${
          shaking ? "animate-shake" : ""
        }`}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-[#c9a227]" />
          </div>
          <h1 className="text-xl font-serif font-bold uppercase tracking-widest text-white">
            Frames of Divine
          </h1>
          <p className="text-[11px] text-[#c9a227] tracking-[0.25em] uppercase mt-1 font-semibold">
            Devotional Frames Admin
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              placeholder="Enter admin username"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:border-[#c9a227] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-zinc-600 focus:border-[#c9a227] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#c9a227] text-black font-black uppercase tracking-widest text-xs py-3.5 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-[#c9a227]/20"
          >
            Sign In
          </button>
        </form>

        {/* Back to store */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-[#c9a227] transition-colors inline-flex items-center gap-1.5"
          >
            <Store className="w-3 h-3" />
            Back to Frames of Divine
          </Link>
        </div>
      </div>

      {/* Shake animation style */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-6px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(6px);
          }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  );
}

/* ───── Loading Screen ───── */
function AdminLoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#c9a227]/20 border-t-[#c9a227] rounded-full animate-spin" />
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
          Loading Frames of Divine Admin...
        </p>
      </div>
    </div>
  );
}

/* ───── Main Dashboard Shell ───── */
function AdminDashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#050505] border-r border-[#c9a227]/20 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Branding */}
        <div className="p-5 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9a227]/15 border border-[#c9a227]/30 flex items-center justify-center font-serif font-black text-[#c9a227] text-lg">
              🕉️
            </div>
            <div>
              <h1 className="text-sm font-serif font-black tracking-wider uppercase text-white">
                FRAMES OF DIVINE
              </h1>
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#c9a227] font-semibold">
                Devotional Frames
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  active
                    ? "bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/30 shadow-md shadow-[#c9a227]/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-red-500/20 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-[#c9a227]/30 text-xs font-bold uppercase tracking-wider text-[#c9a227] hover:bg-[#c9a227]/10 transition-all"
          >
            <Store className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-white/5 bg-[#030303] px-4 py-3 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-xl lg:hidden"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <span className="text-xs text-zinc-500 tracking-wider uppercase">
            Admin Dashboard
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ───── Auth-Gated Admin Layout ───── */
function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) return <AdminLoadingScreen />;
  if (!isAuthenticated) return <AdminLoginScreen />;

  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}

/* ───── Exported Layout ───── */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <ProductProvider>
        <AdminAuthGate>{children}</AdminAuthGate>
      </ProductProvider>
    </AdminAuthProvider>
  );
}
