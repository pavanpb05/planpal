// components/ProfileCard.jsx
"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";

function getInitials(nameOrEmail) {
  const base = nameOrEmail || "User";
  const parts = base.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second || first).toUpperCase();
}

export default function ProfileCard({ user, profile, onEdit }) {
  const displayName =
    profile?.name ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Traveller";

  const email = profile?.email || user?.email || "No email available";

  // 👇 avatar prefers profile.avatarUrl, then user.photoURL
  const avatarUrl = profile?.avatarUrl || user?.photoURL || "";
  const initials = getInitials(displayName || email);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 px-5 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.9)] transition-all duration-300">
      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative flex flex-col items-center text-center gap-3">
        {/* Avatar */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="avatar"
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-indigo-400 shadow-xl shadow-indigo-900/70"
            priority
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-r from-indigo-500 via-sky-400 to-emerald-400 text-lg font-semibold text-slate-950 ring-2 ring-indigo-300 shadow-xl shadow-indigo-900/70">
            {initials}
          </div>
        )}

        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-slate-50">
            {displayName}
          </h3>
          <p className="text-xs text-slate-300/80">{email}</p>
        </div>

        {/* <button
          type="button"
          onClick={onEdit}
          className="mt-2 inline-flex items-center gap-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-indigo-900/70 transition-all duration-300 hover:shadow-[0_18px_45px_rgba(56,189,248,0.7)] hover:-translate-y-0.5"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit profile
        </button> */}

        <p className="mt-3 text-[11px] text-slate-400/90 max-w-xs">
          This profile powers your trip invites, group voting and expense
          sharing — keep it up to date.
        </p>
      </div>
    </div>
  );
}
