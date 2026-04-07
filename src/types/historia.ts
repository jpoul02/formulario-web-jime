export interface HistoriaSlide {
  id: number;
  date: string;
  title: string;
  desc: string;
  type: "text" | "arch" | "fullbleed";
  img_url: string | null;
  emoji: string | null;
  order: number;
}

export interface MomentoFavorito {
  id: number;
  photo_url: string;
  order: number;
}
