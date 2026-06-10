import Link from "next/link";
import Image from "next/image";

const links = [
  { label: "Produtos", href: "/shop" },
  { label: "Sobre", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacto", href: "/contact" },
];

const policyLinks = [
  { label: "Termos de Uso", href: "/terms" },
  { label: "Política de Privacidade", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="bg-[#070706] px-6 pb-10 pt-14 text-[#c8c4be]">
      <div className="mx-auto max-w-7xl border-t border-white/8 pt-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_150px_220px_200px]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex">
              <Image
                src="/images/terr4-logo-assets/terr4-logo-white-transparent.png"
                alt="TERR4 Outdoor Gear"
                width={150}
                height={50}
                className="h-12 w-auto opacity-95"
              />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-[#c8c4be]/45">
              Rooftop tents e outdoor gear para quem quer ir mais longe, com
              conforto, resistência e liberdade.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="mb-4 text-[9px] font-black uppercase tracking-[0.35em] text-white/22">
              Navegação
            </p>

            <nav className="flex flex-col gap-2.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#c8c4be]/45 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Policies */}
          <div>
            <p className="mb-4 text-[9px] font-black uppercase tracking-[0.35em] text-white/22">
              Políticas
            </p>

            <nav className="flex flex-col gap-2.5">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#c8c4be]/45 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-[9px] font-black uppercase tracking-[0.35em] text-white/22">
              Contacto
            </p>

            <a
              href="mailto:terr4geral@gmail.com"
              className="text-sm text-[#c8c4be]/45 transition-colors duration-200 hover:text-white"
            >
              terr4geral@gmail.com
            </a>

            <div className="mt-5">
              <Link
                href="/contact"
                className="btn-wipe inline-flex h-9 items-center justify-center rounded-full bg-[#f4efe4] px-5 text-[10px] font-black uppercase tracking-[0.12em] text-neutral-950 transition hover:bg-white"
              >
                Falar connosco
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-2 border-t border-white/6 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#c8c4be]/25">
            © {new Date().getFullYear()} TERR4 Outdoor Gear. Todos os direitos
            reservados.
          </p>

          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c8c4be]/18">
            Built in Portugal
          </p>
        </div>
      </div>
    </footer>
  );
}