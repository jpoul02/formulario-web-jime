"use client";

import { useEffect, useRef, useState } from "react";
import type { PopularSong, Album, AlbumTrack } from "@/types/musica";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── helpers ───────────────────────────────────────────────────────────────────

function CoverImg({ src, size = 56 }: { src: string | null; size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 8, overflow: "hidden", flexShrink: 0,
        background: "linear-gradient(135deg,#1a3a6e,#0d2550)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {src
        ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span style={{ fontSize: size * 0.4 }}>🎵</span>}
    </div>
  );
}

// ── Player modal ──────────────────────────────────────────────────────────────

interface PlayerState { title: string; audio_url: string; cover_url: string | null }

function PlayerModal({ player, onClose }: { player: PlayerState; onClose: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(160deg,#0d2550 0%,#091a3a 100%)",
          border: "3px solid #1DB954",
          borderRadius: 20, padding: "32px 28px",
          width: "100%", maxWidth: 380,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CoverImg src={player.cover_url} size={160} />

        <p style={{ color: "#fff", fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: 20, margin: 0, textAlign: "center" }}>
          {player.title}
        </p>

        <audio
          ref={audioRef}
          src={player.audio_url}
          onTimeUpdate={() => { const a = audioRef.current; if (a) setProgress(a.currentTime); }}
          onLoadedMetadata={() => { const a = audioRef.current; if (a) setDuration(a.duration); }}
          onEnded={() => setPlaying(false)}
        />

        {/* Progress bar */}
        <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#aaa", fontSize: 12, minWidth: 36, fontFamily: "monospace" }}>{fmt(progress)}</span>
          <div
            style={{ flex: 1, height: 4, background: "#1a3a6e", borderRadius: 2, cursor: "pointer", position: "relative" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              if (audioRef.current) audioRef.current.currentTime = ratio * duration;
            }}
          >
            <div style={{ width: `${duration ? (progress / duration) * 100 : 0}%`, height: "100%", background: "#1DB954", borderRadius: 2 }} />
          </div>
          <span style={{ color: "#aaa", fontSize: 12, minWidth: 36, textAlign: "right", fontFamily: "monospace" }}>{fmt(duration)}</span>
        </div>

        {/* Controls */}
        <button
          style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "#1DB954", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26,
          }}
          onClick={() => {
            if (!audioRef.current) return;
            if (playing) { audioRef.current.pause(); setPlaying(false); }
            else { audioRef.current.play(); setPlaying(true); }
          }}
        >
          {playing ? "⏸" : "▶"}
        </button>

        <button
          style={{ background: "none", border: "none", color: "#88a", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-nunito)" }}
          onClick={onClose}
        >
          cerrar
        </button>
      </div>
    </div>
  );
}

// ── Add/Edit song form ────────────────────────────────────────────────────────

interface SongFormProps {
  initial?: PopularSong;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function SongForm({ initial, onSave, onCancel, saving }: SongFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [ytUrl, setYtUrl] = useState("");
  const coverRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  async function handle() {
    const fd = new FormData();
    fd.append("title", title);
    if (coverRef.current?.files?.[0]) fd.append("cover", coverRef.current.files[0]);
    if (audioRef.current?.files?.[0]) fd.append("audio", audioRef.current.files[0]);
    else if (ytUrl.trim()) fd.append("youtube_url", ytUrl.trim());
    await onSave(fd);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label style={labelStyle}>
        Nombre de la canción
        <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="ej. Hawái" />
      </label>
      <label style={labelStyle}>
        Cover (imagen)
        <input ref={coverRef} type="file" accept="image/*" style={fileInputStyle} />
      </label>
      <label style={labelStyle}>
        Audio (archivo mp3/wav)
        <input ref={audioRef} type="file" accept="audio/*" style={fileInputStyle} />
      </label>
      <label style={labelStyle}>
        o URL de YouTube
        <input style={inputStyle} value={ytUrl} onChange={e => setYtUrl(e.target.value)} placeholder="https://youtube.com/..." />
      </label>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button style={btnPrimary} onClick={handle} disabled={saving || !title.trim()}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button style={btnSecondary} onClick={onCancel} disabled={saving}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Add/Edit album form ───────────────────────────────────────────────────────

interface AlbumFormProps {
  initial?: Album;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function AlbumForm({ initial, onSave, onCancel, saving }: AlbumFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [year, setYear] = useState(initial?.year?.toString() ?? "");
  const coverRef = useRef<HTMLInputElement>(null);

  async function handle() {
    const fd = new FormData();
    fd.append("title", title);
    if (year) fd.append("year", year);
    if (coverRef.current?.files?.[0]) fd.append("cover", coverRef.current.files[0]);
    await onSave(fd);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label style={labelStyle}>
        Nombre del álbum
        <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="ej. Un Verano Sin Ti" />
      </label>
      <label style={labelStyle}>
        Año
        <input style={inputStyle} value={year} onChange={e => setYear(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="2024" />
      </label>
      <label style={labelStyle}>
        Cover (imagen)
        <input ref={coverRef} type="file" accept="image/*" style={fileInputStyle} />
      </label>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button style={btnPrimary} onClick={handle} disabled={saving || !title.trim()}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button style={btnSecondary} onClick={onCancel} disabled={saving}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Track form ────────────────────────────────────────────────────────────────

function TrackForm({ albumId, onSaved, onCancel }: { albumId: number; onSaved: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [ytUrl, setYtUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);

  async function handle() {
    setSaving(true);
    const fd = new FormData();
    fd.append("title", title);
    if (audioRef.current?.files?.[0]) fd.append("audio", audioRef.current.files[0]);
    else if (ytUrl.trim()) fd.append("youtube_url", ytUrl.trim());
    await fetch(`${API}/musica/albums/${albumId}/tracks`, { method: "POST", body: fd });
    setSaving(false);
    onSaved();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "12px 0 0" }}>
      <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Nombre del track" />
      <input ref={audioRef} type="file" accept="audio/*" style={fileInputStyle} />
      <input style={inputStyle} value={ytUrl} onChange={e => setYtUrl(e.target.value)} placeholder="o URL de YouTube" />
      <div style={{ display: "flex", gap: 8 }}>
        <button style={btnPrimary} onClick={handle} disabled={saving || !title.trim()}>
          {saving ? "..." : "Agregar"}
        </button>
        <button style={btnSecondary} onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MusicAdmin() {
  const [tab, setTab] = useState<"popular" | "discografia">("popular");
  const [songs, setSongs] = useState<PopularSong[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [player, setPlayer] = useState<PlayerState | null>(null);

  // popular UI state
  const [showAddSong, setShowAddSong] = useState(false);
  const [editSongId, setEditSongId] = useState<number | null>(null);
  const [savingSong, setSavingSong] = useState(false);

  // album UI state
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [editAlbumId, setEditAlbumId] = useState<number | null>(null);
  const [savingAlbum, setSavingAlbum] = useState(false);
  const [expandedAlbum, setExpandedAlbum] = useState<number | null>(null);
  const [addingTrackToAlbum, setAddingTrackToAlbum] = useState<number | null>(null);

  async function loadSongs() {
    const r = await fetch(`${API}/musica/popular`);
    if (r.ok) setSongs(await r.json());
  }

  async function loadAlbums() {
    const r = await fetch(`${API}/musica/albums`);
    if (r.ok) setAlbums(await r.json());
  }

  useEffect(() => { loadSongs(); loadAlbums(); }, []);

  // ── Popular handlers ────────────────────────────────────────────────────────

  async function handleAddSong(fd: FormData) {
    setSavingSong(true);
    await fetch(`${API}/musica/popular`, { method: "POST", body: fd });
    setSavingSong(false);
    setShowAddSong(false);
    loadSongs();
  }

  async function handleEditSong(id: number, fd: FormData) {
    setSavingSong(true);
    await fetch(`${API}/musica/popular/${id}`, { method: "PATCH", body: fd });
    setSavingSong(false);
    setEditSongId(null);
    loadSongs();
  }

  async function handleDeleteSong(id: number) {
    if (!confirm("¿Eliminar esta canción?")) return;
    await fetch(`${API}/musica/popular/${id}`, { method: "DELETE" });
    loadSongs();
  }

  async function moveSong(index: number, dir: -1 | 1) {
    const newSongs = [...songs];
    const target = index + dir;
    if (target < 0 || target >= newSongs.length) return;
    [newSongs[index], newSongs[target]] = [newSongs[target], newSongs[index]];
    setSongs(newSongs);
    await fetch(`${API}/musica/popular/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSongs.map(s => s.id)),
    });
    loadSongs();
  }

  // ── Album handlers ──────────────────────────────────────────────────────────

  async function handleAddAlbum(fd: FormData) {
    setSavingAlbum(true);
    await fetch(`${API}/musica/albums`, { method: "POST", body: fd });
    setSavingAlbum(false);
    setShowAddAlbum(false);
    loadAlbums();
  }

  async function handleEditAlbum(id: number, fd: FormData) {
    setSavingAlbum(true);
    await fetch(`${API}/musica/albums/${id}`, { method: "PATCH", body: fd });
    setSavingAlbum(false);
    setEditAlbumId(null);
    loadAlbums();
  }

  async function handleDeleteAlbum(id: number) {
    if (!confirm("¿Eliminar este álbum y todos sus tracks?")) return;
    await fetch(`${API}/musica/albums/${id}`, { method: "DELETE" });
    loadAlbums();
  }

  async function handleDeleteTrack(id: number) {
    if (!confirm("¿Eliminar este track?")) return;
    await fetch(`${API}/musica/tracks/${id}`, { method: "DELETE" });
    loadAlbums();
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "var(--font-nunito)", color: "#cde" }}>
      {player && <PlayerModal player={player} onClose={() => setPlayer(null)} />}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: 12, overflow: "hidden", border: "2px solid #1a3a6e" }}>
        {(["popular", "discografia"] as const).map(t => (
          <button
            key={t}
            style={{
              flex: 1, padding: "12px 0", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700,
              fontFamily: "var(--font-nunito)",
              background: tab === t ? "linear-gradient(to right, #0d2a5e, #15306a)" : "#060f24",
              color: tab === t ? "#1DB954" : "#88a",
              borderBottom: tab === t ? "2px solid #1DB954" : "2px solid transparent",
            }}
            onClick={() => setTab(t)}
          >
            {t === "popular" ? "🎵 Populares" : "💿 Discografía"}
          </button>
        ))}
      </div>

      {/* ── Popular tab ─────────────────────────────────────────────────────── */}
      {tab === "popular" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ margin: 0, color: "#88a", fontSize: 13 }}>{songs.length}/10 canciones</p>
            {songs.length < 10 && !showAddSong && (
              <button style={btnPrimary} onClick={() => setShowAddSong(true)}>+ Agregar canción</button>
            )}
          </div>

          {showAddSong && (
            <div style={cardStyle}>
              <p style={sectionTitle}>Nueva canción</p>
              <SongForm onSave={handleAddSong} onCancel={() => setShowAddSong(false)} saving={savingSong} />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {songs.map((song, i) => (
              <div key={song.id}>
                {editSongId === song.id ? (
                  <div style={cardStyle}>
                    <p style={sectionTitle}>Editar — {song.title}</p>
                    <SongForm
                      initial={song}
                      onSave={(fd) => handleEditSong(song.id, fd)}
                      onCancel={() => setEditSongId(null)}
                      saving={savingSong}
                    />
                  </div>
                ) : (
                  <div style={{ ...cardStyle, flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#556", fontSize: 13, minWidth: 20, textAlign: "center" }}>{i + 1}</span>
                    <CoverImg src={song.cover_url} size={52} />
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{song.title}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {song.audio_url && (
                        <button
                          style={iconBtn}
                          title="Reproducir"
                          onClick={() => setPlayer({ title: song.title, audio_url: song.audio_url!, cover_url: song.cover_url })}
                        >▶</button>
                      )}
                      <button style={iconBtn} onClick={() => moveSong(i, -1)} disabled={i === 0} title="Subir">↑</button>
                      <button style={iconBtn} onClick={() => moveSong(i, 1)} disabled={i === songs.length - 1} title="Bajar">↓</button>
                      <button style={iconBtn} onClick={() => setEditSongId(song.id)} title="Editar">✏</button>
                      <button style={{ ...iconBtn, color: "#e55" }} onClick={() => handleDeleteSong(song.id)} title="Eliminar">✕</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {songs.length === 0 && !showAddSong && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#556" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🎵</div>
              <p style={{ margin: 0, fontSize: 14 }}>No hay canciones populares todavía</p>
            </div>
          )}
        </div>
      )}

      {/* ── Discografía tab ──────────────────────────────────────────────────── */}
      {tab === "discografia" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            {!showAddAlbum && (
              <button style={btnPrimary} onClick={() => setShowAddAlbum(true)}>+ Nuevo álbum</button>
            )}
          </div>

          {showAddAlbum && (
            <div style={cardStyle}>
              <p style={sectionTitle}>Nuevo álbum</p>
              <AlbumForm onSave={handleAddAlbum} onCancel={() => setShowAddAlbum(false)} saving={savingAlbum} />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {albums.map((album) => (
              <div key={album.id} style={{ ...cardStyle, flexDirection: "column" }}>
                {editAlbumId === album.id ? (
                  <>
                    <p style={sectionTitle}>Editar álbum</p>
                    <AlbumForm
                      initial={album}
                      onSave={(fd) => handleEditAlbum(album.id, fd)}
                      onCancel={() => setEditAlbumId(null)}
                      saving={savingAlbum}
                    />
                  </>
                ) : (
                  <>
                    {/* Album header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <CoverImg src={album.cover_url} size={72} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{album.title}</p>
                        {album.year && <p style={{ margin: "2px 0 0", color: "#88a", fontSize: 13 }}>{album.year}</p>}
                        <p style={{ margin: "2px 0 0", color: "#556", fontSize: 12 }}>{album.tracks.length} track{album.tracks.length !== 1 ? "s" : ""}</p>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button style={iconBtn} onClick={() => setExpandedAlbum(expandedAlbum === album.id ? null : album.id)}>
                          {expandedAlbum === album.id ? "▲" : "▼"}
                        </button>
                        <button style={iconBtn} onClick={() => setEditAlbumId(album.id)}>✏</button>
                        <button style={{ ...iconBtn, color: "#e55" }} onClick={() => handleDeleteAlbum(album.id)}>✕</button>
                      </div>
                    </div>

                    {/* Expanded tracklist */}
                    {expandedAlbum === album.id && (
                      <div style={{ marginTop: 12, borderTop: "1px solid #1a3a6e", paddingTop: 12 }}>
                        {/* Spotify-style: two column on wide, single on mobile */}
                        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                          {/* Left: big cover */}
                          <div style={{ flexShrink: 0 }}>
                            <CoverImg src={album.cover_url} size={120} />
                          </div>
                          {/* Right: tracklist */}
                          <div style={{ flex: 1, minWidth: 200 }}>
                            {album.tracks.length === 0 && (
                              <p style={{ color: "#556", fontSize: 13, margin: "0 0 8px" }}>Sin tracks todavía</p>
                            )}
                            {album.tracks.map((track, i) => (
                              <TrackRow
                                key={track.id}
                                track={track}
                                index={i}
                                onPlay={() => track.audio_url && setPlayer({ title: track.title, audio_url: track.audio_url, cover_url: album.cover_url })}
                                onDelete={() => handleDeleteTrack(track.id)}
                              />
                            ))}
                            {addingTrackToAlbum === album.id ? (
                              <TrackForm
                                albumId={album.id}
                                onSaved={() => { setAddingTrackToAlbum(null); loadAlbums(); }}
                                onCancel={() => setAddingTrackToAlbum(null)}
                              />
                            ) : (
                              <button
                                style={{ ...btnSecondary, marginTop: 8, fontSize: 13 }}
                                onClick={() => setAddingTrackToAlbum(album.id)}
                              >
                                + Agregar track
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {albums.length === 0 && !showAddAlbum && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#556" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>💿</div>
              <p style={{ margin: 0, fontSize: 14 }}>No hay álbumes todavía</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Track row ─────────────────────────────────────────────────────────────────

function TrackRow({ track, index, onPlay, onDelete }: { track: AlbumTrack; index: number; onPlay: () => void; onDelete: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #0d1f40" }}>
      <span style={{ color: "#556", fontSize: 12, minWidth: 18 }}>{index + 1}</span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{track.title}</span>
      <div style={{ display: "flex", gap: 6 }}>
        {track.audio_url && <button style={iconBtn} onClick={onPlay} title="Reproducir">▶</button>}
        <button style={{ ...iconBtn, color: "#e55" }} onClick={onDelete} title="Eliminar">✕</button>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: "#060f24",
  border: "2px solid #1a3a6e",
  borderRadius: 12,
  padding: "14px 16px",
  display: "flex",
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#88bbee",
};

const labelStyle: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: 4, fontSize: 13, color: "#88a",
};

const inputStyle: React.CSSProperties = {
  background: "#0a1930", border: "2px solid #1a3a6e", borderRadius: 8,
  padding: "8px 12px", color: "#cde", fontSize: 14, outline: "none",
};

const fileInputStyle: React.CSSProperties = {
  background: "#0a1930", border: "2px solid #1a3a6e", borderRadius: 8,
  padding: "6px 12px", color: "#88a", fontSize: 12,
};

const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(to right,#0d2a5e,#15306a)",
  border: "2px solid #1DB954", borderRadius: 10,
  color: "#1DB954", fontWeight: 700, fontSize: 13,
  padding: "8px 20px", cursor: "pointer",
  fontFamily: "var(--font-nunito)",
};

const btnSecondary: React.CSSProperties = {
  background: "transparent", border: "2px solid #1a3a6e",
  borderRadius: 10, color: "#88a",
  fontWeight: 600, fontSize: 13,
  padding: "8px 16px", cursor: "pointer",
  fontFamily: "var(--font-nunito)",
};

const iconBtn: React.CSSProperties = {
  background: "#0a1930", border: "1px solid #1a3a6e",
  borderRadius: 6, color: "#88bbee",
  width: 30, height: 30, cursor: "pointer",
  fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
};
