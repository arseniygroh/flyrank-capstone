"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  PLAYLISTS_STORAGE_KEY,
  createPlaylistFromForm,
} from "@/lib/playlists";
import type { Playlist, PlaylistFormData, PlaylistTrack } from "@/types/playlist";

type PlaylistsContextValue = {
  playlists: Playlist[];
  hydrated: boolean;
  isPaused: boolean;
  currentTrack: PlaylistTrack | null;
  setCurrentTrack: (track: PlaylistTrack | null) => void;
  getPlaylist: (id: string) => Playlist | undefined;
  createPlaylist: (formData: PlaylistFormData) => Playlist;
  updatePlaylist: (playlist: Playlist) => void;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, track: any) => void;
  pauseTrack: () => void;
  setCurrentTrackAndPlay: (track: PlaylistTrack | null) => void;
  resumeTrack: () => void;
};

const PlaylistsContext = createContext<PlaylistsContextValue | null>(null);

export function PlaylistsProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<PlaylistTrack | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
      if (saved) {
        setPlaylists(JSON.parse(saved) as Playlist[]);
      }
    } catch {
      setPlaylists([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
  }, [playlists, hydrated]);

  const getPlaylist = useCallback(
    (id: string) => playlists.find((p) => p.id === id),
    [playlists]
  );

  const createPlaylist = useCallback((formData: PlaylistFormData) => {
    const playlist = createPlaylistFromForm(formData) as Playlist;
    setPlaylists((prev) => [...prev, playlist]);
    return playlist;
  }, []);

  const updatePlaylist = useCallback((updated: Playlist) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTrack = useCallback(() => {
    setIsPaused(false);
  }, []);

  const setCurrentTrackAndPlay = useCallback((track: PlaylistTrack | null) => {
    setCurrentTrack(track);
    setIsPaused(false);
  }, []);
  
  const addTrackToPlaylist = useCallback((playlistId: string, track: PlaylistTrack) => {
    setPlaylists(prev =>
      prev.map(playlist => {
        if (playlist.id !== playlistId) return playlist;
        const exists = playlist.tracks.some(t => t.trackId === track.trackId);
        if (exists) return playlist;
        return { ...playlist, tracks: [...playlist.tracks, track] };
      })
    );
  }, []);

  const value = useMemo(
    () => ({
      playlists,
      hydrated,
      currentTrack,
      isPaused,
      setCurrentTrack,
      getPlaylist,
      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      pauseTrack,
      setCurrentTrackAndPlay,
      resumeTrack
    }),
    [
      playlists,
      hydrated,
      isPaused,
      currentTrack,
      getPlaylist,
      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      pauseTrack,
      setCurrentTrackAndPlay,
      resumeTrack
    ]
  );

  return (
    <PlaylistsContext.Provider value={value}>
      {children}
    </PlaylistsContext.Provider>
  );
}

export function usePlaylists(): PlaylistsContextValue {
  const ctx = useContext(PlaylistsContext);
  if (!ctx) {
    throw new Error("usePlaylists must be used within PlaylistsProvider");
  }
  return ctx;
}
