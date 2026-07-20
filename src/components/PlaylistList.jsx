"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlaylists } from "@/context/PlaylistsContext";

export default function PlaylistList() {
    const { playlists } = usePlaylists();
    const pathname = usePathname();
    return (
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Your Playlists
          </h2>
          <ul className="flex flex-col gap-3 overflow-y-auto">
            {playlists.length === 0 && (
              <li className="text-sm text-neutral-500">No playlists yet.</li>
            )}
            {playlists.map((p) => {
              const href = `/playlist/${p.id}`;
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={p.id}>
                  <Link 
                    href={href}
                    className={`block text-sm font-medium transition-colors text-left w-full truncate cursor-pointer ${
                      isActive ? "text-white" : "text-neutral-300 hover:text-white"
                    }`}
                  >
                    {p.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
    )
}