"use client";
import { useState } from "react";
import { auth } from "../../src/firebaseAuth";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/navigation";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const clearMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Login successful! Redirecting...");
      clearMessages();
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("User account does not exist. Please register.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message);
      }
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      clearMessages();
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Check your inbox.");
      clearMessages();
    } catch (error) {
      setError(error.message);
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   setError("");
  //   setLoading(true);
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     await signInWithPopup(auth, provider);
  //     router.push("/dashboard"); // Redirect them on success
  //   } catch (err) {
  //     setError("Google sign-in failed. " + err.message);
  //     clearMessages();
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div
      style={{
        background: "#fff",
        color: "black",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        maxWidth: "420px",
        padding: "2rem",
        margin: "3rem auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Login</h1>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ padding: "0.75rem", fontSize: "1rem" }}
          disabled={loading}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ flex: 1, padding: "0.75rem", fontSize: "1rem" }}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer", padding: "0.75rem", fontSize: "1rem" }}
            disabled={loading}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button
          type="submit"
          style={{ padding: "0.75rem", fontSize: "1rem", cursor: "pointer", width: "100%" }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* <button
        onClick={handleGoogleLogin}
        style={{ marginTop: "1rem", padding: "0.75rem", fontSize: "1rem", cursor: "pointer" }}
        disabled={loading}
      >
        Sign in with Google
      </button> */}
      <p style={{ marginTop: "1rem", textAlign: "right" }}>
        <button
          onClick={handlePasswordReset}
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline", background: "none", border: "none", padding: 0, font: "inherit" }}
          disabled={loading}
        >
          Forgot Password?
        </button>
      </p>
      {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ color: "green", textAlign: "center", marginTop: "1rem" }}>
          {success}
        </p>
      )}
    </div>
  );
}
