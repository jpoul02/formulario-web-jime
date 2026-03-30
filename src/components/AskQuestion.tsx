import { useState } from "react";

interface AskQuestionProps {
  question: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function AskQuestion({ question, value, onChange, onClear }: AskQuestionProps) {
  const [local, setLocal] = useState(value);

  function handleClear() {
    setLocal("");
    onClear();
  }

  return (
    <div className="mb-3">
      <div className="bg-gradient-to-r from-cp-navy to-cp-dark-blue rounded-t-xl px-4 py-3 flex items-start justify-between gap-2">
        <p className="text-white text-sm font-bold leading-snug">💬 {question}</p>
        {local.trim() && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 text-white text-xs flex items-center justify-center transition-colors"
            title="borrar respuesta"
          >
            ✕
          </button>
        )}
      </div>
      <div className="border-2 border-cp-blue border-t-0 rounded-b-xl">
        <textarea
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={() => onChange(local)}
          placeholder="responde aquí... (opcional)"
          rows={3}
          className="w-full px-4 py-3 text-sm text-blue-900 placeholder-blue-300 resize-none outline-none rounded-b-xl font-nunito"
        />
      </div>
    </div>
  );
}
