"use client";
import { useRef } from "react";
import CPCard from "./CPCard";

const MAX_PHOTOS = 6;

interface StepPhotosProps {
  photoFiles: File[];
  onPhotosChange: (files: File[]) => void;
  disabled?: boolean;
}

export default function StepPhotos({ photoFiles, onPhotosChange, disabled = false }: StepPhotosProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(newFiles: FileList) {
    const arr = Array.from(newFiles);
    const combined = [...photoFiles, ...arr].slice(0, MAX_PHOTOS);
    onPhotosChange(combined);
  }

  function removePhoto(index: number) {
    if (disabled) return;
    onPhotosChange(photoFiles.filter((_, i) => i !== index));
  }

  return (
    <CPCard step="04" title="fotos con jime">
      <div className="grid grid-cols-3 gap-1">
        {photoFiles.map((f, i) => (
          <div key={i} className="relative aspect-square">
            <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover rounded-lg border-2 border-cp-blue" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              disabled={disabled}
              className="absolute top-1 right-1 bg-white rounded-full w-7 h-7 text-sm font-bold flex items-center justify-center shadow-md border border-gray-200 hover:bg-red-50 hover:text-red-500 transition-colors"
            >✕</button>
          </div>
        ))}
        {photoFiles.length < MAX_PHOTOS && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="aspect-square border-[2px] border-dashed border-cp-blue rounded-lg flex items-center justify-center text-2xl text-cp-blue hover:bg-cp-sky transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >+</button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        disabled={disabled}
        onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }} />
    </CPCard>
  );
}
