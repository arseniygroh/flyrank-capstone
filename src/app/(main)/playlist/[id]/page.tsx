"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PlaylistComponent from "@/components/Playlist";
import { usePlaylists } from "@/context/PlaylistsContext";
import type { Playlist } from "@/types/playlist";
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const CassetteScene = dynamic(() => import('@/components/CassetteScene'), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-label="Loading 3D experience"
      className="w-full aspect-square max-h-[min(72vw,320px)] sm:max-h-none sm:aspect-[4/3] md:aspect-video sm:h-72 md:h-96 my-4 sm:my-8 mx-4 sm:mx-auto max-w-md rounded-2xl sm:rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-neutral-500"
    >
      <Loader2 className="w-8 h-8 animate-spin mb-4" aria-hidden="true" />
      <p className="text-sm font-medium px-4 text-center">Loading 3D Experience...</p>
    </div>
  )
});

export default function PlaylistDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const router = useRouter();

  const {
    hydrated,
    getPlaylist,
    updatePlaylist,
    deletePlaylist,
    setCurrentTrack,
    isPaused,
    currentTrack
  } = usePlaylists();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hydrated || !id) return;

    async function loadPlaylist() {
      setIsLoading(true);
      const foundPlaylist = await getPlaylist(id as string);
      setPlaylist(foundPlaylist || null);
      setIsLoading(false);
    }

    loadPlaylist();
  }, [id, hydrated, getPlaylist]);

  if (!hydrated || isLoading) {
    return (
      <div className="p-4 sm:p-6 xl:p-10 text-neutral-400 flex items-center justify-center min-h-[40vh]">
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <div
            className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          Loading playlist…
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4 sm:p-6 text-center">
        <h1 className="text-xl sm:text-2xl font-bold">Playlist not found</h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-sm">
          It may have been deleted, is private, or the link is incorrect.
        </p>
        <Link
          href="/"
          className="rounded-full bg-neutral-800 px-6 py-2.5 text-sm sm:text-base font-semibold hover:bg-neutral-700 transition-colors"
        >
          Back to home
        </Link>
      </div>
    );
  }

  function handleDelete() {
    if (!playlist) return;
    if (!window.confirm(`Delete "${playlist.name}"?`)) return;
    deletePlaylist(playlist.id);
    router.push("/");
  }

  function handleEdit() {
    if (!playlist) return;
    router.push(`/playlist/${playlist.id}/edit`);
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-4 sm:pb-8">
      <CassetteScene
        isPlaying={!!currentTrack && !isPaused}
      />
      <PlaylistComponent
        playlist={playlist}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onUpdate={updatePlaylist}
        onPlay={setCurrentTrack}
      />
    </div>
  );
}
