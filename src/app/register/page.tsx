"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError("");
    setFieldErrors({});

    const dataRaw = new FormData(e.currentTarget);
    const data = Object.fromEntries(dataRaw);

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.status === 422) {
        setFieldErrors(responseData);
        return;
      }

      if (!res.ok) {
        throw new Error(responseData.error || "Registration failed");
      }

      router.push("/login");
      
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
          <p className="text-neutral-400">Join to our music lovers community</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
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
              required
              id="username"
              name="username"
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
              required
              id="email"
              name="email"
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
              required
              id="password"
              name="password"
              className={`bg-neutral-800 border ${fieldErrors.password ? 'border-red-500' : 'border-neutral-700'} text-white p-3 rounded-lg outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors`}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1 leading-tight">{fieldErrors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-300">
              Confirm Password
            </label>
            <input
              type="password"
              required
              id="confirmPassword"
              name="confirmPassword"
              className={`bg-neutral-800 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-neutral-700'} text-white p-3 rounded-lg outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors`}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline font-medium">
            Sign in
          </Link>
        </p>
        <Link href="/" className="text-white hover:underline font-medium">
            Home
        </Link>
      </div>
    </div>
  );
}