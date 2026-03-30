import { useState } from "react";
import CPCard from "./CPCard";

interface StepDedicatoriaProps {
  dedicatoria: string;
  onDedicatoriaChange: (v: string) => void;
}

export default function StepDedicatoria({ dedicatoria, onDedicatoriaChange }: StepDedicatoriaProps) {
  const [local, setLocal] = useState(dedicatoria);

  return (
    <CPCard step="02" title="tu dedicatoria">
      <div className="mb-4 text-center">
        <div className="text-4xl mb-2">✍️</div>
        <p className="font-nunito text-base text-blue-600 leading-relaxed">
          escribile algo especial a Jime — un mensaje del corazón, un recuerdo, lo que sientas
        </p>
      </div>

      <textarea
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => onDedicatoriaChange(local)}
        placeholder="Para Jime... 💙"
        rows={7}
        className="w-full border-[3px] border-cp-blue rounded-xl px-4 py-3 font-nunito text-base text-blue-900 placeholder-blue-300 resize-none outline-none focus:border-cp-dark-blue transition-colors"
      />

      <p className="font-nunito text-sm text-blue-400 mt-2 text-right">
        {local.length > 0 ? `${local.length} caracteres` : "también podés saltear este paso"}
      </p>
    </CPCard>
  );
}
