import { getPostales } from "@/lib/api";
import PolaroidCard from "@/components/PolaroidCard";
import Link from "next/link";

export default async function GaleriaPage() {
  const postales = await getPostales();

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-cp-dark-blue to-cp-blue rounded-2xl border-[3px] border-cp-blue shadow-cp p-5 text-center mb-8">
          <p className="font-pixel text-[9px] text-white leading-loose">postales para jime ❄</p>
          <p className="font-vt text-xl text-blue-200">{postales.length} persona{postales.length !== 1 ? "s" : ""} la quieren 💙</p>
        </div>

        {postales.length === 0 ? (
          <p className="text-center font-vt text-2xl text-blue-400">aún no hay postales · sé el primero 🐧</p>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {postales.map((p, i) => <PolaroidCard key={p.id} postal={p} index={i} />)}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/form" className="inline-block bg-cp-blue text-white font-nunito font-black text-lg px-8 py-4 rounded-xl shadow-cp hover:-translate-y-0.5 transition-all">
            💌 dejar mi postal
          </Link>
        </div>
      </div>
    </main>
  );
}
