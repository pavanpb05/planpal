// /app/profile/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../src/firebaseAuth";
import { db } from "../../src/firebaseConfig";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ProfileCard from "@/components/ProfileCard";
import { User, Mail, Phone, Calendar, Compass } from "lucide-react";

function getInitials(user, profile) {
  const base =
    profile?.name ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";
  const parts = base.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second || first).toUpperCase();
}

function ProfileField({ icon: Icon, label, value, multiline = false }) {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-5 py-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-700">
          <Icon className="h-4 w-4 text-slate-300" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          {label}
        </span>
      </div>
      <p className={`text-sm text-slate-100 mt-1 ${multiline ? "leading-relaxed" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);

      try {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
        }
      } catch (err) {
        setProfileError("Could not load full profile. Try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const initials = getInitials(user, profile);
  const displayName =
    profile?.name ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Traveller";

  const email = profile?.email || user?.email || "Not set";
  const phone = profile?.phone || "Not provided";
  const age = profile?.age || "Not provided";
  const interests = profile?.interests || "Tell us what kind of trips you like.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex">
      <Sidebar handleLogout={handleLogout} />

      <div className="flex-1 flex flex-col" style={{ marginLeft: "var(--sidebar-width, 256px)" }}>
        <Topbar user={user} />

        <main className="px-4 py-8 lg:px-12 lg:py-10">
          <div className="max-w-7xl mx-auto rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl px-6 py-6 lg:px-10 lg:py-10 space-y-8">
            {/* Header */}
            <section className="space-y-2">
              <p className="text-sm uppercase tracking-[0.25em] text-indigo-300/60">Profile</p>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Account overview</h1>
              <p className="text-base text-slate-300 max-w-2xl">
                This is your PlanPal identity — used for invites, shared trips, voting and expense sharing.
              </p>
            </section>

            {/* Content */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
                <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 h-56" />
                <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800/80 h-56" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <section>
                  <ProfileCard user={user} />
                </section>

                <section className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-50">Personal details</h3>
                    <span className="text-sm text-slate-400">Synced from your signup information</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField icon={Mail} label="Email" value={email} />
                    <ProfileField icon={Phone} label="Phone" value={phone} />
                    <ProfileField icon={Calendar} label="Age" value={age} />
                    <ProfileField icon={Compass} label="Trip interests" value={interests} multiline />
                  </div>

                  {profileError && (
                    <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded-xl px-3 py-2">
                      {profileError}
                    </p>
                  )}

                  <div className="pt-2">
                    <p className="text-sm text-slate-400">
                      Changes will be editable soon. For now, contact support or update your signup info.
                    </p>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
