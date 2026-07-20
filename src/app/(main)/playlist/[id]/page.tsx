"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Playlist from "@/components/Playlist";
import { usePlaylists } from "@/context/PlaylistsContext";

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
  } = usePlaylists();

  if (!hydrated) {
    return (
      <div className="p-6 text-neutral-400 xl:p-10">Loading playlist…</div>
    );
  }

  const playlist = id ? getPlaylist(id) : undefined;

  if (!playlist) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Playlist not found</h1>
        <p className="text-neutral-400">
          It may have been deleted or the link is incorrect.
        </p>
        <Link
          href="/"
          className="rounded-full bg-neutral-800 px-6 py-2 font-semibold hover:bg-neutral-700"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const currentPlaylist = playlist;

  function handleDelete() {
    if (!window.confirm(`Delete "${currentPlaylist.name}"?`)) return;
    deletePlaylist(currentPlaylist.id);
    router.push("/");
  }

  function handleEdit() {
    router.push(`/playlist/${currentPlaylist.id}/edit`);
  }

  return (
    <Playlist
      playlist={currentPlaylist}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onUpdate={updatePlaylist}
      onPlay={setCurrentTrack}
    />
  );
}
