import Link from "next/link";
import HistoriaAdmin from "@/components/HistoriaAdmin";

export default function AdminHistoriaPage() {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-cp-dark-blue to-cp-blue rounded-2xl border-[3px] border-cp-blue shadow-cp p-5 text-center mb-8">
          <p className="font-pixel text-[9px] text-white leading-loose">admin · historia ★</p>
          <p className="font-vt text-xl text-blue-200">gestionar slides &amp; momentos 📖</p>
        </div>

        <HistoriaAdmin />

        <div className="mt-8 text-center">
          <Link href="/admin" className="font-vt text-base text-blue-400 hover:text-blue-200 transition-colors">
            ← volver al admin
          </Link>
        </div>
      </div>
    </main>
  );
}
