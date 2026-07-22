"use client";
import { useState } from "react";
import { usePlaylists } from "@/context/PlaylistsContext";
import type { PlaylistTrack } from "@/types/playlist";

export default function TrackCard({track}: {track: PlaylistTrack}) {
  const {setCurrentTrackAndPlay, playlists, addTrackToPlaylist, isPaused, pauseTrack, currentTrack, resumeTrack} = usePlaylists();
 
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isCurrentTrack = currentTrack?.trackId === track?.trackId;
  const showPauseIcon = isCurrentTrack && !isPaused;
  
  const handleTogglePlay = () => {
    if (isCurrentTrack) {
      isPaused ? resumeTrack() : pauseTrack();
    } else {
      setCurrentTrackAndPlay(track);
    }
  };

  const handleSelectPlaylist = (playlistId: string) => {
    addTrackToPlaylist(playlistId, track);
    setShowDropdown(false);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="min-w-[160px] max-w-[160px] p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors snap-start shrink-0 group relative flex flex-col">
      <div className="relative mb-3">
        <img 
          src={track?.artworkUrl100.replace('100x100', '300x300')} 
          alt={track?.trackName}
          className="w-full aspect-square object-cover rounded-md shadow-lg group-hover:opacity-50 transition-opacity"
        />
        <button
          onClick={handleTogglePlay}
          className="absolute inset-0 m-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center
                    opacity-100 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100
                    transition-opacity text-black text-xl pl-1"
        >
          {showPauseIcon ? "⏸" : "▶"}
        </button>
      </div>
      
      <div className="flex-1">
        <p className="font-semibold text-sm truncate" title={track?.trackName}>
          {track?.trackName}
        </p>
        <p className="text-xs text-neutral-400 truncate mb-4" title={track?.artistName}>
          {track?.artistName}
        </p>
      </div>
      
      <div className="relative mt-auto">
        {showDropdown && (
          <div className="absolute bottom-full mb-2 left-0 w-full bg-neutral-800 rounded-md shadow-xl border border-neutral-700 overflow-hidden z-10 max-h-40 overflow-y-auto">
            {playlists.length === 0 ? (
              <p className="p-3 text-xs text-neutral-400 text-center">No playlists yet.</p>
            ) : (
              playlists.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlaylist(p.id)}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-700 transition-colors truncate"
                >
                  {p.name}
                </button>
              ))
            )}
          </div>
        )}

        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isAdded}
          className={`w-full py-1.5 text-xs font-bold rounded-full transition-colors ${
            isAdded 
              ? "bg-green-500 text-black" 
              : "bg-white text-neutral-900 hover:bg-neutral-200"
          }`}
        >
          {isAdded ? "Added" : "+ Add to Playlist"}
        </button>
      </div>
    </div>
  );
}