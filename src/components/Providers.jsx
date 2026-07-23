"use client";

import { PlaylistsProvider } from "@/context/PlaylistsContext";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <PlaylistsProvider>
          {children}
      </PlaylistsProvider>;
    </AuthProvider>
  )
}
