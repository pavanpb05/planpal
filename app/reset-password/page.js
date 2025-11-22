"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from "../../src/firebaseAuth";
import { confirmPasswordReset } from "firebase/auth";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialOobCode = searchParams.get("oobCode") || "";
  const [oobCode] = useState(initialOobCode);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(initialOobCode ? "" : "Invalid or missing password reset code.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (!code) {
      setError("Invalid or missing password reset code.");
    } else {
      setOobCode(code);
    }
  }, [searchParams]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Password has been reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      setError("Failed to reset password: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Reset Password</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {!message && (
        <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
          <button type="submit" disabled={loading} style={{ padding: "0.75rem", fontSize: "1rem", cursor: "pointer" }}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}
