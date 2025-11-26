// components/Topbar.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Search } from "lucide-react";

function getInitial(nameOrEmail) {
  if (!nameOrEmail) return "U";
  const base = nameOrEmail.trim();
  return base[0]?.toUpperCase() || "U";
}

export default function Topbar({ user }) {
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "User";

  const avatarUrl = user?.photoURL || "";
  const initial = getInitial(displayName || user?.email);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 lg:px-8">
      {/* LEFT */}
      <div className="flex flex-col">
        <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
          Dashboard
        </span>
        <h2 className="text-base font-semibold text-slate-50">
          Today&apos;s snapshot
        </h2>
      </div>

      {/* CENTER: search */}
      <div className="hidden md:flex flex-1 items-center justify-center px-6">
        <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search trips, people, expenses..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* RIGHT: bell + user chip */}
      <div className="flex items-center gap-4">
        {/* <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 transition">
          <Bell className="h-4 w-4 text-slate-200" />
        </button> */}

        {/* User chip → /profile */}
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-full border border-transparent px-2 py-1 hover:border-slate-700 hover:bg-slate-900/80 transition"
        >
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-medium text-slate-100">
              {displayName}
            </span>
            <span className="text-[11px] text-slate-400">
              {user?.email || ""}
            </span>
          </div>

          <div className="h-9 w-9 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="User avatar"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-slate-100">
                {initial}
              </span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
