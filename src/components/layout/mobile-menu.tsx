"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

export function MobileMenu({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] bg-neutral-950 text-white">
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-xl font-black tracking-[0.22em]"
            >
              TERR4
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col px-6 py-10">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-6 text-4xl font-black tracking-tight text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 w-full border-t border-white/10 p-6">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex h-13 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-neutral-950"
            >
              Falar connosco
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}