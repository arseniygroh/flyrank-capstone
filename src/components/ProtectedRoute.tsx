"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function ProtectedRoute({children}: {children: ReactNode}) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/login");
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return <>{children}</>;
}