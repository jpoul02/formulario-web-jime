import CPCard from "./CPCard";

export default function StepOverview() {
  return (
    <CPCard title="antes de empezar 🐧">
      <div className="mb-5 text-center">
        <p className="font-nunito text-base text-blue-700 leading-relaxed">
          Este formulario es para dejarle un mensaje especial a Jime 💙
          <br />
          <span className="font-bold">Todo es opcional</span> — poné lo que sientas, saltá lo que no tengas.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 bg-cp-sky-light border-2 border-cp-sky rounded-xl px-4 py-3">
          <span className="text-2xl">🐧</span>
          <div>
            <p className="font-nunito font-black text-cp-navy text-base">tu perfil y dedicatoria</p>
            <p className="font-nunito text-sm text-blue-500">tu foto, nombre y un mensaje especial para Jime</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-cp-sky-light border-2 border-cp-sky rounded-xl px-4 py-3">
          <span className="text-2xl">💬</span>
          <div>
            <p className="font-nunito font-black text-cp-navy text-base">preguntas divertidas</p>
            <p className="font-nunito text-sm text-blue-500">respondé las que quieras, ignorá las que no</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-cp-sky-light border-2 border-cp-sky rounded-xl px-4 py-3">
          <span className="text-2xl">🎬</span>
          <div>
            <p className="font-nunito font-black text-cp-navy text-base">un video corto</p>
            <p className="font-nunito text-sm text-blue-500">
              de tu cara diciéndole feliz cumpleaños · máx 1:30 min · de preferencia horizontal
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-cp-sky-light border-2 border-cp-sky rounded-xl px-4 py-3">
          <span className="text-2xl">📸</span>
          <div>
            <p className="font-nunito font-black text-cp-navy text-base">fotos juntos</p>
            <p className="font-nunito text-sm text-blue-500">fotos de recuerdos o momentos con ella (máx 6)</p>
          </div>
        </div>
      </div>

      <p className="text-center font-nunito font-bold text-base text-blue-400 mt-5">
        ¿listo? dale siguiente →
      </p>
    </CPCard>
  );
}
