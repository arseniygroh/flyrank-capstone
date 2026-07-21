"use client";

import { useRef, useEffect, useState } from "react";
import { usePlaylists } from "@/context/PlaylistsContext";

export default function Player({track}) {
  
  const { isPaused, pauseTrack, resumeTrack } = usePlaylists(); 
  const playerRef = useRef(null);
  
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    if (!playerRef.current) return;

    if (isPaused) {
      playerRef.current.pause();
    } else {
      playerRef.current.play().catch((err) => console.error(err));
    }
  }, [isPaused, track]);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (!playerRef.current) return;
    const current = playerRef.current.currentTime;
    const max = playerRef.current.duration;
    
    setCurrentTime(formatTime(current));
    setProgress((current / max) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!playerRef.current) return;
    setDuration(formatTime(playerRef.current.duration));
  };

  if (!track) return null;

  return (
    <div className="w-full h-auto py-4 md:h-24 md:py-0 bg-neutral-900 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between px-6 gap-4 md:gap-0">
      <div className="flex items-center gap-4 w-full justify-center md:justify-start">
        <img
          src={track.artworkUrl60}
          alt="Album art"
          className="w-14 h-14 rounded-md shadow-lg"
        />
        <div className="truncate text-center md:text-left">
          <p className="text-white font-bold">{track.trackName}</p>
          <p className="text-neutral-400 text-sm">{track.artistName}</p>
        </div>
      </div>
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center gap-2">
        <audio
          key={track.trackId}
          ref={playerRef}
          src={track.previewUrl}
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => pauseTrack(true)}
          className="hidden" 
        />
        <button
          onClick={() => isPaused ? resumeTrack() : pauseTrack()}
          className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform shrink-0"
        >
          {isPaused ? (
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
        </button>
        <div className="flex items-center gap-2 w-full max-w-md text-xs text-neutral-400 font-mono">
          <span>{currentTime}</span>
          <div className="h-1.5 flex-1 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full"
              style={{width: `${progress}%`}}
            />
          </div>
          <span>{duration}</span>
        </div>
      </div>
      <div className="hidden md:block md:w-1/3"></div>
    </div>
  );
}