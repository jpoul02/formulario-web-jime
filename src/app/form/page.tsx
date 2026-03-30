"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import StepOverview from "@/components/StepOverview";
import StepProfile from "@/components/StepProfile";
import StepDedicatoria from "@/components/StepDedicatoria";
import StepQuestions from "@/components/StepQuestions";
import StepVideo from "@/components/StepVideo";
import StepPhotos from "@/components/StepPhotos";
import { submitPostal } from "@/lib/api";
import type { FormState } from "@/types";

const TOTAL_STEPS = 6;

export default function FormPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState<FormState>({
    name: "",
    dedicatoria: "",
    profilePhotoFile: null,
    answers: [],
    videoFile: null,
    photoFiles: [],
    shownQuestionIds: [],
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    const hasFiles = state.profilePhotoFile || state.videoFile || state.photoFiles.length > 0;
    const toastId = toast.loading(
      hasFiles ? "☁️ subiendo archivos... puede tardar un momento" : "📨 enviando postal..."
    );
    try {
      const postal = await submitPostal(state);
      toast.success("🐧 ¡postal enviada! redirigiendo...", { id: toastId, duration: 2000 });
      setTimeout(() => router.push(`/galeria/${postal.id}`), 1200);
    } catch {
      toast.error("❌ hubo un error al enviar. intentá de nuevo.", { id: toastId });
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

      {step === 1 && <StepOverview />}
      {step === 2 && (
        <StepProfile
          name={state.name}
          profilePhotoFile={state.profilePhotoFile}
          onNameChange={(v) => update("name", v)}
          onPhotoChange={(f) => update("profilePhotoFile", f)}
        />
      )}
      {step === 3 && (
        <StepDedicatoria
          dedicatoria={state.dedicatoria}
          onDedicatoriaChange={(v) => update("dedicatoria", v)}
        />
      )}
      {step === 4 && (
        <StepQuestions
          answers={state.answers}
          onAnswersChange={(a) => update("answers", a)}
          shownQuestionIds={state.shownQuestionIds}
          onShownIdsChange={(ids) => update("shownQuestionIds", ids)}
        />
      )}
      {step === 5 && (
        <StepVideo
          videoFile={state.videoFile}
          onVideoChange={(f) => update("videoFile", f)}
        />
      )}
      {step === 6 && (
        <StepPhotos
          photoFiles={state.photoFiles}
          onPhotosChange={(files) => update("photoFiles", files)}
        />
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-4">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 py-4 border-[3px] border-cp-blue rounded-xl font-nunito font-bold text-base text-cp-dark-blue hover:bg-cp-sky transition-colors"
          >
            ← atrás
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 py-4 bg-gradient-to-r from-cp-dark-blue to-cp-blue text-white rounded-xl font-nunito font-bold text-base shadow-cp hover:-translate-y-0.5 transition-all"
          >
            siguiente →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-4 bg-gradient-to-r from-cp-dark-blue to-cp-blue text-white rounded-xl font-nunito font-bold text-base shadow-cp disabled:opacity-40 hover:-translate-y-0.5 transition-all"
          >
            {submitting ? "enviando..." : "🐧 enviar postal"}
          </button>
        )}
      </div>
    </main>
  );
}
