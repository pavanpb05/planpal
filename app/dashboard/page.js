// /app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../src/firebaseAuth"; // NOTE: relative path to src/firebase
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import ProfileCard from "../../components/ProfileCard";
import Card from "../../components/Card";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
      }
      setCheckingAuth(false);
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const cards = [
    {
      title: "My Events & Trips",
      icon: "CalendarDays",
      description: "Plan, view and manage all upcoming trips in one timeline.",
      href: "/events",
    },
    {
      title: "Group Voting",
      icon: "Vote",
      description: "Let friends vote on stays, restaurants and activities.",
      href: "/voting",
    },
    {
      title: "Expense Split",
      icon: "Wallet2",
      description: "Track shared costs and settle up without awkwardness.",
      href: "/expenses",
    },
    {
      title: "Smart Suggestions",
      icon: "MapPin",
      description: "Get AI-powered itineraries, packing lists and ideas.",
      href: "/ai-suggest",
    },
  ];

  const name =
    user?.displayName || user?.email?.split("@")[0] || "Traveller";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex">
      <Sidebar handleLogout={handleLogout} />

      <div className="flex-1 flex flex-col ml-20 lg:ml-64 transition-all duration-300">
        <Topbar user={user} />

        <main className="px-4 py-6 lg:px-10 lg:py-8">
          {/* Glass panel wrapper */}
          <div className="max-w-6xl mx-auto space-y-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl p-5 lg:p-8 transition-all duration-300">
            {checkingAuth ? (
              <div className="h-40 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              </div>
            ) : (
              <>
                {/* Welcome section */}
                <section className="space-y-1">
                  <p className="text-sm uppercase tracking-[0.3em] text-indigo-300/80">
                    Overview
                  </p>
                  <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
                    Welcome back,{" "}
                    <span className="bg-linear-to-r from-indigo-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                      {name}
                    </span>
                    .
                  </h2>
                  <p className="text-sm lg:text-base text-slate-300/80 max-w-xl">
                    Stay on top of your trips, decisions and shared expenses —
                    everything for your group travel in one clean dashboard.
                  </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                  {/* Profile column */}
                  <div className="lg:col-span-1">
                    <ProfileCard user={user} />
                  </div>

                  {/* Feature cards */}
                  <div className="lg:col-span-3 space-y-6">
                    <section className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-50">
                          Quick actions
                        </h3>
                        <span className="text-xs font-medium text-slate-400">
                          Click a card to jump into a feature
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {cards.map((card) => (
                          <Card key={card.title} {...card} />
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
