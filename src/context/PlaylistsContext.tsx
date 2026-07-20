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
  currentTrack: PlaylistTrack | null;
  setCurrentTrack: (track: PlaylistTrack | null) => void;
  getPlaylist: (id: string) => Playlist | undefined;
  createPlaylist: (formData: PlaylistFormData) => Playlist;
  updatePlaylist: (playlist: Playlist) => void;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, track: any) => void;
};

const PlaylistsContext = createContext<PlaylistsContextValue | null>(null);

export function PlaylistsProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<PlaylistTrack | null>(null);
  const [hydrated, setHydrated] = useState(false);

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

  const addTrackToPlaylist = (playlistId: string, track: any) => {
    setPlaylists(prev => {
      return prev.map(playlist => {
        if (playlist.id === playlistId) {
          const exists = playlist.tracks.some(t => t.trackId === track.trackId);
          if (exists) return playlist;
          
          return { ...playlist, tracks: [...playlist.tracks, track] };
        }
        return playlist;
      });
    });
  };

  const value = useMemo(
    () => ({
      playlists,
      hydrated,
      currentTrack,
      setCurrentTrack,
      getPlaylist,
      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      addTrackToPlaylist
    }),
    [
      playlists,
      hydrated,
      currentTrack,
      getPlaylist,
      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      addTrackToPlaylist
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
