"use client";
import { useState } from "react";
import type { PostalDetail } from "@/types";
import DeleteButton from "./DeleteButton";
import AnswerDeleteButton from "./AnswerDeleteButton";

export default function PostalDetailView({ postal }: { postal: PostalDetail }) {
  const [answers, setAnswers] = useState(postal.answers);

  function removeAnswer(id: number) {
    setAnswers(prev => prev.filter(a => a.id !== id));
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

      {/* Answers (ask.fm style) */}
      {answers.length > 0 && (
        <div className="bg-white border-[3px] border-cp-blue rounded-2xl shadow-cp overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-cp-dark-blue to-cp-blue px-4 py-2">
            <span className="font-nunito font-bold text-sm text-white">💬 respuestas ({answers.length})</span>
          </div>
          <div className="p-4">
            {answers.map((a) => (
              <div key={a.id} className="mb-4 group">
                <div className="bg-gradient-to-r from-cp-navy to-cp-dark-blue rounded-t-xl px-4 py-3">
                  <p className="text-white text-sm font-bold leading-snug">💬 {a.question.text}</p>
                </div>
                <div className="border-2 border-cp-blue border-t-0 rounded-b-xl px-4 py-3">
                  <p className="font-nunito text-base text-blue-900 whitespace-pre-wrap">{a.answer_text}</p>
                  <AnswerDeleteButton answerId={a.id} onDeleted={() => removeAnswer(a.id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos (IG grid) */}
      {postal.photos.length > 0 && (
        <div className="bg-white border-[3px] border-cp-blue rounded-2xl shadow-cp overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-cp-dark-blue to-cp-blue px-4 py-2">
            <span className="font-nunito font-bold text-sm text-white">📸 fotos</span>
          </div>
          <div className="grid grid-cols-3 gap-[2px] p-[2px]">
            {postal.photos.map((p) => (
              <div key={p.id} className="aspect-square">
                <img src={p.photo_url} alt="" className="w-full h-full object-cover" />
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

      {/* Delete button */}
      <div className="mt-8 flex justify-center">
        <DeleteButton postalId={postal.id} />
      </div>
    </div>
  );
}
