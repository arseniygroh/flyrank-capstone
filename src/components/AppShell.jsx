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
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="flex w-full md:w-64 shrink-0 flex-col border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950 p-4 md:p-6 max-h-[40vh] md:max-h-none">
          <nav className="mb-4 md:mb-6 flex flex-row md:flex-col gap-4 overflow-x-auto pb-2 md:pb-0">
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
