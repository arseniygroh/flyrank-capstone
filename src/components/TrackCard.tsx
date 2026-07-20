"use client";
import { usePlaylists } from "@/context/PlaylistsContext"; 

export default function TrackCard({track}: {track: any}) {
  const {setCurrentTrack} = usePlaylists();

  const handlePlay = () => {
    setCurrentTrack(track);
  };

  const handleAdd = () => {
    console.log("Opening add to playlist modal");
  };

  return (
    <div className="min-w-[160px] max-w-[160px] p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors snap-start shrink-0 group relative flex flex-col">
      <div className="relative mb-3">
        <img 
          src={track.artworkUrl100.replace('100x100', '300x300')} 
          alt={track.trackName}
          className="w-full aspect-square object-cover rounded-md shadow-lg group-hover:opacity-50 transition-opacity"
        />
        <button 
          onClick={handlePlay}
          className="absolute inset-0 m-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black text-xl pl-1"
          aria-label="Play track"
        >
          ▶
        </button>
      </div>
      
      <div className="flex-1">
        <p className="font-semibold text-sm truncate" title={track.trackName}>
          {track.trackName}
        </p>
        <p className="text-xs text-neutral-400 truncate mb-4" title={track.artistName}>
          {track.artistName}
        </p>
      </div>
      
      <button 
        onClick={handleAdd}
        className="w-full py-1.5 text-xs font-bold text-neutral-900 bg-white rounded-full hover:bg-neutral-200 transition-colors mt-auto"
      >
        + Add to Playlist
      </button>
    </div>
  );
}