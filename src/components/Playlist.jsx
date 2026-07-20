"use client";
import TrackSearch from "./TrackSearch";

export default function Playlist({playlist, onDelete, onEdit, onUpdate, onPlay}) {
    
    function handleAddTrack(newTrack) {
        const trackExists = playlist.tracks.some(t => t.trackId === newTrack.trackId);
        
        if (!trackExists) {
            const updatedPlaylist = {
                ...playlist,
                tracks: [...playlist.tracks, newTrack]
            };
            onUpdate(updatedPlaylist);
        } else {
            alert("You already have this track in your playlist");
        }
    }

    function handleDeleteTrack(id) {
        const updatedPlaylist = {
            ...playlist,
            tracks: [...playlist.tracks].filter(t => t.trackId !== id)
        };

        onUpdate(updatedPlaylist);
    }

    function handlePlayTrack(track) {
        onPlay(track);
    }

    return (
        <article className="flex flex-col p-6 h-full text-white">
            <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
                {playlist.name}
            </h2>
            <div className="w-fit px-3 py-1 bg-neutral-800 text-neutral-300 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                Privacy status: {playlist.privacy}
            </div>
            {playlist.description && (
                <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed border-b border-neutral-800 pb-8">
                    {playlist.description}
                </p>
            )}
            
            <div className="flex items-center gap-4 mt-6">
                <button 
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-8 rounded-full transition-colors" 
                    type="button" 
                    onClick={onEdit}
                >
                    Edit
                </button>
                <button 
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-6 rounded-full transition-colors" 
                    type="button" 
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
            <div className="mt-12 mb-8">
                <h3 className="text-xl font-bold mb-4 text-neutral-200 border-b border-neutral-800 pb-2">
                    Tracks
                </h3>
                {!playlist.tracks || playlist.tracks.length === 0 ? (
                    <p className="text-neutral-500 italic">This playlist is empty. Search below to add tracks.</p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {playlist.tracks.map((track, index) => (
                            <li key={track.trackId} onClick={e => handlePlayTrack(track)} className="flex items-center justify-between p-3 bg-neutral-900 rounded-md group hover:bg-neutral-800 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <span className="text-neutral-500 font-mono text-sm w-4">{index + 1}</span>
                                    <img src={track.artworkUrl60} alt="Album image" className="w-10 h-10 rounded" />
                                    <div>
                                        <p className="font-bold text-white">{track.trackName}</p>
                                        <p className="text-sm text-neutral-400">{track.artistName}</p>
                                    </div>
                                </div>
                                <button onClick={e => {
                                    e.stopPropagation(); 
                                    handleDeleteTrack(track.trackId);
                                    }} 
                                    className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-500 font-bold px-4 transition-all cursor-pointer">
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <TrackSearch onAdd={handleAddTrack} />
        </article>
        
    )
}