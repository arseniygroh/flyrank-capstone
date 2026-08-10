"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PlaylistForm from "@/components/PlaylistForm";
import { usePlaylists } from "@/context/PlaylistsContext";


import type { Playlist, PlaylistFormData } from "@/types/playlist";

export default function EditPlaylistPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const router = useRouter();
  const { hydrated, getPlaylist, updatePlaylist } = usePlaylists();

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
        Loading playlist…
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Playlist not found</h1>
        <Link
          href="/"
          className="rounded-full bg-neutral-800 px-6 py-2 font-semibold hover:bg-neutral-700 transition-colors"
        >
          Back to home
        </Link>
      </div>
    );
  }

  function handleSubmit(formData: PlaylistFormData) {
    if (!playlist) return;
    updatePlaylist({ ...playlist, ...formData });
    router.push(`/playlist/${playlist.id}`);
  }

  function handleCancel() {
    if (!playlist) return;
    router.push(`/playlist/${playlist.id}`);
  }

  return (
    <div className="flex min-h-full items-start justify-center p-6 xl:p-10">
      <div className="w-full max-w-lg">
        <h1 className="mb-8 text-3xl font-bold text-white">Edit playlist</h1>
        <PlaylistForm
          initialData={playlist}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
