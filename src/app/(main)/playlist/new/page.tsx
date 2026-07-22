"use client";

import { useRouter } from "next/navigation";
import PlaylistForm from "@/components/PlaylistForm";
import { usePlaylists } from "@/context/PlaylistsContext";
import type { PlaylistFormData } from "@/types/playlist";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function NewPlaylistPage() {
  const router = useRouter();
  const { createPlaylist } = usePlaylists();

  function handleSubmit(formData: PlaylistFormData) {
    const playlist = createPlaylist(formData);
    router.push(`/playlist/${playlist.id}`);
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-full items-start justify-center p-6 xl:p-10">
        <div className="w-full max-w-lg">
          <h1 className="mb-8 text-3xl font-bold">Create playlist</h1>
          <PlaylistForm onSubmit={handleSubmit} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
