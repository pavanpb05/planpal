// components/TripPhotosSection.jsx
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
// Use your canonical firebase export path — commonly "@/firebase"
import { db } from "@/firebase";
import { uploadImageToCloudinary } from "@/lib/uploadImage";
import { ImagePlus, Loader2 } from "lucide-react";

/**
 * Props:
 *  - tripId: string
 *  - user: FirebaseUser (current logged in user)
 *  - readOnly?: boolean (optional – for profile gallery views)
 */
export default function TripPhotosSection({ tripId, user, readOnly = false }) {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Load photos for this trip
  useEffect(() => {
    if (!tripId) return;

    const q = query(
      collection(db, "trips", tripId, "photos"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPhotos(list);
    }, (err) => {
      console.error("Trip photos snapshot error:", err);
      setError("Failed to load trip photos.");
    });

    return () => unsub();
  }, [tripId]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !user) return;

    setError("");
    setUploading(true);

    try {
      for (const file of files) {
        // 1) Upload to Cloudinary via your server API
        const url = await uploadImageToCloudinary(file, `planpal/trips/${tripId}`);

        // 2) Save metadata in Firestore
        await addDoc(collection(db, "trips", tripId, "photos"), {
          url,
          caption: "",
          locationName: "",
          uploadedBy: user.uid,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Trip photo upload error:", err);
      // surface more helpful message if available
      setError(err?.message || "Failed to upload one or more photos.");
    } finally {
      setUploading(false);
      // reset input
      try {
        e.target.value = "";
      } catch {}
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">
            Trip photos
          </h3>
          <p className="text-xs text-slate-400">
            Everyone in this trip can see and add photos.
          </p>
        </div>

        {!readOnly && (
          <label className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800 cursor-pointer transition">
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImagePlus className="h-3.5 w-3.5" />
                Add photos
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded-lg px-2 py-1.5">
          {error}
        </p>
      )}

      {photos.length === 0 ? (
        <p className="text-xs text-slate-500">
          No photos yet. Be the first to add one!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative overflow-hidden rounded-xl border border-slate-800/70 bg-slate-900/70 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption || "Trip photo"}
                className="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
