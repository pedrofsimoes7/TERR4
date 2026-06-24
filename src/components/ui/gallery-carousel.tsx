"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type GalleryItem = { id: string; url: string; alt?: string | null };

export function GalleryCarousel({ images }: { images: GalleryItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  function scrollByCards(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  // auto-play (pausa em hover no desktop, ou enquanto o utilizador interage)
  useEffect(() => {
    if (paused || images.length <= 1) return;
    const interval = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByCards(1);
      }
    }, 3200);
    return () => clearInterval(interval);
  }, [paused, images.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  // ── Arrastar com RATO (só desktop). No telemóvel o scroll de toque
  //    nativo trata de tudo — não interferimos. ──
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  function onMouseDown(e: React.MouseEvent) {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.pageX, scrollLeft: el.scrollLeft };
    setPaused(true);
  }
  function onMouseMove(e: React.MouseEvent) {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    e.preventDefault();
    const dx = e.pageX - drag.current.startX;
    el.scrollLeft = drag.current.scrollLeft - dx;
  }
  function endDrag() {
    if (!drag.current.active) return;
    drag.current.active = false;
    setTimeout(() => setPaused(false), 1500);
  }

  if (images.length === 0) {
    return (
      <div className="flex aspect-[21/9] items-center justify-center rounded-[2rem] border border-dashed border-white/12 bg-white/[0.02] text-sm text-white/30">
        Fotos em breve.
      </div>
    );
  }

  return (
    <div
      className="group/gallery relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); endDrag(); }}
    >
      {/* setas (escondidas em telemóvel — lá usa-se o swipe nativo) */}
      <button
        type="button"
        onClick={() => scrollByCards(-1)}
        aria-label="Anterior"
        className={`absolute left-3 top-1/2 z-20 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/80 sm:flex ${
          canLeft ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scrollByCards(1)}
        aria-label="Seguinte"
        className={`absolute right-3 top-1/2 z-20 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/80 sm:flex ${
          canRight ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ChevronRight size={20} />
      </button>

      {/* fades laterais (só desktop) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-[#070706] to-transparent sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-[#070706] to-transparent sm:block" />

      {/* track */}
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:cursor-grab sm:snap-none sm:active:cursor-grabbing"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {images.map((img, i) => (
          <figure
            key={img.id}
            data-card
            className="relative aspect-[4/5] w-[82%] shrink-0 snap-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] sm:w-[48%] sm:snap-align-none lg:w-[32%]"
          >
            <Image
              src={img.url}
              alt={img.alt || `Galeria TERR4 ${i + 1}`}
              fill
              draggable={false}
              className="select-none object-cover transition duration-700 sm:hover:scale-[1.04]"
              sizes="(max-width: 640px) 82vw, (max-width: 1024px) 48vw, 32vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </figure>
        ))}
      </div>
    </div>
  );
}