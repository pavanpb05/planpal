// /app/page.js
"use client";
import { useState } from "react";
import { auth } from "../src/firebaseAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleMessage, setGoogleMessage] = useState("");
  const [googleError, setGoogleError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful! Redirecting to dashboard...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      ) {
        setMessage("User account does not exist. Please register.");
      } else if (err.code === "auth/wrong-password") {
        setMessage("Invalid password. Try again.");
      } else {
        setMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleMessage("");
    setGoogleError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setGoogleMessage("Google login successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1600);
    } catch (err) {
      setGoogleError("Google sign-in failed: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setGoogleMessage("");
        setGoogleError("");
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <main className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 shadow-[0_18px_60px_rgba(15,23,42,0.9)] px-6 py-8 space-y-6 text-slate-100">
        <header className="space-y-1 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            PlanPal
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to PlanPal
          </h1>
          <p className="text-sm text-slate-300">
            Login to start planning trips, voting with friends and splitting
            expenses.
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Password
            </label>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((sp) => !sp)}
                className="text-xs font-medium text-slate-300 hover:text-slate-100 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/50 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-linear-to-r from-indigo-500 via-sky-500 to-emerald-400 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-indigo-900/70 transition-all duration-300 hover:shadow-[0_18px_45px_rgba(56,189,248,0.7)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400">
          New user?{" "}
          <a
            href="/register"
            className="text-indigo-300 hover:text-emerald-200 font-medium no-underline"
          >
            Register here
          </a>
        </p>

        {message && (
          <p
            className={`text-sm text-center mt-2 ${
              message.includes("successful") ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-xs text-right text-slate-400">
          <a
            href="/forgot-password"
            className="text-indigo-300 hover:text-emerald-200 font-medium no-underline"
          >
            Forgot password?
          </a>
        </p>

        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-slate-900/80 border border-slate-700 py-2.5 text-sm font-semibold text-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.9)] transition-all duration-300 hover:border-indigo-400 hover:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="shrink-0"
            >
              <g>
                <path
                  fill="#4285F4"
                  d="M12 12v-3.6h8.4c.1.5.1 1.1.1 1.8 0 5.1-3.4 8.7-8.5 8.7-4.9 0-9-4-9-9s4.1-9 9-9c2.7 0 5 .9 6.8 2.7l-2.8 2.7C14.3 5.8 13.2 5.4 12 5.4c-3.5 0-6.4 2.9-6.4 6.4 0 3.5 2.9 6.4 6.4 6.4 2.9 0 5.3-1.8 6-4.1z"
                />
                <path
                  fill="#34A853"
                  d="M3.6 7.5l2.7 2C7 8.8 9.3 6.7 12 6.7c1.2 0 2.3.4 3.2 1.1l2.7-2.7C16.6 3.7 14.6 2.8 12 2.8 7.1 2.8 3.1 6.8 3.1 11.7c0 1 .1 2 .3 2.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M12 21.2c2.6 0 4.7-.9 6.3-2.5l-3.1-2.5c-.8.5-1.7.8-2.7.8-2.2 0-4-1.4-4.7-3.5l-3.1 2.5C4.8 19.3 8.1 21.2 12 21.2z"
                />
                <path
                  fill="#EA4335"
                  d="M21.2 12c0-.8-.1-1.5-.2-2.2H12v3.6h5.6c-.3 1.3-1.2 2.4-2.6 3.1l3.1 2.5C19.9 17.2 21.2 14.8 21.2 12z"
                />
              </g>
            </svg>
            <span>Continue with Google</span>
          </button>

          {googleMessage && (
            <p className="text-sm text-emerald-400 text-center">
              {googleMessage}
            </p>
          )}
          {googleError && (
            <p className="text-sm text-rose-400 text-center">{googleError}</p>
          )}
        </div>
      </main>
    </div>
  );
}
