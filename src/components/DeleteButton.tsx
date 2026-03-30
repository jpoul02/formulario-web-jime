"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePostal } from "@/lib/api";
import { toast } from "sonner";

const SECRET_PIN = "2803"; // mismo PIN que la galería

export default function DeleteButton({ postalId }: { postalId: number }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (pin !== SECRET_PIN) {
      setError(true);
      setPin("");
      return;
    }
    setDeleting(true);
    try {
      await deletePostal(postalId);
      toast.success("postal eliminada");
      router.push("/galeria");
      router.refresh();
    } catch {
      toast.error("error al eliminar");
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => { setShowConfirm(true); setPin(""); setError(false); }}
        className="flex items-center gap-2 px-4 py-2 border-2 border-red-300 text-red-500 rounded-xl font-nunito font-bold text-sm hover:bg-red-50 transition-colors"
      >
        🗑️ eliminar postal
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 border-[3px] border-red-400 shadow-cp w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
            <p className="font-nunito font-black text-red-500 text-lg text-center mb-1">¿eliminar postal?</p>
            <p className="font-nunito text-sm text-gray-500 text-center mb-4">ingresá el pin para confirmar</p>

            <input
              autoFocus
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleDelete()}
              maxLength={4}
              placeholder="• • • •"
              className="w-full text-center text-2xl font-bold tracking-[0.5em] border-[3px] border-red-300 rounded-xl py-3 outline-none font-nunito text-red-600"
            />

            {error && <p className="text-red-500 text-sm font-nunito text-center mt-2">pin incorrecto 🚫</p>}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border-[3px] border-cp-blue rounded-xl font-nunito font-bold text-base text-cp-dark-blue hover:bg-cp-sky transition-colors"
              >
                cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={pin.length < 4 || deleting}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-nunito font-bold text-base disabled:opacity-40 hover:bg-red-600 transition-colors"
              >
                {deleting ? "eliminando..." : "eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
