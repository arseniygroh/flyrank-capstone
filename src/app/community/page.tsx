"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/context/PlaylistsContext";
import { Loader2, Music } from "lucide-react";
import { Playlist } from "@/types/playlist";
import FeedCard from "@/components/FeedCard";

export default function CommunityPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSharablePlaylists() {
      try {
        const res = await fetch(`${API_URL}/playlists/share`);
        if (!res.ok) throw new Error("Failed to load community playlists");

        const data = await res.json();
        setPlaylists(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSharablePlaylists();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-[85vh]">
      <div className="mb-10 border-b border-neutral-800 pb-6">
        <h1 className="text-4xl font-bold text-white mb-3">Community Feed</h1>
        <p className="text-neutral-400 text-lg">
          Discover, like, and discuss mixes from other music lovers.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20 text-neutral-500">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {!isLoading && !error && playlists.length === 0 && (
        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
          <Music className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">It's quiet in here...</h3>
          <p className="text-neutral-400">Be the first to publish a playlist!</p>
        </div>
      )}

      <div className="flex flex-col gap-8 pb-20">
        {playlists.map((playlist) => (
          <FeedCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
}