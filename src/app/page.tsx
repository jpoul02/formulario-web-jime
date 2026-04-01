"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ← cambiá este PIN cuando quieras
const SECRET_PIN = "2803";

export default function LandingPage() {
  const router = useRouter();
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handlePinSubmit() {
    if (pin === SECRET_PIN) {
      router.push("/admin");
    } else {
      setError(true);
      setPin("");
    }
  }

  function openPin() {
    setShowPin(true);
    setPin("");
    setError(false);
  }

  function closePin() {
    setShowPin(false);
    setPin("");
    setError(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-gradient-to-r from-cp-dark-blue to-cp-blue rounded-2xl border-[3px] border-cp-blue shadow-cp p-6 text-center mb-6">
        <p className="font-pixel text-[10px] text-white leading-loose tracking-wide">★ FELIZ CUMPLE JIME ★</p>
        <p className="font-vt text-2xl text-blue-200 mt-1">❄ dejá tu postal para ella ❄</p>
      </div>

      <div className="text-6xl mb-6 animate-bounce">🐧</div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/form"
          className="block text-center bg-gradient-to-r from-cp-dark-blue to-cp-blue text-white font-nunito font-black text-xl py-5 rounded-xl shadow-cp hover:-translate-y-1 hover:shadow-cp-hover transition-all border-[2px] border-cp-navy"
        >
          💌 dejar mi postal
        </Link>
      </div>

      <p className="font-vt text-lg text-blue-400 mt-8">
        hecho con{" "}
        <button
          onClick={openPin}
          className="text-blue-400 hover:text-pink-400 transition-colors cursor-pointer focus:outline-none"
          aria-label="acceso admin"
        >
          ♡
        </button>
        {" "}· 2025
      </p>

      {/* PIN modal */}
      {showPin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={closePin}>
          <div
            className="bg-white rounded-2xl p-6 border-[3px] border-cp-blue shadow-cp w-full max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-pixel text-[9px] text-cp-dark-blue mb-1 text-center">🔐 ingresá el pin</p>
            <p className="font-vt text-base text-blue-400 text-center mb-4">solo para los curiosos</p>

            <input
              autoFocus
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              maxLength={4}
              placeholder="• • • •"
              className="w-full text-center text-2xl font-bold tracking-[0.5em] border-[3px] border-cp-blue rounded-xl py-3 outline-none font-nunito text-cp-navy"
            />

            {error && (
              <p className="text-red-500 text-xs font-nunito text-center mt-2">pin incorrecto 🚫</p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={closePin}
                className="flex-1 py-2 border-[3px] border-cp-blue rounded-xl font-pixel text-[8px] text-cp-dark-blue hover:bg-cp-sky transition-colors"
              >
                cancelar
              </button>
              <button
                onClick={handlePinSubmit}
                disabled={pin.length < 4}
                className="flex-1 py-2 bg-gradient-to-r from-cp-dark-blue to-cp-blue text-white rounded-xl font-pixel text-[8px] shadow-cp disabled:opacity-40"
              >
                entrar →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
