"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const safeImages = images.length > 0 ? images : ["/images/hero-jeep.jpeg"];
  const [activeImage, setActiveImage] = useState(safeImages[0]);

  return (
    <div className="space-y-4">
      <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#151411]">
        <Image
          src={activeImage}
          alt={alt}
          width={1600}
          height={1100}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </div>

      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`relative overflow-hidden rounded-2xl border transition duration-200 ${
                activeImage === image
                  ? "border-[#c46a2d]"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                width={400}
                height={300}
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}