export const PLAYLISTS_STORAGE_KEY = "playlists";

export function createPlaylistFromForm({ name, privacy, description, creatorName }) {
  return {
    id: crypto.randomUUID(),
    name,
    privacy,
    description,
    creatorName,
    tracks: [],
    isShared: false,
  };
}
