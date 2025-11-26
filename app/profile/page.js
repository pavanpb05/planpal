// /app/profile/page.js
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../../src/firebaseAuth";
import { db, storage } from "../../src/firebaseConfig";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ProfileCard from "@/components/ProfileCard";
import {
  Mail,
  Phone,
  Calendar,
  Compass,
  MapPin,
  UserRound,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { uploadImageToCloudinary } from "@/src/lib/uploadImage";

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
      <p
        className={`text-sm text-slate-100 mt-1 ${
          multiline ? "leading-relaxed" : ""
        }`}
      >
        {value || "Not provided"}
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
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    location: "",
    interests: "",
    bio: "",
    avatarUrl: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  // Load auth + profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);

      try {
        const refDoc = doc(db, "users", u.uid);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          const data = snap.data();
          setProfile(data);
          setForm((prev) => ({
            ...prev,
            name:
              data.name ||
              u.displayName ||
              u.email?.split("@")[0] ||
              "Traveller",
            phone: data.phone || "",
            age: data.age || "",
            location: data.location || "",
            interests: data.interests || "Tell us what kind of trips you like.",
            bio: data.bio || "",
            avatarUrl: data.avatarUrl || "",
          }));
          setAvatarPreview(data.avatarUrl || "");
        } else {
          // fallback if no doc yet
          setForm((prev) => ({
            ...prev,
            name: u.displayName || u.email?.split("@")[0] || "Traveller",
          }));
        }
      } catch (err) {
        console.error(err);
        setProfileError("Could not load full profile. Try again later.");
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

  const email = profile?.email || user?.email || "Not set";
  const phone = profile?.phone || form.phone || "Not provided";
  const age = profile?.age || form.age || "Not provided";
  const interests =
    profile?.interests ||
    form.interests ||
    "Tell us what kind of trips you like.";
  const location = profile?.location || form.location || "";
  const bio = profile?.bio || form.bio || "";

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setFormError("");

    try {
      let avatarUrl = form.avatarUrl || "";

      if (avatarFile) {
      avatarUrl = await uploadImageToCloudinary(
        avatarFile,
        `planpal/avatars/${user.uid}`
      );
    }

       const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      age: form.age.trim(),
      location: form.location.trim(),
      interests: form.interests.trim(),
      bio: form.bio.trim(),
      email: user.email,
      avatarUrl,
      updatedAt: new Date().toISOString(),
    };
      await setDoc(doc(db, "users", user.uid), payload, { merge: true });

    setProfile((prev) => ({ ...(prev || {}), ...payload }));
    setForm((prev) => ({ ...prev, avatarUrl }));
    setAvatarFile(null);
    setIsEditing(false);
  } catch (err) {
    console.error(err);
    setFormError("Could not save changes. Please try again.");
  } finally {
    setSaving(false);
  }
};

const effectiveEmail = profile?.email || user?.email || "";
const effectiveName =
  profile?.name || user?.displayName || effectiveEmail.split("@")[0] || "User";

const effectiveAvatar =
  profile?.avatarUrl || user?.photoURL || "";

// This is what we pass to Topbar + ProfileCard
const uiUser = user
  ? {
      ...user,
      displayName: effectiveName,  // 👈 Topbar will use this
      email: effectiveEmail,       // 👈 Topbar shows this
      photoURL: effectiveAvatar,   // 👈 Topbar avatar
    }
  : null;


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar handleLogout={handleLogout} />

      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: "var(--sidebar-width, 256px)" }}
      >
        <Topbar user={uiUser} />

        <main className="px-4 py-8 lg:px-12 lg:py-10">
          <div className="max-w-7xl mx-auto rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl px-6 py-6 lg:px-10 lg:py-10 space-y-8">
            {/* Header */}
            <section className="space-y-2">
              <p className="text-sm uppercase tracking-[0.25em] text-indigo-300/60">
                Profile
              </p>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
                Account overview
              </h1>
              <p className="text-base text-slate-300 max-w-2xl">
                This is your PlanPal identity — used for invites, shared trips,
                voting and expense sharing.
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
                {/* Left profile card (existing component) */}
                <section>
                  <ProfileCard user={uiUser} profile={profile} />
                </section>

                {/* Right side – details + edit */}
                <section className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-slate-50">
                        Personal details
                      </h3>
                      <span className="text-sm text-slate-400">
                        Synced from your signup information and profile edits.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-indigo-400 hover:shadow-lg active:scale-[0.98] transition-all"
                    >
                      <UserRound className="h-4 w-4" />
                      Edit profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField icon={Mail} label="Email" value={email} />
                    <ProfileField icon={Phone} label="Phone" value={phone} />
                    <ProfileField icon={Calendar} label="Age" value={age} />
                    <ProfileField
                      icon={Compass}
                      label="Trip interests"
                      value={interests}
                      multiline
                    />
                    <ProfileField
                      icon={MapPin}
                      label="Location"
                      value={location}
                    />
                    <ProfileField
                      icon={FileText}
                      label="Short bio"
                      value={bio}
                      multiline
                    />
                  </div>

                  {profileError && (
                    <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded-xl px-3 py-2">
                      {profileError}
                    </p>
                  )}
                </section>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Profile Slide-over */}
      {isEditing && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => !saving && setIsEditing(false)}
          />

          {/* Panel */}
          <div className="w-full max-w-md bg-slate-950 border-l border-slate-800 px-6 py-6 lg:px-7 lg:py-7 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Edit profile</h2>
                <p className="text-xs text-slate-400">
                  Update your basic details and trip preferences.
                </p>
              </div>
              <button
                className="p-1 rounded-full hover:bg-slate-800 transition"
                onClick={() => !saving && setIsEditing(false)}
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            {/* Avatar upload */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 p-[2px]">
                <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-slate-100">
                      {form.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800 transition"
                >
                  <Upload className="h-3 w-3" />
                  Change photo
                </button>
                <span className="text-[11px] text-slate-500">
                  JPG or PNG, up to 2 MB.
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="How should we address you?"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add a contact number"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Age
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    value={form.age}
                    onChange={handleChange("age")}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your age"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={handleChange("location")}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Trip interests
                </label>
                <textarea
                  rows={3}
                  value={form.interests}
                  onChange={handleChange("interests")}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Beach trips, mountains, city breaks, road trips..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Short bio
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={handleChange("bio")}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Tell your friends how you like to travel."
                />
              </div>

              {formError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded-lg px-2 py-1.5">
                  {formError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setIsEditing(false)}
                  className="rounded-full px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-400 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {saving && (
                    <span className="h-3 w-3 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                  )}
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
