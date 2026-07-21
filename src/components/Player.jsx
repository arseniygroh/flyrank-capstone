"use client";

import { useRef, useEffect } from "react";
import { usePlaylists } from "@/context/PlaylistsContext";

export default function Player({track}) {
  const { isPaused } = usePlaylists();
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) return;

    if (isPaused) {
      playerRef.current.pause();
    } else {
      playerRef.current.play().catch((err) => {
        console.error(err);
      });
    }
  }, [isPaused, track]);

  if (!track) return null;

  return (
    <div className="w-full h-24 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 w-1/3">
        <img
          src={track.artworkUrl60}
          alt="Album art"
          className="w-14 h-14 rounded-md shadow-lg"
        />
        <div className="truncate">
          <p className="text-white font-bold truncate">{track.trackName}</p>
          <p className="text-neutral-400 text-sm truncate">{track.artistName}</p>
        </div>
      </div>
      <div className="w-1/3 flex justify-center">
        <audio
          key={track.trackId}
          ref={playerRef}
          src={track.previewUrl}
          controls
          autoPlay
          className="h-10 outline-none"
        />
      </div>
      <div className="w-1/3"></div>
    </div>
  );
}