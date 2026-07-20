"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PlaylistList from "@/components/PlaylistList";
import Player from "@/components/Player";
import { usePlaylists } from "@/context/PlaylistsContext";

function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`text-sm font-semibold transition-colors ${
        isActive
          ? "text-white"
          : "text-neutral-400 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export default function AppShell({ children }) {
  const { currentTrack, hydrated } = usePlaylists();

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 p-6">
          <nav className="mb-6 flex flex-col gap-3">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/playlist/new">New playlist</NavLink>
          </nav>
          {hydrated ? (
            <PlaylistList />
          ) : (
            <p className="text-sm text-neutral-500">Loading playlists…</p>
          )}
        </aside>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
      <Player track={currentTrack} />
    </div>
  );
}
