export interface PopularSong {
  id: number;
  title: string;
  cover_url: string | null;
  audio_url: string | null;
  order: number;
}

export interface AlbumTrack {
  id: number;
  title: string;
  audio_url: string | null;
  order: number;
}

export interface Album {
  id: number;
  title: string;
  cover_url: string | null;
  year: number | null;
  order: number;
  tracks: AlbumTrack[];
}
