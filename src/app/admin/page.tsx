import Link from "next/link";
import { getPostales } from "@/lib/api";

export default async function AdminPage() {
  const postales = await getPostales();

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-cp-dark-blue to-cp-blue rounded-2xl border-[3px] border-cp-blue shadow-cp p-5 text-center mb-8">
          <p className="font-pixel text-[9px] text-white leading-loose">panel de admin ★</p>
          <p className="font-vt text-xl text-blue-200">bienvenida, jime 🐧</p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/galeria"
            className="block bg-gradient-to-r from-cp-dark-blue to-cp-blue rounded-xl border-[2px] border-cp-blue shadow-cp p-5 hover:-translate-y-0.5 transition-all"
          >
            <p className="font-pixel text-[9px] text-blue-300 mb-1">postales</p>
            <p className="font-vt text-2xl text-white">
              💌 Ver postales
              <span className="text-blue-200 text-lg ml-3">({postales.length})</span>
            </p>
          </Link>

          <Link
            href="/admin/musica"
            className="block bg-gradient-to-r from-cp-dark-blue to-cp-blue rounded-xl border-[2px] border-cp-blue shadow-cp p-5 hover:-translate-y-0.5 transition-all"
          >
            <p className="font-pixel text-[9px] text-blue-300 mb-1">música</p>
            <p className="font-vt text-2xl text-white">🎵 Gestionar música</p>
          </Link>

          <Link
            href="/admin/historia"
            className="block bg-gradient-to-r from-cp-dark-blue to-cp-blue rounded-xl border-[2px] border-cp-blue shadow-cp p-5 hover:-translate-y-0.5 transition-all"
          >
            <p className="font-pixel text-[9px] text-blue-300 mb-1">historia</p>
            <p className="font-vt text-2xl text-white">📖 Gestionar historia</p>
          </Link>

          <Link
            href="/admin/carta"
            className="block bg-gradient-to-r from-cp-dark-blue to-cp-blue rounded-xl border-[2px] border-cp-blue shadow-cp p-5 hover:-translate-y-0.5 transition-all"
          >
            <p className="font-pixel text-[9px] text-blue-300 mb-1">carta secreta</p>
            <p className="font-vt text-2xl text-white">💌 Escribir carta</p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="font-vt text-base text-blue-400 hover:text-blue-200 transition-colors">
            ← volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
