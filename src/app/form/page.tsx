"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StepProfile from "@/components/StepProfile";
import StepQuestions from "@/components/StepQuestions";
import StepVideo from "@/components/StepVideo";
import StepPhotos from "@/components/StepPhotos";
import { submitPostal } from "@/lib/api";
import type { FormState } from "@/types";

const TOTAL_STEPS = 4;

export default function FormPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState<FormState>({
    name: "",
    profilePhotoFile: null,
    answers: [],
    videoFile: null,
    photoFiles: [],
    shownQuestionIds: [],
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function canAdvance() {
    if (step === 1) return state.name.trim().length > 0;
    if (step === 2) return state.answers.some((a) => a.answer_text.trim().length > 0);
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const postal = await submitPostal(state);
      router.push(`/galeria/${postal.id}`);
    } catch {
      alert("Hubo un error al enviar. Intentá de nuevo.");
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i < step ? "bg-cp-blue" : "bg-blue-100"}`} />
        ))}
      </div>

      {step === 1 && (
        <StepProfile
          name={state.name}
          profilePhotoFile={state.profilePhotoFile}
          onNameChange={(v) => update("name", v)}
          onPhotoChange={(f) => update("profilePhotoFile", f)}
        />
      )}
      {step === 2 && (
        <StepQuestions
          answers={state.answers}
          onAnswersChange={(a) => update("answers", a)}
          shownQuestionIds={state.shownQuestionIds}
          onShownIdsChange={(ids) => update("shownQuestionIds", ids)}
        />
      )}
      {step === 3 && (
        <StepVideo
          videoFile={state.videoFile}
          onVideoChange={(f) => update("videoFile", f)}
        />
      )}
      {step === 4 && (
        <StepPhotos
          photoFiles={state.photoFiles}
          onPhotosChange={(files) => update("photoFiles", files)}
        />
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-4">
        {step > 1 && (
          <button onClick={() => setStep((s) => s - 1)}
            className="flex-1 py-3 border-[3px] border-cp-blue rounded-xl font-pixel text-[7px] text-cp-dark-blue hover:bg-cp-sky transition-colors">
            ← atrás
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="flex-1 py-3 bg-gradient-to-r from-cp-dark-blue to-cp-blue text-white rounded-xl font-pixel text-[7px] shadow-cp disabled:opacity-40 hover:-translate-y-0.5 transition-all"
          >
            siguiente →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 bg-gradient-to-r from-cp-dark-blue to-cp-blue text-white rounded-xl font-pixel text-[7px] shadow-cp disabled:opacity-40 hover:-translate-y-0.5 transition-all"
          >
            {submitting ? "enviando..." : "🐧 enviar postal"}
          </button>
        )}
      </div>
    </main>
  );
}
