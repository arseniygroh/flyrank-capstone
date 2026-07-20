"use client";

import { PlaylistsProvider } from "@/context/PlaylistsContext";

export default function Providers({ children }) {
  return <PlaylistsProvider>{children}</PlaylistsProvider>;
}
