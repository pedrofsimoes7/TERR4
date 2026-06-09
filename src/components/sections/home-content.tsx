// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useRef } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
// import { Hero } from "@/components/sections/hero";
// import { Reveal, StaggerReveal, StaggerItem } from "@/components/motion/reveal";
// import { ProductCard } from "@/components/ui/product-card";
// import type { StoreProduct } from "@/lib/products";

// // ─── Parallax image wrapper ───────────────────────────────────────────────────
// function ParallaxImg({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
//   const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

//   return (
//     <div ref={ref} className={`relative overflow-hidden ${className}`}>
//       <motion.div className="absolute inset-[-15%]" style={{ y }}>
//         <Image src={src} alt={alt} fill className="object-cover" />
//       </motion.div>
//     </div>
//   );
// }

// // ─── Full-bleed product statement ────────────────────────────────────────────
// function ProductStatement() {
//   const ref = useRef<HTMLElement>(null);
//   const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
//   const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);
//   const textY    = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

//   return (
//     <section ref={ref} className="relative min-h-[80vh] overflow-hidden text-white">
//       {/* Full-bleed image */}
//       <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
//         <Image src="/images/terr4/brand-rooftop.jpg" alt="TERR4 Start" fill className="object-cover" />
//       </motion.div>
//       <div className="absolute inset-0 bg-gradient-to-t from-[#070706] via-black/55 to-black/25" />
//       <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-transparent" />

//       {/* Text */}
//       <motion.div style={{ y: textY }}
//         className="relative z-10 flex min-h-[80vh] flex-col justify-end px-6 pb-20 pt-24">
//         <div className="mx-auto w-full max-w-7xl">
//           <Reveal>
//             <p className="text-[10px] font-black uppercase tracking-[0.42em] text-[#a79d8d]">
//               TERR4 Start — Rooftop Tent
//             </p>
//             <h2 className="mt-4 max-w-3xl text-5xl font-black leading-[0.88] tracking-[-0.04em] md:text-8xl">
//               Monta<br />rápido.<br />Dorme<br />melhor.
//             </h2>
//           </Reveal>
//           <Reveal delay={0.15}>
//             <div className="mt-8 flex flex-col gap-3 sm:flex-row">
//               <Link href="/shop/terr4-start"
//                 className="btn-wipe group inline-flex h-12 items-center gap-2 rounded-full
//                   bg-[#f4efe4] px-7 text-xs font-black uppercase tracking-[0.14em]
//                   text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white active:scale-[0.97]">
//                 Ver produto
//                 <ArrowUpRight size={13} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
//               </Link>
//               <Link href="/contact"
//                 className="inline-flex h-12 items-center gap-2 rounded-full border border-white/18
//                   bg-black/30 px-7 text-xs font-black uppercase tracking-[0.14em]
//                   text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-black/50">
//                 Reservar — 1250€
//               </Link>
//             </div>
//           </Reveal>
//         </div>
//       </motion.div>
//     </section>
//   );
// }

// // ─── Numbers ─────────────────────────────────────────────────────────────────
// function Numbers() {
//   const items = [
//     { n: "60", unit: "seg", label: "Montagem", sub: "do fecho à cama" },
//     { n: "2500", unit: "mm", label: "Impermeabilidade", sub: "para qualquer chuva" },
//     { n: "3", unit: "anos", label: "Garantia", sub: "contra defeitos de fabrico" },
//   ];

//   return (
//     <section className="border-y border-white/8 bg-[#070706] text-white">
//       <div className="mx-auto max-w-7xl">
//         <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-white/8">
//           {items.map(({ n, unit, label, sub }, i) => (
//             <motion.div
//               key={label}
//               className="group px-10 py-16 transition-colors duration-500 hover:bg-white/[0.025] md:px-14"
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.4 }}
//               transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <div className="overflow-hidden">
//                 <motion.p
//                   className="font-black leading-[0.85] tracking-[-0.05em] text-white"
//                   style={{ fontSize: "clamp(4.5rem,9vw,8.5rem)" }}
//                   initial={{ y: "100%" }}
//                   whileInView={{ y: "0%" }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.7, delay: i * 0.1 + 0.1, ease: [0.22, 1, 0.36, 1] }}
//                 >
//                   {n}
//                   <span className="ml-2 align-baseline text-[28%] font-black text-white/28">{unit}</span>
//                 </motion.p>
//               </div>
//               <p className="mt-7 text-[10px] font-black uppercase tracking-[0.32em] text-white/55">{label}</p>
//               <p className="mt-1 text-xs text-white/22">{sub}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Image strip ─────────────────────────────────────────────────────────────
// function ImageStrip() {
//   const imgs = [
//     { src: "/images/terr4/brand-install-1.jpg", aspect: "aspect-[3/4]" },
//     { src: "/images/terr4/brand-install-2.jpg", aspect: "aspect-[3/4]" },
//     { src: "/images/warehouse-1.jpg", aspect: "aspect-[4/3]" },
//     { src: "/images/warehouse-2.jpg", aspect: "aspect-[3/4]" },
//   ];

//   return (
//     <section className="overflow-x-auto py-3 no-scrollbar">
//       <div className="flex gap-3 px-6" style={{ width: "max-content" }}>
//         {imgs.map(({ src, aspect }, i) => (
//           <motion.div
//             key={src}
//             className={`relative ${aspect} w-[260px] shrink-0 overflow-hidden rounded-[1.75rem] md:w-[320px]`}
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true, amount: 0.2 }}
//             transition={{ duration: 0.65, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
//             whileHover={{ scale: 1.025, transition: { duration: 0.4 } }}
//           >
//             <Image src={src} alt="TERR4" fill className="object-cover" />
//             <div className="absolute inset-0 bg-black/15 transition-opacity duration-300 hover:opacity-0" />
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }

// // ─── Feature beige ───────────────────────────────────────────────────────────
// function FeatureSection() {
//   const ref = useRef<HTMLElement>(null);
//   const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
//   const imgX = useTransform(scrollYProgress, [0, 1], ["-5%", "0%"]);

//   return (
//     <section ref={ref} className="bg-[#d4ccbe] px-6 py-24 text-[#1a1714]">
//       <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
//         <motion.div style={{ x: imgX }}>
//           <div className="overflow-hidden rounded-[2.5rem] shadow-[0_60px_120px_rgba(0,0,0,0.22)]">
//             <Image src="/images/mug.jpeg" alt="TERR4 outdoor" width={900} height={1100}
//               className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-[1.02]" />
//           </div>
//         </motion.div>

//         <Reveal>
//           <p className="text-[10px] font-black uppercase tracking-[0.42em] text-[#1a1714]/38">
//             Built for every forecast
//           </p>
//           <h2 className="mt-4 text-4xl font-black leading-[0.92] tracking-[-0.04em] md:text-6xl">
//             Conforto de casa,<br />mesmo longe dela.
//           </h2>
//           <p className="mt-6 text-[15px] leading-7 text-[#1a1714]/58">
//             Shell em ABS, tecidos impermeáveis, resistência UV e colchão de alta densidade.
//             Desenhada para montar em 60 segundos e aguentar condições exigentes.
//           </p>
//           <StaggerReveal className="mt-8 grid gap-2.5 sm:grid-cols-2" initialDelay={0.1}>
//             {[
//               "Impermeabilidade 2500mm",
//               "Canvas Rip-Stop 280g",
//               "Montagem em 60 segundos",
//               "Compatível com a maioria dos veículos",
//             ].map((item) => (
//               <StaggerItem key={item}>
//                 <div className="flex items-center gap-3 rounded-full border border-[#1a1714]/10
//                   bg-white/35 px-4 py-2.5 transition-colors hover:bg-white/55">
//                   <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1a1714]">
//                     <Check size={10} className="text-white" />
//                   </span>
//                   <span className="text-xs font-bold">{item}</span>
//                 </div>
//               </StaggerItem>
//             ))}
//           </StaggerReveal>
//         </Reveal>
//       </div>
//     </section>
//   );
// }

// // ─── Products grid ────────────────────────────────────────────────────────────
// function ProductsGrid({ products }: { products: StoreProduct[] }) {
//   return (
//     <section className="px-6 py-24 text-white">
//       <div className="mx-auto max-w-7xl">
//         <Reveal>
//           <div className="mb-10 flex items-end justify-between">
//             <div>
//               <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#a79d8d]">Produtos</p>
//               <h2 className="mt-2 text-4xl font-black leading-[0.92] tracking-[-0.04em] md:text-6xl">
//                 Equipamento TERR4
//               </h2>
//             </div>
//             <Link href="/shop"
//               className="group inline-flex items-center gap-1.5 text-[11px] font-black uppercase
//                 tracking-[0.2em] text-white/38 transition hover:text-white">
//               Ver todos
//               <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
//             </Link>
//           </div>
//         </Reveal>

//         <StaggerReveal className="grid gap-5 md:grid-cols-2" staggerDelay={0.1}>
//           {products.map((product) => (
//             <StaggerItem key={product.slug}>
//               <ProductCard product={product} />
//             </StaggerItem>
//           ))}
//         </StaggerReveal>
//       </div>
//     </section>
//   );
// }

// // ─── Final CTA ────────────────────────────────────────────────────────────────
// function FinalCTA() {
//   const ref = useRef<HTMLElement>(null);
//   const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
//   const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

//   return (
//     <section ref={ref} className="px-6 pb-24 text-white">
//       <div className="mx-auto max-w-7xl">
//         <motion.div style={{ scale }}
//           className="relative overflow-hidden rounded-[2.5rem]">
//           <div className="absolute inset-0">
//             <Image src="/images/warehouse-3.jpg" alt="TERR4" fill className="object-cover" />
//             <div className="absolute inset-0 bg-gradient-to-r from-[#070706]/95 via-[#070706]/70 to-[#070706]/30" />
//           </div>
//           <div className="relative z-10 px-10 py-16 md:px-16">
//             <p className="text-[10px] font-black uppercase tracking-[0.42em] text-[#a79d8d]">
//               Pronto para partir?
//             </p>
//             <h2 className="mt-4 max-w-xl text-4xl font-black leading-[0.92] tracking-[-0.04em] md:text-6xl">
//               Transforma o teu veículo<br />numa base de aventura.
//             </h2>
//             <div className="mt-8 flex flex-col gap-3 sm:flex-row">
//               <Link href="/shop"
//                 className="btn-wipe group inline-flex h-12 items-center gap-2 rounded-full
//                   bg-[#f4efe4] px-7 text-xs font-black uppercase tracking-[0.14em]
//                   text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white">
//                 Explorar produtos
//                 <ArrowUpRight size={13} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
//               </Link>
//               <Link href="/contact"
//                 className="inline-flex h-12 items-center rounded-full border border-white/20
//                   bg-white/8 px-7 text-xs font-black uppercase tracking-[0.14em]
//                   text-white transition hover:bg-white/14">
//                 Falar connosco
//               </Link>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// // ─── Ticker ───────────────────────────────────────────────────────────────────
// function Ticker() {
//   return (
//     <div className="ticker-skew overflow-hidden border-y border-white/8 bg-white py-4">
//       <div className="flex whitespace-nowrap">
//         <motion.div
//           className="flex shrink-0 items-center gap-0 text-[2rem] font-black uppercase tracking-[-0.02em] text-neutral-950 md:text-[3rem]"
//           animate={{ x: ["0%", "-50%"] }}
//           transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
//         >
//           {Array(4).fill(null).map((_, i) => (
//             <span key={i} className="flex items-center">
//               <span>Rooftop Tents</span>
//               <span className="mx-6 text-[#c46a2d]">✦</span>
//               <span>Outdoor Gear</span>
//               <span className="mx-6 text-[#c46a2d]">✦</span>
//               <span>Built for the Road</span>
//               <span className="mx-6 text-[#c46a2d]">✦</span>
//               <span>Portugal</span>
//               <span className="mx-6 text-[#c46a2d]">✦</span>
//             </span>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// // ─── Root export ──────────────────────────────────────────────────────────────
// export function HomeContent({ products }: { products: StoreProduct[] }) {
//   return (
//     <main className="bg-[#070706]">
//       <Hero />
//       <Ticker />
//       <ProductStatement />
//       <Numbers />
//       <ImageStrip />
//       <FeatureSection />
//       <ProductsGrid products={products} />
//       <FinalCTA />
//     </main>
//   );
// }