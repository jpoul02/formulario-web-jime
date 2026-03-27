import Link from "next/link";

export default function LandingPage() {
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
          className="block text-center bg-gradient-to-r from-cp-dark-blue to-cp-blue text-white font-pixel text-[8px] py-4 rounded-xl shadow-cp hover:-translate-y-1 hover:shadow-cp-hover transition-all border-[2px] border-cp-navy"
        >
          💌 dejar mi postal
        </Link>
        <Link
          href="/galeria"
          className="block text-center bg-white text-cp-dark-blue font-pixel text-[8px] py-4 rounded-xl shadow-cp hover:-translate-y-1 transition-all border-[3px] border-cp-blue"
        >
          🖼️ ver postales
        </Link>
      </div>

      <p className="font-vt text-lg text-blue-400 mt-8">hecho con ♡ · 2025</p>
    </main>
  );
}
