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
    <div className="w-full h-72 md:h-96 my-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-neutral-500">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p className="text-sm font-medium">Loading 3D Experience...</p>
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
    isPaused
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
      <div className="p-6 text-neutral-400 xl:p-10 flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
           <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
           Loading playlist…
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Playlist not found</h1>
        <p className="text-neutral-400">
          It may have been deleted, is private, or the link is incorrect.
        </p>
        <Link
          href="/"
          className="rounded-full bg-neutral-800 px-6 py-2 font-semibold hover:bg-neutral-700 transition-colors"
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
    <div className="flex flex-col w-full">
      <CassetteScene 
        playlistName={playlist.name} 
        isPlaying={!isPaused}
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
