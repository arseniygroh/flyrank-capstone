"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { API_URL } from "@/context/PlaylistsContext";
import StatefulButton from "@/components/StatefulButton";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Login failed");
      }
      
      login(resData.token, new Date(resData.exprirationDate), {
        email: resData.email,
        username: resData.username,
        id: resData.id,
      });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-neutral-400">Sign in to get better experience</p>
        </div>
        
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-neutral-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-white p-3 rounded-lg outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
              placeholder="name@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-neutral-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-white p-3 rounded-lg outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          <StatefulButton onClick={handleLogin} idleText="Login" />
        </div>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-white hover:underline font-medium">
            Sign up
          </Link>
        </p>
        <Link href="/" className="text-white text-center hover:underline font-medium block mt-2">
            Home
        </Link>
      </div>
    </div>
  );
}