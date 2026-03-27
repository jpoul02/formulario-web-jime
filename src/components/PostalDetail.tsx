import type { PostalDetail } from "@/types";

export default function PostalDetailView({ postal }: { postal: PostalDetail }) {
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
          <p className="font-nunito font-black text-cp-navy text-xl">{postal.name}</p>
          <p className="font-vt text-lg text-blue-400">
            {new Date(postal.created_at).toLocaleDateString("es", { day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      {/* Answers (ask.fm style) */}
      {postal.answers.length > 0 && (
        <div className="bg-white border-[3px] border-cp-blue rounded-2xl shadow-cp overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-cp-dark-blue to-cp-blue px-4 py-2">
            <span className="font-pixel text-[7px] text-white">respuestas</span>
          </div>
          <div className="p-4">
            {postal.answers.map((a) => (
              <div key={a.id} className="mb-4">
                <div className="bg-gradient-to-r from-cp-navy to-cp-dark-blue rounded-t-xl px-4 py-3">
                  <p className="text-white text-sm font-bold leading-snug">💬 {a.question.text}</p>
                </div>
                <div className="border-2 border-cp-blue border-t-0 rounded-b-xl px-4 py-3">
                  <p className="font-nunito text-sm text-blue-900 whitespace-pre-wrap">{a.answer_text}</p>
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
            <span className="font-pixel text-[7px] text-white">fotos</span>
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
            <span className="font-pixel text-[7px] text-white">video</span>
          </div>
          <div className="p-3">
            <video src={postal.video_url} controls className="w-full rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
