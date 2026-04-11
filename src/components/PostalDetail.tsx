"use client";
import { useRef, useState } from "react";
import type { PostalDetail, AnswerOut, AnswerMedia } from "@/types";
import DeleteButton from "./DeleteButton";
import AnswerDeleteButton from "./AnswerDeleteButton";
import { patchAnswerText, addAnswerMedia, deleteAnswerMedia, deletePostalPhoto } from "@/lib/api";

// ── Inline answer editor ───────────────────────────────────────────────────

function AnswerEditor({ answer, onClose }: { answer: AnswerOut; onClose: (updated: AnswerOut) => void }) {
  const [text, setText] = useState(answer.answer_text);
  const [media, setMedia] = useState<AnswerMedia[]>(answer.media);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSaveText() {
    if (!text.trim() || text === answer.answer_text) return;
    setSaving(true);
    try {
      await patchAnswerText(answer.id, text.trim());
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(files: FileList) {
    setUploading(true);
    try {
      const uploaded: AnswerMedia[] = [];
      for (const file of Array.from(files)) {
        const m = await addAnswerMedia(answer.id, file);
        uploaded.push(m);
      }
      setMedia((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDeleteMedia(mediaId: number) {
    await deleteAnswerMedia(answer.id, mediaId);
    setMedia((prev) => prev.filter((m) => m.id !== mediaId));
  }

  function handleDone() {
    onClose({ ...answer, answer_text: text.trim(), media });
  }

  return (
    <div className="border-2 border-cp-blue border-t-0 rounded-b-xl bg-blue-50 p-3 flex flex-col gap-3">
      {/* Text editor */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSaveText}
        rows={3}
        className="w-full px-3 py-2 text-sm text-blue-900 border-2 border-cp-blue rounded-xl font-nunito resize-none outline-none focus:ring-2 focus:ring-cp-blue/30"
      />
      {saving && <p className="text-xs text-blue-400 font-nunito">guardando...</p>}

      {/* Existing media */}
      {media.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {media.map((m) => (
            <div key={m.id} className="relative">
              {m.media_type === "video" ? (
                <video src={m.media_url} className="w-20 h-20 object-cover rounded-lg border-2 border-cp-blue" />
              ) : (
                <img src={m.media_url} alt="" className="w-20 h-20 object-cover rounded-lg border-2 border-cp-blue" />
              )}
              <button
                type="button"
                onClick={() => handleDeleteMedia(m.id)}
                className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow hover:bg-red-50 hover:text-red-500 transition-colors"
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Upload + done row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-cp-blue font-nunito font-bold transition-colors disabled:opacity-50"
        >
          <span className="text-base">📎</span>
          {uploading ? "subiendo..." : "adjuntar foto/video"}
        </button>
        <span className="flex-1" />
        <button
          type="button"
          onClick={handleDone}
          className="px-4 py-1.5 bg-cp-blue text-white text-xs font-nunito font-bold rounded-full hover:bg-cp-dark-blue transition-colors"
        >
          listo ✓
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files) handleUpload(e.target.files); }}
      />
    </div>
  );
}

// ── Main detail view ───────────────────────────────────────────────────────

export default function PostalDetailView({ postal }: { postal: PostalDetail }) {
  const [answers, setAnswers] = useState(postal.answers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [photos, setPhotos] = useState(postal.photos);
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);

  function removeAnswer(id: number) {
    setAnswers((prev) => prev.filter((a) => a.id !== id));
  }

  function updateAnswer(updated: AnswerOut) {
    setAnswers((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setEditingId(null);
  }

  async function handleDeletePhoto(photoId: number) {
    setDeletingPhotoId(photoId);
    try {
      await deletePostalPhoto(postal.id, photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } finally {
      setDeletingPhotoId(null);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Profile header (IG style) */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex-shrink-0">
          <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden bg-cp-sky flex items-center justify-center text-4xl">
            {postal.profile_photo_url ? (
              <img src={postal.profile_photo_url} alt="" className="w-full h-full object-cover" />
            ) : "🐧"}
          </div>
        </div>
        <div>
          <p className="font-nunito font-black text-cp-navy text-2xl">{postal.name}</p>
          <p className="font-vt text-xl text-blue-400">
            {new Date(postal.created_at).toLocaleDateString("es", { day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      {/* Dedicatoria */}
      {postal.dedicatoria && (
        <div className="bg-white border-[3px] border-cp-blue rounded-2xl shadow-cp overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-cp-dark-blue to-cp-blue px-4 py-2">
            <span className="font-nunito font-bold text-sm text-white">✍️ dedicatoria</span>
          </div>
          <div className="px-5 py-4">
            <p className="font-nunito text-base text-blue-900 whitespace-pre-wrap leading-relaxed">{postal.dedicatoria}</p>
          </div>
        </div>
      )}

      {/* Answers */}
      {answers.length > 0 && (
        <div className="bg-white border-[3px] border-cp-blue rounded-2xl shadow-cp overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-cp-dark-blue to-cp-blue px-4 py-2">
            <span className="font-nunito font-bold text-sm text-white">💬 respuestas ({answers.length})</span>
          </div>
          <div className="p-4">
            {answers.map((a) => (
              <div key={a.id} className="mb-4 group">
                {/* Question bar */}
                <div className="bg-gradient-to-r from-cp-navy to-cp-dark-blue rounded-t-xl px-4 py-3">
                  <p className="text-white text-sm font-bold leading-snug">💬 {a.question.text}</p>
                </div>

                {editingId === a.id ? (
                  <AnswerEditor answer={a} onClose={updateAnswer} />
                ) : (
                  <div className="border-2 border-cp-blue border-t-0 rounded-b-xl px-4 py-3">
                    <p className="font-nunito text-base text-blue-900 whitespace-pre-wrap">{a.answer_text}</p>

                    {/* Existing media */}
                    {a.media.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {a.media.map((m) =>
                          m.media_type === "video" ? (
                            <video key={m.id} src={m.media_url} controls className="max-w-full rounded-lg border-2 border-cp-blue mt-1" />
                          ) : (
                            <img key={m.id} src={m.media_url} alt="" className="w-24 h-24 object-cover rounded-lg border-2 border-cp-blue" />
                          )
                        )}
                      </div>
                    )}

                    {/* Action row */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(a.id)}
                        className="text-xs text-blue-400 hover:text-cp-blue font-nunito font-bold transition-colors"
                      >
                        ✏️ editar
                      </button>
                      <AnswerDeleteButton answerId={a.id} onDeleted={() => removeAnswer(a.id)} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <div className="bg-white border-[3px] border-cp-blue rounded-2xl shadow-cp overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-cp-dark-blue to-cp-blue px-4 py-2">
            <span className="font-nunito font-bold text-sm text-white">📸 fotos ({photos.length})</span>
          </div>
          <div className="grid grid-cols-3 gap-[2px] p-[2px]">
            {photos.map((p) => (
              <div key={p.id} className="aspect-square relative group">
                <img src={p.photo_url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(p.id)}
                  disabled={deletingPhotoId === p.id}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60"
                  title="Eliminar foto"
                >
                  {deletingPhotoId === p.id ? "…" : "✕"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video */}
      {postal.video_url && (
        <div className="bg-white border-[3px] border-cp-blue rounded-2xl shadow-cp overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-cp-dark-blue to-cp-blue px-4 py-2">
            <span className="font-nunito font-bold text-sm text-white">🎬 video</span>
          </div>
          <div className="p-3">
            <video src={postal.video_url} controls className="w-full rounded-xl" />
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <DeleteButton postalId={postal.id} />
      </div>
    </div>
  );
}
