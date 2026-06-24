"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";

type GalleryImg = { id: string; url: string };

export function AdminGalleryManager({
  images,
  addAction,
  deleteAction,
}: {
  images: GalleryImg[];
  addAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        const actionFd = new FormData();
        actionFd.append("url", data.url);
        await addAction(actionFd);
      }
    } catch (e) {
      console.error("Upload falhou:", e);
    }
    setUploading(false);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            <Image src={img.url} alt="" fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100">
              <form action={deleteAction}>
                <input type="hidden" name="id" value={img.id} />
                <button className="flex size-10 items-center justify-center rounded-full bg-red-500/80 text-white hover:bg-red-500">
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        ))}

        <label className={`group flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 transition hover:border-white/35 hover:bg-white/[0.04] ${uploading ? "pointer-events-none opacity-50" : ""}`}>
          <Plus size={22} className="text-white/30 transition group-hover:text-white/60" />
          <span className="text-[10px] font-bold text-white/30 transition group-hover:text-white/60">
            {uploading ? "A carregar..." : "Adicionar foto"}
          </span>
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
        </label>
      </div>
      <p className="mt-3 text-xs text-white/25">As fotos aparecem na galeria pública por ordem de adição.</p>
    </div>
  );
}