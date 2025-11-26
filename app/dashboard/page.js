// /app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Card from "@/components/Card";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let unsub = null;
    let mounted = true;

    async function initAuth() {
      try {
        const firebaseModule = await import("@/firebase");
        const { auth } = firebaseModule;
        const { onAuthStateChanged } = await import("firebase/auth");

        if (!auth || !onAuthStateChanged) {
          console.warn("Firebase auth or onAuthStateChanged not available yet.");
          return;
        }

        unsub = onAuthStateChanged(auth, (u) => {
          if (!mounted) return;
          if (!u) router.push("/login");
          else setUser(u);
        });
      } catch (err) {
        console.error("Failed to initialize auth:", err);
        router.push("/login");
      }
    }

    initAuth();

    return () => {
      mounted = false;
      if (typeof unsub === "function") unsub();
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      const firebaseModule = await import("@/firebase");
      const { auth } = firebaseModule;
      const { signOut } = await import("firebase/auth");
      if (auth) await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const cards = [
    {
      title: "My Events & Trips",
      icon: "CalendarDays",
      description: "View and manage upcoming events, trips, and itinerary.",
      href: "/events",
      color: "bg-indigo-600 text-white",
    },
    {
      title: "Group Voting",
      icon: "Vote",
      description: "Vote on hotels, activities, travel options with friends.",
      href: "/voting",
      color: "bg-white text-indigo-600",
    },
    {
      title: "Expense Split",
      icon: "Wallet2",
      description: "Track, split and settle group expenses and payments.",
      href: "/expenses",
      color: "bg-white text-indigo-600",
    },
    {
      title: "Smart Suggestions",
      icon: "MapPin",
      description: "Get AI-powered itinerary suggestions and packing lists.",
      href: "/ai-suggest",
      color: "bg-white text-indigo-600",
    },
  ];

  // 👇 single source of truth for user name
const name =
  user?.displayName || user?.email?.split("@")[0] || "User";

const uiUser = user
  ? {
      ...user,
      displayName: name,
    }
  : null;

  return (
    <div className="min-h-screen bg-neutral-900 text-slate-100 flex">
      <Sidebar handleLogout={handleLogout} />

      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: "var(--sidebar-width, 256px)" }}
      >
        <Topbar user={uiUser} />

        <main className="p-6">
          <section className="mb-6">
            <h2 className="text-3xl font-semibold">
              Welcome back {uiUser}!
            </h2>
            <p className="text-lg text-slate-400 mt-2 max-w-2xl">
              Plan and manage group trips, vote on options, split expenses & view smart suggestions.
            </p>
          </section>

          <section className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((c) => (
                <Card key={c.title} {...c} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
