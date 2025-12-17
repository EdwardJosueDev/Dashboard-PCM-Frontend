export default function GobContentHeader() {
  return (
    <header className="w-full h-20 px-6 md:px-12 flex items-center justify-between bg-white border-b border-[hsl(var(--border))] font-headlines">
      <img
        src="/images/logo.svg"
        alt="Gob.pe"
        className="h-9"
      />

      <div className="h-full flex items-center">
        <img
          src="/images/recurso_1.svg"
          alt="Banner institucional"
          className="h-full object-contain"
        />
      </div>
    </header>
  );
}
