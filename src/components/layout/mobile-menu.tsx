"use client";

import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type NavItem = {
  label: string;
  href: string;
};

const navNumbers = ["01", "02", "03", "04"];

export function MobileMenu({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Trigger */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.92 }}
        className="relative z-[90] flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white backdrop-blur"
        aria-label="Abrir menu"
      >
        <Menu size={18} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[79] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed inset-0 z-[80] flex flex-col overflow-y-auto overscroll-contain bg-[#070706] text-white"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Background grain texture */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,.5) 0 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }} />

              {/* Rust accent */}
              <div className="pointer-events-none absolute bottom-0 left-0 h-[50%] w-[60%]"
                style={{ background: "radial-gradient(ellipse at bottom left, rgba(196,106,45,0.15) 0%, transparent 65%)" }} />

              {/* Header */}
              <div className="relative flex items-center justify-between border-b border-white/8 px-6 py-5">
                <Link href="/" onClick={() => setOpen(false)}>
                  <Image
                    src="/images/terr4-logo-assets/terr4-logo-white-transparent.png"
                    alt="TERR4"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </Link>

                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  whileTap={{ scale: 0.9, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white"
                  aria-label="Fechar menu"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Nav links */}
              <nav className="relative flex flex-1 flex-col justify-center px-8">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between border-b border-white/8 py-5"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="text-[10px] font-black tabular-nums text-white/20">
                          {navNumbers[i]}
                        </span>
                        <span className="text-[2.2rem] font-black leading-none tracking-[-0.03em] text-white transition-colors duration-200 group-hover:text-[#f4efe4]">
                          {item.label}
                        </span>
                      </div>
                      <motion.div
                        className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/30"
                        whileHover={{ scale: 1.1, borderColor: "rgba(255,255,255,0.3)" }}
                      >
                        <ArrowUpRight size={15} />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom CTA */}
              <motion.div
                className="relative border-t border-white/8 p-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.38 }}
              >
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="btn-wipe group flex h-13 items-center justify-center gap-2 rounded-full bg-[#f4efe4] px-6 text-sm font-black uppercase tracking-[0.12em] text-neutral-950 transition hover:bg-white active:scale-[0.97]"
                >
                  Falar connosco
                  <ArrowUpRight size={14} className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <p className="mt-4 text-center text-[10px] font-black uppercase tracking-[0.32em] text-white/18">
                  TERR4 · Outdoor Gear · Portugal
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}