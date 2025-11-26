// /components/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ handleLogout }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    const saved =
      typeof window !== "undefined" &&
      localStorage.getItem("sidebar-collapsed");
    return saved !== null ? saved === "true" : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed ? "true" : "false");
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "72px" : "256px"
    );
  }, [collapsed]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col
      bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900
      shadow-[0_18px_70px_rgba(15,23,42,0.95)]
      border-r border-slate-800/80 transition-all duration-300`}
      style={{ width: collapsed ? 72 : 256 }}
    >
      <div className="flex h-full flex-col px-3 py-5">
        <div className="flex items-center justify-between mb-6 px-2">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div
              className={`h-8 w-8 rounded-2xl shadow-lg ${
                collapsed
                  ? "bg-indigo-500"
                  : "bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400"
              }`}
            />

            {!collapsed && (
              <span className="text-sm font-semibold tracking-[0.25em] text-slate-100 uppercase">
                PlanPal
              </span>
            )}
          </div>

          {/* COLLAPSE BUTTON */}
          <button
            aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
            onClick={() => setCollapsed((s) => !s)}
            className="p-1 rounded-md hover:bg-slate-900/50 transition"
            title={collapsed ? "Open" : "Collapse"}
          >
            <Menu className="h-5 w-5 text-slate-200" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className="block">
                <div
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 text-slate-950 shadow-lg"
                      : "text-slate-300 hover:text-slate-50 hover:bg-slate-900/70"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-300 ${
                      active ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold text-red-300 transition-all duration-300 hover:bg-red-600/10 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
