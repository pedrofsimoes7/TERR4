import Link from "next/link";
import { CartLink } from "@/components/layout/cart-link";
import { MobileMenu } from "@/components/layout/mobile-menu";

const nav = [
  { label: "Produtos", href: "/shop" },
  { label: "Sobre", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacto", href: "/contact" },
];

export function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-neutral-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-black tracking-[0.22em] text-white"
        >
          TERR4
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/65 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
            <Link
                href="/cart"
                className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white hover:text-neutral-950"
                aria-label="Carrinho"
            >
                <CartLink />
            </Link>
          <Link
            href="/contact"
            className="hidden rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-neutral-950 sm:inline-flex"
          >
            Falar connosco
          </Link>

          <MobileMenu nav={nav} />
        </div>
      </div>
    </header>
  );
}