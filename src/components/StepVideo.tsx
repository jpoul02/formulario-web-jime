"use client";
import { useRef, useState } from "react";
import CPCard from "./CPCard";

const MAX_DURATION_S = 90;

interface StepVideoProps {
  videoFile: File | null;
  onVideoChange: (f: File | null) => void;
}

export default function StepVideo({ videoFile, onVideoChange }: StepVideoProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function handleFile(file: File) {
    setError("");
    const url = URL.createObjectURL(file);
    const vid = document.createElement("video");
    vid.src = url;
    vid.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      if (vid.duration > MAX_DURATION_S) {
        setError(`El video no puede durar más de 1:30 (duración: ${Math.round(vid.duration)}s)`);
        onVideoChange(null);
      } else {
        onVideoChange(file);
      }
    };
  }

  return (
    <CPCard step="03" title="tu video para ella">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-[3px] border-dashed border-cp-blue rounded-xl p-8 text-center cursor-pointer hover:bg-cp-sky transition-colors"
      >
        {videoFile ? (
          <>
            <div className="text-4xl mb-2">🎬</div>
            <p className="font-vt text-xl text-cp-dark-blue">{videoFile.name}</p>
            <p className="text-sm text-blue-400 mt-1">click para cambiar</p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-2">🎬</div>
            <p className="font-nunito font-black text-lg text-cp-dark-blue">subí tu video para Jime</p>
            <p className="font-nunito text-sm text-blue-500 mt-2 leading-relaxed">
              de tu cara deseándole feliz cumpleaños o diciéndole algo especial
            </p>
            <p className="font-nunito text-sm text-blue-400 mt-1">
              MP4 / MOV · máx 1:30 min · de preferencia horizontal
            </p>
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2 font-nunito">{error}</p>}
      <input ref={inputRef} type="file" accept="video/mp4,video/quicktime" className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
    </CPCard>
  );
}
