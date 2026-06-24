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

  // arrastar
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

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

  // auto-play
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

  // handlers de arrastar
  function onPointerDown(e: React.PointerEvent) {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
    setPaused(true);
  }
  function onPointerMove(e: React.PointerEvent) {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  }
  function onPointerUp() {
    drag.current.active = false;
    setTimeout(() => setPaused(false), 1200);
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
      onMouseLeave={() => setPaused(false)}
    >
      {/* setas */}
      <button
        type="button"
        onClick={() => scrollByCards(-1)}
        aria-label="Anterior"
        className={`absolute left-3 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/80 ${
          canLeft ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scrollByCards(1)}
        aria-label="Seguinte"
        className={`absolute right-3 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/80 ${
          canRight ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ChevronRight size={20} />
      </button>

      {/* fades laterais */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#070706] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#070706] to-transparent" />

      {/* track */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="no-scrollbar flex cursor-grab gap-5 overflow-x-auto scroll-smooth pb-4 active:cursor-grabbing"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img, i) => (
          <figure
            key={img.id}
            data-card
            className="relative aspect-[4/5] w-[78%] shrink-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] sm:w-[48%] lg:w-[32%]"
          >
            <Image
              src={img.url}
              alt={img.alt || `Galeria TERR4 ${i + 1}`}
              fill
              draggable={false}
              className="select-none object-cover transition duration-700 hover:scale-[1.04]"
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 48vw, 32vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </figure>
        ))}
      </div>
    </div>
  );
}