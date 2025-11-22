// /components/Topbar.jsx
"use client";

import Image from "next/image";
import { Bell, Search } from "lucide-react";

function getInitials(user) {
  const base = user?.displayName || user?.email?.split("@")[0] || "User";
  const parts = base.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second || first).toUpperCase();
}

export default function Topbar({ user }) {
  const initials = getInitials(user);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-10 lg:py-4">
        {/* Left: title + search */}
        <div className="flex items-center gap-3 lg:gap-5">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Dashboard
            </span>
            <span className="text-base lg:text-lg font-semibold text-slate-50">
              Today&apos;s snapshot
            </span>
          </div>

          <div className="hidden md:flex items-center rounded-2xl bg-slate-900/80 border border-slate-700/80 px-3 py-2 shadow-inner shadow-black/40">
            <Search className="mr-2 h-4 w-4 text-slate-400" />
            <input
              className="bg-transparent text-xs text-slate-200 placeholder:text-slate-500 outline-none w-44 lg:w-64"
              placeholder="Search trips, people, expenses..."
            />
          </div>
        </div>

        {/* Right: notifications + avatar */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button className="relative rounded-full border border-slate-700/80 bg-slate-900/80 p-2 shadow-lg shadow-slate-950/80 transition-all duration-300 hover:border-indigo-400 hover:bg-slate-900">
            <Bell className="h-4 w-4 text-slate-300" />
            <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-linear-to-r from-indigo-500 to-emerald-400 px-1 text-[10px] font-semibold text-slate-950 shadow-md shadow-indigo-900/80">
              3
            </span>
          </button>

          <div className="flex items-center gap-2">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt="avatar"
                width={40}
                height={40}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-400 shadow-lg shadow-indigo-900/80"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 via-sky-400 to-emerald-400 text-[11px] font-semibold text-slate-950 ring-2 ring-indigo-300 shadow-lg shadow-indigo-900/80">
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
