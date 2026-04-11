import { useRef } from "react";

const MAX_MEDIA = 3;

interface AskQuestionProps {
  question: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export default function AskQuestion({ question, value, onChange, onClear, files, onFilesChange }: AskQuestionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(newFiles: FileList) {
    const arr = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    const combined = [...files, ...arr].slice(0, MAX_MEDIA);
    onFilesChange(combined);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="mb-3">
      <div className="bg-gradient-to-r from-cp-navy to-cp-dark-blue rounded-t-xl px-4 py-3 flex items-start justify-between gap-2">
        <p className="text-white text-sm font-bold leading-snug">💬 {question}</p>
        {value.trim() && (
          <button
            type="button"
            onClick={() => { onChange(""); onClear(); }}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 text-white text-xs flex items-center justify-center transition-colors"
            title="borrar respuesta"
          >
            ✕
          </button>
        )}
      </div>

      <div className="border-2 border-cp-blue border-t-0 rounded-b-xl">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="responde aquí... (opcional)"
          rows={3}
          className="w-full px-4 py-3 text-sm text-blue-900 placeholder-blue-300 resize-none outline-none font-nunito"
        />

        {/* Media previews */}
        {files.length > 0 && (
          <div className="flex gap-2 px-3 pb-2 flex-wrap">
            {files.map((f, i) => (
              <div key={i} className="relative w-16 h-16 flex-shrink-0">
                <img
                  src={URL.createObjectURL(f)}
                  alt=""
                  className="w-full h-full object-cover rounded-lg border-2 border-cp-blue"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow hover:bg-red-50 hover:text-red-500 transition-colors"
                >✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        {files.length < MAX_MEDIA && (
          <div className="px-3 pb-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-cp-blue font-nunito font-bold transition-colors"
            >
              <span className="text-base">📷</span>
              adjuntar foto{files.length > 0 ? ` (${files.length}/${MAX_MEDIA})` : ""}
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
      />
    </div>
  );
}
