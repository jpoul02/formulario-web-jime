import CPCard from "./CPCard";

export default function StepVideoPrep() {
  return (
    <CPCard step="03" title="preparate para el video">
      <div className="text-center mb-5">
        <div className="text-5xl mb-3">🎬</div>
        <p className="font-vt text-xl text-cp-dark-blue leading-snug">
          en el siguiente paso vas a poder subir un video especial para Jime
        </p>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-start gap-3 bg-cp-sky-light border-2 border-cp-sky rounded-xl px-4 py-3">
          <span className="text-xl">⏱️</span>
          <div>
            <p className="font-bold text-cp-navy text-sm font-nunito">máx 1 minuto 30 segundos</p>
            <p className="text-blue-400 text-xs font-nunito">corto y especial, eso es lo que importa</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-cp-sky-light border-2 border-cp-sky rounded-xl px-4 py-3">
          <span className="text-xl">📱</span>
          <div>
            <p className="font-bold text-cp-navy text-sm font-nunito">filmalo en vertical</p>
            <p className="text-blue-400 text-xs font-nunito">modo reels/stories, queda mejor</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-cp-sky-light border-2 border-cp-sky rounded-xl px-4 py-3">
          <span className="text-xl">💬</span>
          <div>
            <p className="font-bold text-cp-navy text-sm font-nunito">¿qué poner?</p>
            <p className="text-blue-400 text-xs font-nunito">decirle algo, cantar, mostrar algo gracioso — lo que salga del corazón</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-bold text-cp-navy text-sm font-nunito">si no tenés uno listo</p>
            <p className="text-blue-400 text-xs font-nunito">no hay problema — podés saltar este paso y enviar tu postal igual</p>
          </div>
        </div>
      </div>

      <p className="text-center font-vt text-lg text-blue-400">
        ¿listo? dale siguiente →
      </p>
    </CPCard>
  );
}
