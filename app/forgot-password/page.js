// /app/forgot-password/page.js
"use client";
import { useState } from "react";
import { auth } from "../../src/firebaseAuth";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setError("Failed to send reset email. " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <main className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 shadow-[0_18px_60px_rgba(15,23,42,0.9)] px-6 py-8 space-y-6 text-slate-100">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Security
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-slate-300">
            Enter the email linked to your PlanPal account. We&apos;ll send you
            a secure reset link.
          </p>
        </header>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              required
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-linear-to-r from-indigo-500 via-sky-500 to-emerald-400 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-indigo-900/70 transition-all duration-300 hover:shadow-[0_18px_45px_rgba(56,189,248,0.7)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending reset link..." : "Send reset email"}
          </button>
        </form>

        {message && (
          <p className="text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-500/40 rounded-xl px-3 py-2">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <p className="text-xs text-center text-slate-400">
          Remembered it?{" "}
          <a
            href="/login"
            className="font-medium text-indigo-300 hover:text-emerald-200 no-underline"
          >
            Go back to login
          </a>
        </p>
      </main>
    </div>
  );
}
