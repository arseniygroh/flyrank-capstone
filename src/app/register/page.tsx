"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { API_URL } from "@/context/PlaylistsContext";
import StatefulButton from "@/components/StatefulButton";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleRegister() {
    setServerError("");
    setFieldErrors({});

    const data = { username, email, password, confirmPassword };

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.status === 422) {
        setFieldErrors(responseData);
        throw new Error("Validation failed");
      }

      if (!res.ok) {
        throw new Error(responseData.error || "Registration failed");
      }

      router.push("/login");
      
    } catch (err: any) {
      if (err.message !== "Validation failed") {
        setServerError(err.message);
      }
      throw err;
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
          <p className="text-neutral-400">Join to our music lovers community</p>
        </div>
        <div className="flex flex-col gap-4">  
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
              {serverError}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm font-medium text-neutral-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`bg-neutral-800 border ${fieldErrors.username ? 'border-red-500' : 'border-neutral-700'} text-white p-3 rounded-lg outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors`}
              placeholder="cooluser123"
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-neutral-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`bg-neutral-800 border ${fieldErrors.email ? 'border-red-500' : 'border-neutral-700'} text-white p-3 rounded-lg outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors`}
              placeholder="name@example.com"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-neutral-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`bg-neutral-800 border ${fieldErrors.password ? 'border-red-500' : 'border-neutral-700'} text-white p-3 rounded-lg outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1 leading-tight">{fieldErrors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 mb-4">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-300">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`bg-neutral-800 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-neutral-700'} text-white p-3 rounded-lg outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors`}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>
          <StatefulButton onClick={handleRegister} idleText="Sign up" />
        </div>
        <p className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline font-medium">
            Sign in
          </Link>
        </p>
        <Link href="/" className="text-white text-center hover:underline font-medium block mt-2">
            Home
        </Link>
      </div>
    </div>
  );
}