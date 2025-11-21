"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../src/firebaseAuth";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem", fontFamily: "Arial,sans-serif", textAlign: "center" }}>
      <h1>Dashboard</h1>
      <p>Welcome! You are logged in.</p>
      {/* Future: Add voting, maps, other features here */}
    </div>
  );
}
