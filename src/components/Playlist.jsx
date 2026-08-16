"use client";

import { useEffect } from "react";
import { usePlaylists, API_URL } from "@/context/PlaylistsContext";
import TrackSearch from "./TrackSearch";
import { useAuth } from "@/context/AuthContext";
import StatefulButton from "@/components/StatefulButton";
import { io } from "socket.io-client";
import { Music } from "lucide-react";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react"; 


const socket = io(API_URL);

function SortableTrackItem({ track, index, isOwner, canEdit, onPlay, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: track.trackId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
        position: isDragging ? "relative" : "static",
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            onClick={() => onPlay(track)}
            className="flex items-center justify-between gap-2 p-3 bg-neutral-900 rounded-md group hover:bg-neutral-800 active:bg-neutral-800 transition-colors cursor-pointer min-w-0"
        >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                {canEdit && (
                    <div
                        {...attributes}
                        {...listeners}
                        onClick={(e) => e.stopPropagation()} 
                        className="cursor-grab active:cursor-grabbing text-neutral-500 hover:text-white transition-colors p-1"
                        aria-label="Drag to reorder"
                    >
                        <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                )}
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
            {canEdit && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(track.trackId);
                    }}
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-neutral-500 hover:text-red-500 active:text-red-500 font-bold px-3 sm:px-4 transition-all cursor-pointer shrink-0 text-sm"
                    aria-label={`Remove ${track.trackName} from playlist`}
                >
                    X
                </button>
            )}
        </li>
    );
}

export default function Playlist({ playlist, onDelete, onEdit, onUpdate, onPlay }) {
    const { setCurrentTrackList, createPlaylist, playlists } = usePlaylists();
    const { user } = useAuth();

    const isOwner = user?.username === playlist.creatorName;
    const isCollaborative = playlist.privacy === "Collaborative";
    const canEdit = isOwner || (isCollaborative && user);

    useEffect(() => {
        if (!playlist?.id) return;

        socket.emit("join_playlist", playlist.id);

        socket.on("receive_playlist_update", (updatedPlaylist) => {
            onUpdate(updatedPlaylist); 
        });

        return () => {
            socket.off("receive_playlist_update");
        };
    }, [playlist?.id, onUpdate]);

    function broadcastAndUpdate(updatedPlaylist) {
        onUpdate(updatedPlaylist);
        socket.emit("send_playlist_update", updatedPlaylist);
    }

    function handleAddTrack(newTrack) {
        const trackExists = playlist.tracks.some((t) => t.trackId === newTrack.trackId);

        if (!trackExists) {
            const updatedPlaylist = {
                ...playlist,
                tracks: [...playlist.tracks, newTrack],
            };
            broadcastAndUpdate(updatedPlaylist);
        } else {
            alert("You already have this track in your playlist");
            throw new Error("Track exists in playlist");
        }
    }

    function handleDeleteTrack(id) {
        const updatedPlaylist = {
            ...playlist,
            tracks: [...playlist.tracks].filter((t) => t.trackId !== id),
        };
        broadcastAndUpdate(updatedPlaylist);
    }

    function handlePlayTrack(track) {
        onPlay(track);
        setCurrentTrackList(playlist.tracks);
    }

    function handleShare() {
        const updatedPlaylist = {
            ...playlist,
            isShared: !playlist.isShared,
        };
        broadcastAndUpdate(updatedPlaylist);
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
            creatorName: user.username,
        };

        await createPlaylist(copy);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, 
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event) {
        if (!canEdit) return; 

        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = playlist.tracks.findIndex((t) => t.trackId === active.id);
            const newIndex = playlist.tracks.findIndex((t) => t.trackId === over.id);

            const reorderedTracks = arrayMove(playlist.tracks, oldIndex, newIndex);
            
            const updatedPlaylist = {
                ...playlist,
                tracks: reorderedTracks,
            };

            broadcastAndUpdate(updatedPlaylist);
        }
    }

    return (
        <article className="flex flex-col p-4 sm:p-6 h-full text-white w-full min-w-0">
            <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8 mb-8 pb-8 border-b border-neutral-800">
                {playlist.coverImage ? (
                    <img 
                        src={playlist.coverImage} 
                        alt={`${playlist.name} cover`}
                        className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-xl shadow-2xl shrink-0 bg-neutral-800"
                    />
                ) : (
                    <div className="w-20 h-20 bg-neutral-800 rounded-xl flex items-center justify-center shrink-0">
                        <Music className="w-10 h-10 text-neutral-500" />
                    </div>
                )}
                <div className="flex flex-col justify-end h-full mt-4 md:mt-0">
                    <div className="w-fit max-w-full px-3 py-1 bg-neutral-800 text-neutral-300 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                        {playlist.privacy} Playlist
                    </div>
                    
                    <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 break-words line-clamp-2">
                        {playlist.name}
                    </h2>
                    
                    {playlist.description && (
                        <p className="text-neutral-400 text-base sm:text-lg max-w-2xl leading-relaxed break-words">
                            {playlist.description}
                        </p>
                    )}
                    {user?.username && (
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6">
                            {isOwner ? (
                                <>
                                    <button
                                        className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-5 rounded-full transition-colors text-sm"
                                        type="button"
                                        onClick={onEdit}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-5 rounded-full transition-colors text-sm"
                                        type="button"
                                        onClick={onDelete}
                                    >
                                        Delete
                                    </button>
                                    {playlist.privacy !== "Private" && (
                                        <button
                                            className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-5 rounded-full transition-colors text-sm"
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
                </div>
            </div>
            <div className="mt-8 sm:mt-12 mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-neutral-200 border-b border-neutral-800 pb-2">
                    Tracks
                </h3>
                {!playlist.tracks || playlist.tracks.length === 0 ? (
                    <p className="text-neutral-500 italic text-sm sm:text-base">
                        This playlist is empty. Search below to add tracks.
                    </p>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={playlist.tracks.map((t) => t.trackId)}
                            strategy={verticalListSortingStrategy}
                        >
                            <ul className="flex flex-col gap-2">
                                {playlist.tracks.map((track, index) => (
                                    <SortableTrackItem
                                        key={track.trackId}
                                        track={track}
                                        index={index}
                                        isOwner={isOwner}
                                        canEdit={canEdit} 
                                        onPlay={handlePlayTrack}
                                        onDelete={handleDeleteTrack}
                                    />
                                ))}
                            </ul>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
            {canEdit && <TrackSearch onAdd={handleAddTrack} />}
        </article>
    );
}