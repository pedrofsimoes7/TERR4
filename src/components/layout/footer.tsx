export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xl font-black tracking-[0.22em]">TERR4</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
            Rooftop tents e outdoor gear para quem quer ir mais longe, com
            conforto, resistência e liberdade.
          </p>
        </div>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} TERR4 Outdoor Gear. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}