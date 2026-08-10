"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/context/PlaylistsContext";
import { Loader2, Music } from "lucide-react";

export default function CommunityPage() {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSharablePlaylists() {
      try {
        const res = await fetch(`${API_URL}/playlists/share`);
        
        if (!res.ok) {
          throw new Error("Failed to load community playlists");
        }

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
    <div className="max-w-6xl mx-auto p-6 min-h-[85vh]">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Community Playlists</h1>
        <p className="text-neutral-400 text-lg">
          Discover mixes created by other music lovers.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20 text-neutral-500">
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
          <p className="text-neutral-400">Be the first to publish a public playlist!</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <Link 
            href={`/playlists/${playlist.id}`} 
            key={playlist.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:bg-neutral-800 hover:border-neutral-700 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Music className="w-8 h-8 text-neutral-500" />
              </div>
              <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">
                {playlist.tracks.length} tracks
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1 truncate">
              {playlist.name}
            </h2>
            <p className="text-sm text-neutral-400 mb-4 truncate">
              {playlist.description || "No description provided."}
            </p>
            
            <div className="flex items-center gap-2 pt-4 border-t border-neutral-800">
              <div className="w-6 h-6 bg-gradient-to-tr from-neutral-600 to-neutral-800 rounded-full" />
              <span className="text-xs text-neutral-300">
                Created by <span className="font-bold text-white">{playlist.creatorName}</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}