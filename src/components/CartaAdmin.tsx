"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function CartaAdmin() {
  const [texto, setTexto] = useState("");
  const [original, setOriginal] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API}/carta`)
      .then(r => r.json())
      .then(data => {
        const t = data.texto ?? "";
        setTexto(t);
        setOriginal(t);
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch(`${API}/carta`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });
    setSaving(false);
    setSaved(true);
    setOriginal(texto);
    setTimeout(() => setSaved(false), 2500);
  }

  const isDirty = texto !== original;

  return (
    <div style={{ fontFamily: "var(--font-nunito)", color: "#cde", display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ margin: 0, color: "#88a", fontSize: 13, lineHeight: 1.6 }}>
        Esta carta aparece como sorpresa secreta. Se activa tocando el logo 5 veces o escribiendo{" "}
        <code style={{ background: "#0a1930", padding: "2px 6px", borderRadius: 4, color: "#1DB954", fontSize: 12 }}>jime</code>{" "}
        en el teclado.
      </p>

      <textarea
        style={{
          background: "#0a1930",
          border: `2px solid ${isDirty ? "#1DB954" : "#1a3a6e"}`,
          borderRadius: 12,
          padding: "16px",
          color: "#cde",
          fontSize: 15,
          lineHeight: 1.8,
          outline: "none",
          resize: "vertical",
          minHeight: 320,
          fontFamily: "var(--font-nunito)",
          transition: "border-color 0.2s",
        }}
        value={texto}
        onChange={e => { setTexto(e.target.value); setSaved(false); }}
        placeholder={"Querida Jimena,\n\n..."}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          style={{
            background: "linear-gradient(to right,#0d2a5e,#15306a)",
            border: "2px solid #1DB954",
            borderRadius: 10,
            color: "#1DB954",
            fontWeight: 700,
            fontSize: 13,
            padding: "10px 28px",
            cursor: isDirty ? "pointer" : "default",
            opacity: isDirty ? 1 : 0.5,
            fontFamily: "var(--font-nunito)",
          }}
          onClick={handleSave}
          disabled={saving || !isDirty}
        >
          {saving ? "Guardando..." : "Guardar carta"}
        </button>

        {saved && (
          <span style={{ fontSize: 13, color: "#1DB954" }}>✓ Guardada</span>
        )}

        {isDirty && !saving && (
          <span style={{ fontSize: 12, color: "#88a" }}>Tenés cambios sin guardar</span>
        )}
      </div>
    </div>
  );
}
