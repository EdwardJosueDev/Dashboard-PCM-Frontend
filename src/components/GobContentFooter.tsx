export default function GobContentFooter() {
  return (
    <footer className="w-full bg-[#33312B] text-white font-roboto">
      {/* Tramado superior */}
      <div
        className="h-8 bg-repeat-x bg-contain"
        style={{ backgroundImage: "url('/images/tramado-up.svg')" }}
      />

      <div className="px-6 md:px-16 py-10 flex flex-col md:flex-row justify-between gap-10">
        {/* Columna 1 */}
        <div>
          <h3 className="mb-3 text-gob-title font-bold uppercase">
            Sobre el Estado Peruano
          </h3>
          <ul className="text-gob-text font-normal opacity-90">
            <li>El Estado Peruano</li>
            <li>¿Qué es Gob.pe?</li>
            <li>Política de privacidad</li>
          </ul>
        </div>

        {/* Columna 2 */}
        <div>
          <h3 className="mb-3 text-gob-title font-bold uppercase">
            Síguenos
          </h3>
          <div className="flex gap-5 text-gob-text font-normal opacity-90">
            <span>Facebook</span>
            <span>X</span>
          </div>
        </div>

        {/* Columna 3 */}
        <div className="flex items-center gap-3">
          <img
            src="/images/logo-f.svg"
            className="w-14"
            alt="Bicentenario"
          />
          <div className="text-gob-text font-normal leading-[20px]">
            <span>Bicentenario</span>
            <br />
            <span>Perú</span>
            <br />
            <strong className="font-bold">2024</strong>
          </div>
        </div>
      </div>

      {/* Tramado inferior */}
      <div
        className="h-8 bg-repeat-x bg-contain"
        style={{ backgroundImage: "url('/images/tramado-down.svg')" }}
      />
    </footer>
  );
}
