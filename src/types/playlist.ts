export type PlaylistPrivacy = "Public" | "Private" | "Collaborative";

export type PlaylistTrack = {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl60?: string;
  previewUrl?: string;
  artworkUrl100: string;
};

export type Playlist = {
  id: string;
  name: string;
  privacy: PlaylistPrivacy;
  description: string;
  tracks: PlaylistTrack[];
};

export type PlaylistFormData = {
  name: string;
  privacy: PlaylistPrivacy;
  description: string;
};
