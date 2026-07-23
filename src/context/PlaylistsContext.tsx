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
import type { Playlist, PlaylistFormData, PlaylistTrack } from "@/types/playlist";
import { useAuth } from "./AuthContext";

type PlaylistsContextValue = {
  playlists: Playlist[];
  hydrated: boolean;
  isPaused: boolean;
  currentTrack: PlaylistTrack | null;
  setCurrentTrack: (track: PlaylistTrack | null) => void;
  getPlaylist: (id: string) => Playlist | undefined;
  createPlaylist: (formData: PlaylistFormData) => Promise<Playlist | undefined>;
  updatePlaylist: (playlist: Playlist) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, track: PlaylistTrack) => Promise<void>;
  pauseTrack: () => void;
  setCurrentTrackAndPlay: (track: PlaylistTrack | null) => void;
  resumeTrack: () => void;
};

const PlaylistsContext = createContext<PlaylistsContextValue | null>(null);

export function PlaylistsProvider({ children }: { children: ReactNode }) {
  const { user, isHydrated: authHydrated, token } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<PlaylistTrack | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!authHydrated) return; 
    if (!user || !token) {
      setPlaylists([]);
      setHydrated(true);
      return;
    }

  const fetchPlaylists = async () => {
      try {
        const res = await fetch("http://localhost:5000/playlists", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setPlaylists(data);
        }
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      } finally {
        setHydrated(true);
      }
  };

    fetchPlaylists();
  }, [user, authHydrated, token]);

  const getPlaylist = useCallback(
    (id: string) => playlists.find((p) => p.id === id),
    [playlists]
  );

  const createPlaylist = useCallback(async (formData: PlaylistFormData) => {
    if (!token) return;
    
    try {
      const res = await fetch("http://localhost:5000/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newPlaylist = await res.json();
        setPlaylists(prev => [...prev, newPlaylist]);
        return newPlaylist;
      }
    } catch (error) {
      console.error("Error creating playlist", error);
    }
  }, [token]);

  const deletePlaylist = useCallback(async (id: string) => {
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/playlists/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPlaylists(prev => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting playlist", error);
    }
  }, [token]);

  const addTrackToPlaylist = useCallback(async (playlistId: string, track: PlaylistTrack) => {
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ track }),
      });

      if (res.ok) {
        const updatedPlaylist = await res.json();
        setPlaylists((prev) =>
          prev.map((p) => (p.id === playlistId ? updatedPlaylist : p))
        );
      }
    } catch (error) {
      console.error("Error adding track", error);
    }
  }, [token]);

  const updatePlaylist = useCallback(async (updated: Playlist) => {
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/playlists/${updated.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        const savedPlaylist = await res.json();
        setPlaylists((prev) => prev.map((p) => (p.id === savedPlaylist.id ? savedPlaylist : p)));
      }
    } catch (error) {
      console.error("Error updating playlist", error);
    }
  }, [token]);

  const pauseTrack = useCallback(() => setIsPaused(true), []);
  const resumeTrack = useCallback(() => setIsPaused(false), []);
  const setCurrentTrackAndPlay = useCallback((track: PlaylistTrack | null) => {
    setCurrentTrack(track);
    setIsPaused(false);
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
      playlists, hydrated, isPaused, currentTrack, getPlaylist, createPlaylist, 
      updatePlaylist, deletePlaylist, addTrackToPlaylist, pauseTrack, setCurrentTrackAndPlay, resumeTrack
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