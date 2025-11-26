// /components/ProfileCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";

function getInitials(user) {
  const base = user?.displayName || user?.email?.split("@")[0] || "User";
  const parts = base.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second || first).toUpperCase();
}

export default function ProfileCard({ user }) {
  const initials = getInitials(user);
  const name =
    user?.displayName || user?.email?.split("@")[0] || "Traveller";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 px-5 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)] transition-all duration-300">
      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative flex flex-col items-center text-center gap-3">
        {/* Avatar */}
        {user?.photoURL ? (
          <Image
            src={user.photoURL}
            alt="avatar"
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-indigo-400 shadow-xl shadow-indigo-900/70"
            priority
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 via-sky-400 to-emerald-400 text-lg font-semibold text-slate-950 ring-2 ring-indigo-300 shadow-xl shadow-indigo-900/70">
            {initials}
          </div>
        )}

        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-slate-50">
            {name}
          </h3>
          <p className="text-xs text-slate-300/80">
            {user?.email || "No email available"}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-slate-400/90 max-w-xs">
          This profile powers your trip invites, group voting and expense
          sharing — keep it up to date.
        </p>
      </div>
    </div>
  );
}
