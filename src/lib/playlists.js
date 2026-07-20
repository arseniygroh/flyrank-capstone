export const PLAYLISTS_STORAGE_KEY = "playlists";

export function createPlaylistFromForm({ name, privacy, description }) {
  return {
    id: crypto.randomUUID(),
    name,
    privacy,
    description,
    tracks: [],
  };
}
