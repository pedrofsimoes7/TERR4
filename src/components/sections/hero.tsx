"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";

function Word({ children, delay }: { children: string; delay: number }) {
  return (
    <motion.span
      className="inline-block mr-[0.18em]"
      initial={{ opacity: 0, y: 48, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.3]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const fade      = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const words1 = ["Built", "to", "sleep"];
  const words2 = ["where", "the", "road"];
  const words3 = ["ends."];

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-[#070706] text-white">

      {/* Parallax bg */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale, opacity: bgOpacity }}>
        <Image src="/images/foto_main2.jpeg" alt="TERR4" fill priority className="object-cover" />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070706] via-[#070706]/20 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[60%] w-[55%]"
        style={{ background: "radial-gradient(ellipse at bottom left, rgba(196,106,45,0.22) 0%, transparent 65%)" }} />

      {/* Content */}
      <motion.div style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-14 pt-32">

        <div className="grid gap-8 lg:grid-cols-[1fr_290px] lg:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.15 }}
              className="mb-7 text-[10px] font-black uppercase tracking-[0.48em] text-white/45"
            >
              Rooftop tents&nbsp;&nbsp;·&nbsp;&nbsp;Outdoor gear&nbsp;&nbsp;·&nbsp;&nbsp;Portugal
            </motion.p>

            <h1
              className="text-[4rem] font-black leading-[0.86] tracking-[-0.055em] md:text-[7.6rem]"
              style={{ perspective: "800px" }}
            >
              <div>{words1.map((w, i) => <Word key={w} delay={0.3 + i * 0.08}>{w}</Word>)}</div>
              <div>{words2.map((w, i) => <Word key={w} delay={0.58 + i * 0.08}>{w}</Word>)}</div>
              <div>{words3.map((w, i) => <Word key={w} delay={0.86 + i * 0.08}>{w}</Word>)}</div>
            </h1>
          </div>

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, x: 20, filter: "blur(12px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* <div className="rounded-2xl border border-white/10 bg-black/50 p-5 backdrop-blur-2xl
              transition-all duration-500 hover:border-white/18 hover:shadow-[0_0_48px_rgba(196,106,45,0.14)]">
              <p className="text-sm leading-[1.8] text-white/58">
                Equipamento premium para transformar qualquer veículo numa base confortável e pronta para aventura.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <CTALink href="/shop" primary>Explorar produtos</CTALink>
                <CTALink href="/contact">Pedir informação</CTALink>
              </div>
            </div> */}
            <div className="max-w-[300px] border-l border-white/15 pl-5">
              <p className="text-sm leading-[1.8] text-white/62">
                Equipamento premium para transformar qualquer veículo numa base confortável e pronta para aventura.
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <CTALink href="/shop" primary>
                  Explorar produtos
                </CTALink>

                <CTALink href="/contact">
                  Pedir informação
                </CTALink>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          className="mt-10 flex items-center justify-between border-t border-white/8 pt-5
            text-[9px] font-black uppercase tracking-[0.38em] text-white/28"
        >
          <span>Portugal</span>
          <span className="hidden md:block">Rooftop Tents</span>
          <span className="hidden md:block">Outdoor Gear</span>
          <motion.span className="flex items-center gap-1.5 text-white/45"
            animate={{ y: [0, 5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
            Scroll <ArrowDown size={11} />
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function CTALink({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <Link href={href}
      className={`btn-wipe group flex h-11 items-center justify-center gap-2 rounded-full px-5
        text-[11px] font-black uppercase tracking-[0.12em] transition duration-300
        hover:-translate-y-0.5 active:scale-[0.97]
        ${primary
          ? "bg-[#f4efe4] text-neutral-950 hover:bg-white"
          : "border border-white/15 bg-white/[0.06] text-white hover:bg-white/12"
        }`}
    >
      {children}
      <ArrowUpRight size={12} className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}