// /components/Topbar.jsx
"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

export default function Topbar({ user }) {
  return (
    <header className="w-full border-b border-slate-800/70">
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="flex items-center gap-6">
          <div className="text-sm uppercase tracking-[0.15em] text-indigo-300/70">Dashboard</div>

          <div className="relative">
            <input
              placeholder="Search trips, people, expenses..."
              className="rounded-full bg-slate-900/60 placeholder:text-slate-400 px-4 py-2 w-[520px] text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-xl bg-slate-800/60 px-3 py-2 text-slate-50 hover:bg-slate-900/70 transition">
            <Bell className="h-5 w-5" />
          </button>

          <Link
            href="/profile"
            className="relative inline-flex items-center justify-center rounded-full focus:outline-none"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-400 shadow-md"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 flex items-center justify-center text-sm font-semibold text-slate-900">
                {user?.displayName
                  ? user.displayName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
                  : user?.email
                  ? user.email.split("@")[0].slice(0, 2).toUpperCase()
                  : "U"}
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
