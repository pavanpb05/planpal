// /components/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ handleLogout }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-20 lg:w-64 border-r border-slate-800/80 bg-linear-to-b from-slate-950 via-slate-950 to-slate-900 shadow-[0_18px_70px_rgba(15,23,42,0.95)]">
      <div className="flex h-full flex-col px-3 py-6">
        {/* Logo */}
        <div className="mb-10 flex items-center justify-center lg:justify-start lg:px-2">
          <div className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-linear-to-br from-indigo-500 via-sky-400 to-emerald-400 shadow-lg shadow-indigo-900/80" />
            <span className="hidden lg:inline text-sm font-semibold tracking-[0.25em] text-slate-100 uppercase">
              PlanPal
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}>
                <div
                  className={`group flex items-center gap-3 rounded-2xl px-2 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
                    active
                      ? "bg-linear-to-r from-indigo-500 via-sky-500 to-emerald-400 text-slate-950 shadow-lg shadow-indigo-900/70"
                      : "text-slate-300 hover:text-slate-50 hover:bg-slate-900/70"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-300 ${
                      active ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="hidden lg:inline truncate">{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center justify-center lg:justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/80 px-2 py-2.5 text-xs font-semibold text-red-300 shadow-[0_10px_30px_rgba(15,23,42,0.9)] transition-all duration-300 hover:border-red-500/80 hover:bg-red-500/10 hover:text-red-200"
        >
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:inline">Log out</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
