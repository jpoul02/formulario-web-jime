"use client";
import { useEffect, useMemo, useRef } from "react";
import CPCard from "./CPCard";

interface StepProfileProps {
  name: string;
  profilePhotoFile: File | null;
  onNameChange: (v: string) => void;
  onPhotoChange: (f: File) => void;
}

export default function StepProfile({ name, profilePhotoFile, onNameChange, onPhotoChange }: StepProfileProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => {
    if (!profilePhotoFile) return null;
    return URL.createObjectURL(profilePhotoFile);
  }, [profilePhotoFile]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <CPCard step="01" title="tu perfil">
      <div className="flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-lg hover:scale-105 transition-transform"
        >
          <div className="w-full h-full rounded-full border-[3px] border-white bg-cp-sky overflow-hidden flex items-center justify-center text-5xl">
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : "🐧"}
          </div>
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) onPhotoChange(e.target.files[0]); }} />
        <p className="font-vt text-lg text-blue-400">click para subir tu foto</p>

        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="tu nombre o nickname..."
          className="w-full border-b-2 border-cp-blue bg-transparent text-center font-nunito font-bold text-cp-navy text-lg outline-none py-2 placeholder-blue-300"
        />
      </div>
    </CPCard>
  );
}
