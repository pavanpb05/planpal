// /components/Card.jsx
"use client";

import { CalendarDays, Wallet2, MapPin, Vote } from "lucide-react";

const icons = {
  CalendarDays,
  Wallet2,
  MapPin,
  Vote,
};

export default function Card({
  title,
  description,
  icon = "Vote",
  href = "#",
}) {
  const Icon = icons[icon] || icons["Vote"];

  return (
      <a
      href={href}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-800/80 bg-linear-to-br from-slate-900/70 via-slate-900/40 to-slate-900/70 px-5 py-4 text-slate-50 shadow-[0_14px_40px_rgba(15,23,42,0.8)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-indigo-500/80 hover:shadow-[0_22px_70px_rgba(37,99,235,0.6)] no-underline decoration-transparent"
    >
      {/* subtle glow */}

      <div className="pointer-events-none absolute inset-px rounded-2xl bg-linear-to-br from-indigo-500/15 via-transparent to-emerald-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex flex-col gap-3">
        <div className="inline-flex items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-sky-500 to-emerald-400 p-2 shadow-lg shadow-indigo-900/70 transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-5 w-5 text-slate-50" />
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-semibold tracking-tight text-slate-50 no-underline decoration-transparent">
            {title}
          </h4>
          <p className="text-xs text-slate-300/80 leading-relaxed no-underline decoration-transparent">
            {description}
          </p>
        </div>

        <span className="mt-1 inline-flex items-center text-[11px] font-medium text-indigo-300 group-hover:text-emerald-200 no-underline decoration-transparent">
          Open
          <span className="ml-1 translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </a>
  );
}
