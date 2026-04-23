"use client";

import { useEffect, useRef, useState } from "react";
import type { HistoriaSlide, MomentoFavorito } from "@/types/historia";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api-web-jime-jime.up.railway.app";

// ── Slide thumbnail ────────────────────────────────────────────────────────────

function SlideThumb({ slide }: { slide: HistoriaSlide }) {
  const typeLabel = { text: "TEXTO", arch: "ARCO", fullbleed: "FULL" }[slide.type] ?? slide.type;
  return (
    <div style={{ width: 48, height: 64, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#0a1930", border: "1px solid #1a3a6e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {slide.img_url
        ? <img src={slide.img_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : slide.emoji
          ? <span style={{ fontSize: 22 }}>{slide.emoji}</span>
          : <span style={{ fontSize: 9, color: "#556", fontFamily: "monospace", textAlign: "center", lineHeight: 1.3 }}>{typeLabel}</span>
      }
    </div>
  );
}

// ── Slide form ─────────────────────────────────────────────────────────────────

interface SlideFormProps {
  initial?: HistoriaSlide;
  onSave: (fd: FormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function SlideForm({ initial, onSave, onCancel, saving }: SlideFormProps) {
  const [date, setDate] = useState(initial?.date ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");
  const [type, setType] = useState<"text" | "arch" | "fullbleed">(initial?.type ?? "text");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "");
  const photoRef = useRef<HTMLInputElement>(null);

  async function handle() {
    const fd = new FormData();
    if (initial) {
      if (date !== initial.date) fd.append("date", date);
      if (title !== initial.title) fd.append("title", title);
      if (desc !== initial.desc) fd.append("desc", desc);
      if (type !== initial.type) fd.append("slide_type", type);
      if (emoji !== (initial.emoji ?? "")) fd.append("emoji", emoji);
    } else {
      fd.append("date", date);
      fd.append("title", title);
      fd.append("desc", desc);
      fd.append("slide_type", type);
      if (emoji.trim()) fd.append("emoji", emoji.trim());
    }
    if (photoRef.current?.files?.[0]) fd.append("photo", photoRef.current.files[0]);
    await onSave(fd);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label style={labelStyle}>
        Fecha (texto libre, ej: &quot;FINALES DE 2022&quot;)
        <input style={inputStyle} value={date} onChange={e => setDate(e.target.value)} placeholder="FINALES DE 2022" />
      </label>
      <label style={labelStyle}>
        Título (usá \n para salto de línea)
        <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="El Coro" />
      </label>
      <label style={labelStyle}>
        Descripción
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: "vertical" } as React.CSSProperties}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Nos conocimos en el coro..."
        />
      </label>
      <label style={labelStyle}>
        Tipo de slide
        <select
          style={{ ...inputStyle, cursor: "pointer" }}
          value={type}
          onChange={e => setType(e.target.value as "text" | "arch" | "fullbleed")}
        >
          <option value="text">texto — solo tipografía, fondo crema</option>
          <option value="arch">arco — foto/emoji en arco + texto</option>
          <option value="fullbleed">fullbleed — foto a pantalla completa</option>
        </select>
      </label>
      {type === "arch" && (
        <label style={labelStyle}>
          Emoji (opcional, se muestra si no hay foto)
          <input style={inputStyle} value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🎵" maxLength={4} />
        </label>
      )}
      <label style={labelStyle}>
        Foto {initial?.img_url ? "(opcional — reemplaza la actual)" : "(opcional)"}
        {initial?.img_url && (
          <div style={{ marginTop: 4 }}>
            <img src={initial.img_url} alt="" style={{ height: 60, borderRadius: 6, objectFit: "cover" }} />
          </div>
        )}
        <input ref={photoRef} type="file" accept="image/*" style={fileInputStyle} />
      </label>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button style={btnPrimary} onClick={handle} disabled={saving || !date.trim() || !title.trim() || !desc.trim()}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button style={btnSecondary} onClick={onCancel} disabled={saving}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function HistoriaAdmin() {
  const [tab, setTab] = useState<"slides" | "momentos">("slides");
  const [slides, setSlides] = useState<HistoriaSlide[]>([]);
  const [momentos, setMomentos] = useState<MomentoFavorito[]>([]);

  const [showAddSlide, setShowAddSlide] = useState(false);
  const [editSlideId, setEditSlideId] = useState<number | null>(null);
  const [savingSlide, setSavingSlide] = useState(false);

  const [uploadingMomento, setUploadingMomento] = useState(false);
  const momentoRef = useRef<HTMLInputElement>(null);

  async function loadSlides() {
    const r = await fetch(`${API}/historia/slides`);
    if (r.ok) setSlides(await r.json());
  }

  async function loadMomentos() {
    const r = await fetch(`${API}/historia/momentos`);
    if (r.ok) setMomentos(await r.json());
  }

  useEffect(() => { loadSlides(); loadMomentos(); }, []);

  async function handleAddSlide(fd: FormData) {
    setSavingSlide(true);
    await fetch(`${API}/historia/slides`, { method: "POST", body: fd });
    setSavingSlide(false);
    setShowAddSlide(false);
    loadSlides();
  }

  async function handleEditSlide(id: number, fd: FormData) {
    setSavingSlide(true);
    await fetch(`${API}/historia/slides/${id}`, { method: "PATCH", body: fd });
    setSavingSlide(false);
    setEditSlideId(null);
    loadSlides();
  }

  async function handleDeleteSlide(id: number) {
    if (!confirm("¿Eliminar este slide?")) return;
    await fetch(`${API}/historia/slides/${id}`, { method: "DELETE" });
    loadSlides();
  }

  async function moveSlide(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= slides.length) return;
    const newSlides = [...slides];
    [newSlides[index], newSlides[target]] = [newSlides[target], newSlides[index]];
    setSlides(newSlides);
    await fetch(`${API}/historia/slides/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSlides.map(s => s.id)),
    });
    loadSlides();
  }

  async function handleUploadMomento() {
    const file = momentoRef.current?.files?.[0];
    if (!file) return;
    setUploadingMomento(true);
    const fd = new FormData();
    fd.append("photo", file);
    await fetch(`${API}/historia/momentos`, { method: "POST", body: fd });
    setUploadingMomento(false);
    if (momentoRef.current) momentoRef.current.value = "";
    loadMomentos();
  }

  async function handleDeleteMomento(id: number) {
    if (!confirm("¿Eliminar esta foto?")) return;
    await fetch(`${API}/historia/momentos/${id}`, { method: "DELETE" });
    loadMomentos();
  }

  async function moveMomento(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= momentos.length) return;
    const newMomentos = [...momentos];
    [newMomentos[index], newMomentos[target]] = [newMomentos[target], newMomentos[index]];
    setMomentos(newMomentos);
    await fetch(`${API}/historia/momentos/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMomentos.map(m => m.id)),
    });
    loadMomentos();
  }

  return (
    <div style={{ fontFamily: "var(--font-nunito)", color: "#cde" }}>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: 12, overflow: "hidden", border: "2px solid #1a3a6e" }}>
        {(["slides", "momentos"] as const).map(t => (
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
            {t === "slides" ? "📖 Slides" : "🖼️ Momentos Favoritos"}
          </button>
        ))}
      </div>

      {/* ── Slides tab ─────────────────────────────────────────────────────────── */}
      {tab === "slides" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ margin: 0, color: "#88a", fontSize: 13 }}>{slides.length} slide{slides.length !== 1 ? "s" : ""}</p>
            {!showAddSlide && (
              <button style={btnPrimary} onClick={() => setShowAddSlide(true)}>+ Agregar slide</button>
            )}
          </div>

          {showAddSlide && (
            <div style={cardStyle}>
              <p style={sectionTitle}>Nuevo slide</p>
              <SlideForm onSave={handleAddSlide} onCancel={() => setShowAddSlide(false)} saving={savingSlide} />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {slides.map((slide, i) => (
              <div key={slide.id}>
                {editSlideId === slide.id ? (
                  <div style={cardStyle}>
                    <p style={sectionTitle}>Editar — {slide.title}</p>
                    <SlideForm
                      initial={slide}
                      onSave={(fd) => handleEditSlide(slide.id, fd)}
                      onCancel={() => setEditSlideId(null)}
                      saving={savingSlide}
                    />
                  </div>
                ) : (
                  <div style={{ ...cardStyle, flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#556", fontSize: 12, minWidth: 24, textAlign: "center", fontFamily: "monospace" }}>
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <SlideThumb slide={slide} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {slide.title.replace(/\\n/g, " / ")}
                      </p>
                      <p style={{ margin: "2px 0 0", color: "#88a", fontSize: 11, fontFamily: "monospace" }}>
                        {slide.date} · {slide.type}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button style={iconBtn} onClick={() => moveSlide(i, -1)} disabled={i === 0} title="Subir">↑</button>
                      <button style={iconBtn} onClick={() => moveSlide(i, 1)} disabled={i === slides.length - 1} title="Bajar">↓</button>
                      <button style={iconBtn} onClick={() => setEditSlideId(slide.id)} title="Editar">✏</button>
                      <button style={{ ...iconBtn, color: "#e55" }} onClick={() => handleDeleteSlide(slide.id)} title="Eliminar">✕</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {slides.length === 0 && !showAddSlide && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#556" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📖</div>
              <p style={{ margin: 0, fontSize: 14 }}>No hay slides todavía</p>
            </div>
          )}
        </div>
      )}

      {/* ── Momentos tab ──────────────────────────────────────────────────────── */}
      {tab === "momentos" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ margin: 0, color: "#88a", fontSize: 13 }}>{momentos.length} foto{momentos.length !== 1 ? "s" : ""}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                ref={momentoRef}
                type="file"
                accept="image/*"
                style={fileInputStyle}
                onChange={handleUploadMomento}
                disabled={uploadingMomento}
              />
              {uploadingMomento && <span style={{ fontSize: 12, color: "#88a" }}>Subiendo...</span>}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {momentos.map((m, i) => (
              <div key={m.id} style={{ ...cardStyle, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#556", fontSize: 12, minWidth: 20, textAlign: "center", fontFamily: "monospace" }}>{i + 1}</span>
                <div style={{ width: 72, height: 52, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#0a1930" }}>
                  <img src={m.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#556", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.photo_url.split("/").pop()}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button style={iconBtn} onClick={() => moveMomento(i, -1)} disabled={i === 0} title="Subir">↑</button>
                  <button style={iconBtn} onClick={() => moveMomento(i, 1)} disabled={i === momentos.length - 1} title="Bajar">↓</button>
                  <button style={{ ...iconBtn, color: "#e55" }} onClick={() => handleDeleteMomento(m.id)} title="Eliminar">✕</button>
                </div>
              </div>
            ))}
          </div>

          {momentos.length === 0 && !uploadingMomento && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#556" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🖼️</div>
              <p style={{ margin: 0, fontSize: 14 }}>No hay fotos todavía. Subí una con el selector de arriba.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

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
