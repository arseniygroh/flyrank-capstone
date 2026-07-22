"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PlaylistList from "@/components/PlaylistList";
import Player from "@/components/Player";
import { usePlaylists } from "@/context/PlaylistsContext";
import { useAuth } from "@/context/AuthContext";

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
  const { user, logout, isHydrated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="flex w-full md:w-64 shrink-0 flex-col border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950 p-4 md:p-6 max-h-[40vh] md:max-h-none">
          <nav className="flex flex-row md:flex-col gap-4 pb-2 md:pb-0">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/playlist/new">New playlist</NavLink>
          </nav>
          <div className="flex-1 overflow-y-auto min-h-[100px]">
            {hydrated ? (
              <PlaylistList />
            ) : (
              <p className="text-sm text-neutral-500">Loading playlists…</p>
            )}
          </div>

          <div className="mt-auto border-t border-neutral-800 shrink-0">
            {!isHydrated ? (
              <div className="h-10 w-full animate-pulse bg-neutral-800 rounded-md" />
            ) : user ? (
              <div className="flex flex-col gap-1">
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">
                  Account
                </span>
                <span className="text-sm font-bold text-white truncate">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-left text-sm font-semibold text-neutral-400 hover:text-red-400 transition-colors mt-2"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/register"
                  className="bg-white text-black text-sm text-center py-2 rounded-full font-bold hover:bg-neutral-200 transition-colors"
                >
                  Sign up
                </Link>
                <Link
                  href="/login"
                  className="text-white text-sm text-center py-2 rounded-full font-bold hover:bg-neutral-800 transition-colors"
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </aside>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
      <Player track={currentTrack} />
    </div>
  );
}
