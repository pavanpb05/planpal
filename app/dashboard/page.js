// /app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar.jsx";
import Card from "@/components/Card";

// Firestore for profile
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/firebaseConfig";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  // 🔹 Auth listener (same as before)
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

  // 🔹 Load profile from Firestore once we know the user
  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
        }
      } catch (err) {
        console.error("Failed to load dashboard profile:", err);
      }
    }

    loadProfile();
  }, [user]);

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

  // 🔹 Same logic as profile page: choose best name/email
  const effectiveEmail = profile?.email || user?.email || "";
  const effectiveName =
    profile?.name ||
    user?.displayName ||
    (effectiveEmail ? effectiveEmail.split("@")[0] : "User");

  // 🔹 uiUser is what Topbar sees (name + email consistent with profile)
  const uiUser = user
    ? {
        ...user,
        displayName: effectiveName,
        email: effectiveEmail,
        photoURL: profile?.avatarUrl || user?.photoURL || "",
      }
    : null;

  return (
    <div className="min-h-screen bg-neutral-900 text-slate-100 flex">
      <Sidebar handleLogout={handleLogout} />

      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: "var(--sidebar-width, 256px)" }}
      >
        <Topbar  user={uiUser}/>

        <main className="p-6">
          <section className="mb-6">
            <h2 className="text-3xl font-semibold">
              Welcome back {effectiveName}!
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
