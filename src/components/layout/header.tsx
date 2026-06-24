"use client";

import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CartLink } from "@/components/layout/cart-link";
import { MobileMenu } from "@/components/layout/mobile-menu";

const nav = [
  { label: "Produtos", href: "/shop" },
  { label: "Alugueres", href: "/alugueres" },
  { label: "Galeria", href: "/galeria" },
  { label: "Sobre", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacto", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-40 w-full transition-colors duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-[#070706] md:bg-[#070706]/88 md:backdrop-blur-md"
          : "bg-[#070706] md:bg-transparent"
      }`}
    >
      {/* Faixa que cobre a status bar (notch / relógio) — garante que
          NENHUM conteúdo do site passa por cima do header no iPhone.
          Tem a mesma cor do header e a altura do safe-area. */}
      <div
        className={`w-full ${scrolled ? "" : "md:hidden"} `}
        style={{ height: "env(safe-area-inset-top)" }}
        aria-hidden
      />

      <div className="mx-auto flex h-[5.5rem] max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center">
          <Image
            src="/images/terr4-logo-assets/terr4-logo-beige-transparent.png"
            alt="TERR4"
            width={220}
            height={60}
            priority
            className="h-10 w-auto transition duration-300 group-hover:opacity-80"
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1 backdrop-blur-xl lg:flex">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartLink />

          <Link
            href="/account"
            aria-label="Área de cliente"
            className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white backdrop-blur transition duration-300 hover:bg-white hover:text-neutral-950"
          >
            <User size={17} />
          </Link>

          <Link
            href="/alugueres"
            className="btn-wipe hidden rounded-full bg-[#f4efe4] px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-neutral-950 transition duration-300 hover:bg-white xl:inline-flex"
          >
            Alugar tenda
          </Link>

          <MobileMenu nav={nav} />
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
    >
      {label}
      <motion.span
        className="absolute bottom-1 left-4 right-4 h-px bg-white/60"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </Link>
  );
}