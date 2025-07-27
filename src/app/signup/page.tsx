"use client";

import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSignup = async () => {
    setStatus("⏳ Summoning your account...");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      setStatus("✅ Account conjured. Check your email!");
      if (err instanceof Error) {
    setStatus(`❌ ${err.message}`);
  } else {
    setStatus("❌ Something went wrong.");
  }

  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 px-4 py-2 rounded bg-zinc-900 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-md"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 px-4 py-2 rounded bg-zinc-900 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-md"
      />

      <button
        onClick={handleSignup}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-semibold transition w-full max-w-md"
      >
        Create Account
      </button>

      {status && <p className="mt-4 text-sm text-zinc-400">{status}</p>}
    </div>
  );

}
