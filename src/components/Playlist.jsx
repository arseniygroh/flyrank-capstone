"use client";
import { usePlaylists } from "@/context/PlaylistsContext";
import TrackSearch from "./TrackSearch";
import { useAuth } from "@/context/AuthContext";
import StatefulButton from "@/components/StatefulButton";

export default function Playlist({playlist, onDelete, onEdit, onUpdate, onPlay}) {
    const { setCurrentTrackList, createPlaylist, playlists } = usePlaylists();
    const { user } = useAuth();

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
            throw new Error("Track exists in playlist");
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
        setCurrentTrackList(playlist.tracks);
    }

    function handleShare() {
        const updatedPlaylist = {
            ...playlist,
            isShared: !playlist.isShared
        }

        onUpdate(updatedPlaylist);
    }

    async function handleAddToMyOwnPlaylists() {
        const copied = playlists.some((p) => p.name === playlist.name);

        if (copied) {
            alert("You already have a copy of this playlist in your library!");
            throw new Error("already copied");
        }
        const { id, ...restOfPlaylist } = playlist;

        const copy = {
            ...restOfPlaylist,
            isShared: false,
            privacy: "Private",
            creatorName: user.username
        };

        await createPlaylist(copy);
    }

    const isOwner = user?.username === playlist.creatorName;

    return (
        <article className="flex flex-col p-4 sm:p-6 h-full text-white w-full min-w-0">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 break-words">
                {playlist.name}
            </h2>
            <div className="w-fit max-w-full px-3 py-1 bg-neutral-800 text-neutral-300 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                Privacy status: {playlist.privacy}
            </div>
            {playlist.description && (
                <p className="text-neutral-400 text-base sm:text-lg max-w-2xl leading-relaxed border-b border-neutral-800 pb-6 sm:pb-8 break-words">
                    {playlist.description}
                </p>
            )}
            {user?.username && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                    {isOwner ? (
                        <>
                            <button
                                className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-5 sm:px-8 rounded-full transition-colors text-sm sm:text-base"
                                type="button"
                                onClick={onEdit}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-5 sm:px-6 rounded-full transition-colors text-sm sm:text-base"
                                type="button"
                                onClick={onDelete}
                            >
                                Delete
                            </button>
                            {playlist.privacy !== "Private" && (
                                <button
                                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-5 sm:px-8 rounded-full transition-colors text-sm sm:text-base"
                                    type="button"
                                    onClick={handleShare}
                                >
                                    {!playlist.isShared ? "Share with community" : "Stop sharing"}
                                </button>
                            )}
                        </>
                    ) : (
                        <StatefulButton
                            onClick={handleAddToMyOwnPlaylists}
                            idleText="Add to my own playlists"
                        />
                    )}
                </div>
            )}
            <div className="mt-8 sm:mt-12 mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-neutral-200 border-b border-neutral-800 pb-2">
                    Tracks
                </h3>
                {!playlist.tracks || playlist.tracks.length === 0 ? (
                    <p className="text-neutral-500 italic text-sm sm:text-base">
                        This playlist is empty. Search below to add tracks.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {playlist.tracks.map((track, index) => (
                            <li
                                key={track.trackId}
                                onClick={() => handlePlayTrack(track)}
                                className="flex items-center justify-between gap-2 p-3 bg-neutral-900 rounded-md group hover:bg-neutral-800 active:bg-neutral-800 transition-colors cursor-pointer min-w-0"
                            >
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                    <span className="text-neutral-500 font-mono text-xs sm:text-sm w-5 shrink-0 text-right">
                                        {index + 1}
                                    </span>
                                    <img
                                        src={track.artworkUrl60}
                                        alt=""
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-white text-sm sm:text-base truncate">
                                            {track.trackName}
                                        </p>
                                        <p className="text-xs sm:text-sm text-neutral-400 truncate">
                                            {track.artistName}
                                        </p>
                                    </div>
                                </div>
                                {isOwner && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTrack(track.trackId);
                                        }}
                                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-neutral-500 hover:text-red-500 active:text-red-500 font-bold px-3 sm:px-4 transition-all cursor-pointer shrink-0 text-sm"
                                        aria-label={`Remove ${track.trackName} from playlist`}
                                    >
                                        X
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {isOwner && <TrackSearch onAdd={handleAddTrack} />}
        </article>
    )
}
