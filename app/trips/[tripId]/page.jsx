// app/trips/[tripId]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/src/firebaseAuth";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import TripPhotoSection from "@/components/TripPhotoSection";

export default function TripPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params?.tripId;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
      }
    });
    return () => unsub();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar handleLogout={async () => { await auth.signOut(); router.push("/login"); }} />

      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: "var(--sidebar-width, 256px)" }}
      >
        <Topbar user={user} />

        <main className="px-4 py-8 lg:px-12 lg:py-10">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Trip Header placeholder */}
            <section className="rounded-3xl bg-slate-900/70 border border-slate-800/80 px-6 py-5">
              <h1 className="text-2xl font-semibold tracking-tight">
                Trip: {tripId}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Replace this with real trip info (name, dates, destination).
              </p>
            </section>

            {/* Photos */}
            <section className="rounded-3xl bg-slate-900/70 border border-slate-800/80 px-6 py-5">
              <TripPhotoSection tripId={tripId} user={user} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
