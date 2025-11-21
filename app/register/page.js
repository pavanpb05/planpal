"use client";
import { useState } from "react";
import { auth } from "../../src/firebaseAuth";
import { db } from "../../src/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [googleMessage, setGoogleMessage] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setEmailExists(false);

    if (!email || !password || !name || !phone || !age || !interests || !termsAccepted) {
      setError("Please fill all required fields and accept terms.");
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user profile data in Firestore ('users/{uid}')
      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        age,
        interests,
        email: user.email,
        createdAt: new Date().toISOString(),
        verified: false
      });

      // Send verification email
      await sendEmailVerification(user);

      setSuccess("Registration successful! Verification email sent. Redirecting to login...");

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setEmailExists(true);
        setError("Email already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak, must be at least 6 characters.");
      } else if (err.code === "permission-denied") {
        setError("Missing or insufficient permissions.");
      } else {
        setError(err.message);
      }
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
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        maxWidth: "500px",
        padding: "2rem",
        margin: "3rem auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Register for PlanPal</h1>
      <form
        onSubmit={handleRegister}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
          style={{ padding: "0.75rem", fontSize: "1rem" }}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
          style={{ padding: "0.75rem", fontSize: "1rem" }}
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          required
          min="1"
          style={{ padding: "0.75rem", fontSize: "1rem" }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ padding: "0.75rem", fontSize: "1rem" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            required
            style={{ flex: 1, padding: "0.75rem", fontSize: "1rem" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer", padding: "0.75rem", fontSize: "1rem" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <textarea
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Tell us your interests (comma separated)"
          required
          style={{ resize: "vertical", padding: "0.75rem", fontSize: "1rem" }}
        />
        <label style={{ marginBottom: "0.5rem" }}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            style={{ marginRight: "6px" }}
          />
          I agree to the Terms and Conditions
        </label>
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Register
        </button>
      </form>

      {/* Error message */}
      {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
          {error}
          {emailExists && (
            <span>
              {" "}
              — Already have an account?{" "}
              <a href="/login" style={{ color: "blue", textDecoration: "underline" }}>
                Login here
              </a>
            </span>
          )}
        </p>
      )}
      {/* Success message */}
      {success && (
        <p style={{ color: "green", textAlign: "center", marginTop: "1rem" }}>
          {success}
        </p>
      )}

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          margin: "1rem 0",
          width: "100%",
          padding: "0.75rem",
          background: "linear-gradient(90deg,#4285F4 30%,#34A853 70%)",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1rem",
          border: "none",
          borderRadius: "6px",
          boxShadow: "0 4px 12px rgba(66,133,244,0.13)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          cursor: "pointer",
          transition: "transform 0.18s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{ flexShrink: 0 }}
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
        <p style={{ color: "green", textAlign: "center", marginTop: "1rem" }}>
          {googleMessage}
        </p>
      )}
      {googleError && (
        <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
          {googleError}
        </p>
      )}

    </div>
  );
}
