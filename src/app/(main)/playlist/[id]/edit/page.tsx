"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PlaylistForm from "@/components/PlaylistForm";
import { usePlaylists } from "@/context/PlaylistsContext";

import type { PlaylistFormData } from "@/types/playlist";

export default function EditPlaylistPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const router = useRouter();
  const { hydrated, getPlaylist, updatePlaylist } = usePlaylists();

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

  function handleSubmit(formData: PlaylistFormData) {
    updatePlaylist({ ...currentPlaylist, ...formData });
    router.push(`/playlist/${currentPlaylist.id}`);
  }

  function handleCancel() {
    router.push(`/playlist/${currentPlaylist.id}`);
  }

  return (
    <div className="flex min-h-full items-start justify-center p-6 xl:p-10">
      <div className="w-full max-w-lg">
        <h1 className="mb-8 text-3xl font-bold">Edit playlist</h1>
        <PlaylistForm
          initialData={currentPlaylist}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
