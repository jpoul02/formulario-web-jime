"use client";
import { useState } from "react";
import { deleteAnswer } from "@/lib/api";
import { toast } from "sonner";

export default function AnswerDeleteButton({ answerId, onDeleted }: { answerId: number; onDeleted: () => void }) {
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteAnswer(answerId);
      toast.success("respuesta eliminada");
      onDeleted();
    } catch {
      toast.error("error al eliminar");
      setDeleting(false);
      setConfirm(false);
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2 mt-1">
        <span className="font-nunito text-xs text-red-400">¿eliminar esta respuesta?</span>
        <button
          onClick={() => setConfirm(false)}
          className="font-nunito text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          cancelar
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="font-nunito text-xs font-bold text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
        >
          {deleting ? "eliminando..." : "eliminar"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 text-xs font-nunito mt-1"
      title="Eliminar respuesta"
    >
      🗑️
    </button>
  );
}
