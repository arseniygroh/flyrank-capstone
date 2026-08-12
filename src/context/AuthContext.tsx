"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, exprirationDate: Date, user: User) => void;
  logout: () => void;
  isHydrated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expiration");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const scheduleAutoLogout = (expirationDate: Date) => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    const msExpiry = expirationDate.getTime() - Date.now();

    if (msExpiry <= 0) {
      logout();
      return;
    }

    logoutTimerRef.current = setTimeout(logout, msExpiry);
  };

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedExpiration = localStorage.getItem("expiration");

      if (storedToken && storedUser && storedExpiration) {
        const expirationDate = new Date(storedExpiration);

        if (expirationDate.getTime() <= Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("expiration");
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          scheduleAutoLogout(expirationDate);
        }
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("expiration");
    } finally {
      setIsHydrated(true);
    }

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  const login = (newToken: string, exprirationDate: Date, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("expiration", exprirationDate.toISOString());
    setToken(newToken);
    setUser(newUser);
    scheduleAutoLogout(exprirationDate);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isHydrated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}