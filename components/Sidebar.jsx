// /components/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Power, Menu } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
];

const SIDEBAR_WIDTH_EXPANDED = "256px";
const SIDEBAR_WIDTH_COLLAPSED = "72px";

export default function Sidebar({ handleLogout }) {
  const pathname = usePathname();

  // Start expanded to match server render; apply saved pref after mount to avoid hydration mismatch.
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem("sidebar-collapsed") === "true";
      setCollapsed(saved);
      document.documentElement.style.setProperty(
        "--sidebar-width",
        saved ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED
      );
    } catch {
      document.documentElement.style.setProperty("--sidebar-width", SIDEBAR_WIDTH_EXPANDED);
    }
  }, []);

  useEffect(() => {
    // keep CSS var in sync
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED
    );
  }, [collapsed]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("sidebar-collapsed", next ? "true" : "false");
        } catch {}
      }
      return next;
    });
  };

  return (
    <aside
      aria-label="Primary"
      className="fixed inset-y-0 left-0 z-30 flex flex-col
        bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900
        shadow-[0_18px_70px_rgba(15,23,42,0.95)]
        border-r border-slate-800/80 transition-all duration-300"
      style={{ width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED }}
    >
      <div className="flex h-full flex-col items-center px-2 py-4">
        {/* TOP: PlanPal mark (always visible) */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div
            className={`h-12 w-12 rounded-2xl shadow-lg flex items-center justify-center transition ${
              collapsed ? "bg-indigo-500" : "bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400"
            }`}
          >
            {/* show single-letter mark when collapsed, full mark when expanded */}
            <span className="text-sm font-bold text-slate-900 select-none">
              {collapsed ? "P" : "PP"}
            </span>
          </div>

          {/* when expanded show the brand text, hidden when collapsed */}
          {!collapsed && (
            <div className="w-full text-center">
              <span className="text-sm font-semibold tracking-[0.12em] text-slate-50 uppercase select-none">
                PlanPal
              </span>
            </div>
          )}
        </div>

        {/* Put the menu toggle directly under the top mark — visually aligned when collapsed */}
        <button
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Open sidebar" : "Collapse sidebar"}
          onClick={toggleCollapsed}
          className={`mt-3 mb-2 inline-flex items-center justify-center rounded-xl transition ${
            collapsed ? "h-12 w-12 bg-slate-800/60 p-0" : "px-3 py-2 text-slate-200 hover:bg-slate-900/50"
          }`}
        >
          <Menu className={`h-5 w-5 ${collapsed ? "text-slate-50" : "text-slate-50"}`} />
        </button>

        {/* NAV (icons vertically stacked). use compact circular buttons when collapsed */}
        <nav className="flex-1 mt-4 w-full flex flex-col items-center gap-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            if (collapsed) {
              return (
                <Link key={href} href={href}>
                  <button
                    title={label}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-center h-12 w-12 rounded-xl transition shadow-sm
                      ${active ? "bg-indigo-600 ring-2 ring-indigo-400 text-white" : "bg-slate-900/60 text-slate-200 hover:bg-slate-900/80"}`}
                  >
                    {/* Home icon should be white constant across project when collapsed */}
                    <Icon className={`h-5 w-5 ${href === "/dashboard" ? "text-white" : ""}`} />
                  </button>
                </Link>
              );
            }

            // Expanded state: show labeled nav items (white text)
            return (
              <Link
                key={href}
                href={href}
                className={`w-full`}
              >
                <div
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200
                    ${active ? "bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 text-slate-900 shadow-sm" : "text-slate-50 hover:bg-slate-900/70"}`}
                >
                  <Icon className={`h-5 w-5 ${href === "/dashboard" ? "text-white" : ""}`} />
                  <span className="truncate text-slate-50">{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM: logout as circular power button when collapsed, full label when expanded */}
        <div className="mt-auto mb-3 w-full flex items-center justify-center">
          {collapsed ? (
            <button
              onClick={handleLogout}
              title="Log out"
              className="h-12 w-12 rounded-xl bg-slate-900/60 flex items-center justify-center transition hover:bg-red-600/10"
            >
              <Power className="h-5 w-5 text-red-400" />
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full rounded-2xl px-3 py-2.5 text-xs font-semibold text-slate-50 transition-all duration-200 hover:bg-red-600/10"
            >
              <Power className="h-4 w-4 text-red-400" />
              <span>Log out</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
