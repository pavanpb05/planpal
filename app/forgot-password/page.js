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
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Forgot Password</h1>
      <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          style={{ padding: "0.75rem", fontSize: "1rem" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "0.75rem", fontSize: "1rem", cursor: "pointer" }}>
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
      </form>
      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}
