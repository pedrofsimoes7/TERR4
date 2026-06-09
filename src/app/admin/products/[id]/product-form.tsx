"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ProductStatus } from "@prisma/client";
import { Plus, Trash2, Star } from "lucide-react";

const PRODUCT_STATUSES: ProductStatus[] = [
  "AVAILABLE",
  "COMING_SOON",
  "DRAFT",
];

type ImageItem = {
  id?: string;
  url: string;
  isPrimary: boolean;
};

type ProductFormProps = {
  product: {
    id: string;
    name: string;
    category: string;
    stock: number;
    status: ProductStatus;
    shortDescription: string;
    description: string;
    priceCents: number | null;
    specsJson: string;
    includedJson: string;
    featuresJson: string;
    trustItemsJson: string;
    warranty: string | null;
    compatibility: string | null;
  };
  mainImage: string;
  updateAction: (formData: FormData) => void;
  extraImages?: { id: string; url: string; sortOrder: number }[];
};

function jsonToLabelValueText(value: string) {
  try {
    const items = JSON.parse(value || "[]") as {
      label: string;
      value: string;
    }[];

    return items.map((item) => `${item.label}: ${item.value}`).join("\n");
  } catch {
    return "";
  }
}

function jsonToFeatureText(value: string) {
  try {
    const items = JSON.parse(value || "[]") as {
      title: string;
      text: string;
    }[];

    return items.map((item) => `${item.title}: ${item.text}`).join("\n");
  } catch {
    return "";
  }
}

function jsonToLinesText(value: string) {
  try {
    const items = JSON.parse(value || "[]") as string[];

    return items.join("\n");
  } catch {
    return "";
  }
}

export function ProductForm({
  product,
  mainImage,
  updateAction,
  extraImages = [],
}: ProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const initialImages = useMemo<ImageItem[]>(() => {
    const orderedImages = extraImages
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image, index) => ({
        id: image.id,
        url: image.url,
        isPrimary: index === 0,
      }));

    if (orderedImages.length > 0) {
      return orderedImages;
    }

    return [{ url: mainImage, isPrimary: true }];
  }, [extraImages, mainImage]);

  const [images, setImages] = useState<ImageItem[]>(initialImages);

  const specsText = jsonToLabelValueText(product.specsJson);
  const includedText = jsonToLinesText(product.includedJson);
  const featuresText = jsonToFeatureText(product.featuresJson);
  const trustItemsText =
    jsonToLabelValueText(product.trustItemsJson) ||
    `Envio: A combinar
Garantia: 12 meses
Inclui: Produto TERR4`;

  async function handleUpload(file: File, index?: number) {
    if (index !== undefined) {
      setUploadingIdx(index);
    } else {
      setUploading(true);
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.url) {
      if (index !== undefined) {
        setImages((prev) =>
          prev.map((img, i) =>
            i === index ? { ...img, url: data.url } : img
          )
        );
      } else {
        setImages((prev) => [
          ...prev,
          {
            url: data.url,
            isPrimary: false,
          },
        ]);
      }
    }

    setUploading(false);
    setUploadingIdx(null);
  }

  function removeImage(index: number) {
    if (images.length <= 1) return;

    setImages((prev) => {
      const removedWasPrimary = prev[index].isPrimary;
      const next = prev.filter((_, i) => i !== index);

      if (removedWasPrimary && next.length > 0) {
        return next.map((img, i) => ({
          ...img,
          isPrimary: i === 0,
        }));
      }

      return next;
    });
  }

  function setPrimary(index: number) {
    setImages((prev) => {
      const selected = prev[index];
      const others = prev.filter((_, i) => i !== index);

      return [
        { ...selected, isPrimary: true },
        ...others.map((img) => ({
          ...img,
          isPrimary: false,
        })),
      ];
    });
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return;

    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);

      next.splice(to, 0, item);

      return next.map((img, index) => ({
        ...img,
        isPrimary: index === 0,
      }));
    });
  }

  const primaryImage = images.find((img) => img.isPrimary) ?? images[0];

  return (
    <form action={updateAction} className="mt-10 space-y-6">
      {images.map((img, index) => (
        <input
          key={`${img.url}-${index}`}
          type="hidden"
          name={`imageUrl_${index}`}
          value={img.url}
        />
      ))}

      <input type="hidden" name="imageCount" value={images.length} />

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <h2 className="mb-5 text-lg font-black text-white">
          Fotos do produto
        </h2>

        <div className="relative mb-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
          <Image
            src={primaryImage.url}
            alt={product.name}
            width={1200}
            height={600}
            className="aspect-[16/7] w-full object-cover"
          />

          <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-white backdrop-blur">
            Foto principal
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                img.isPrimary
                  ? "border-[#c46a2d]"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              <div className="relative aspect-square overflow-hidden bg-black/30">
                <Image
                  src={img.url}
                  alt={`Foto ${index + 1}`}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(index)}
                      className="flex items-center gap-1.5 rounded-full bg-[#c46a2d] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-white"
                    >
                      <Star size={10} />
                      Principal
                    </button>
                  )}

                  <div className="flex gap-2">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index - 1)}
                        className="flex size-7 items-center justify-center rounded-full bg-white/15 text-xs text-white hover:bg-white/30"
                      >
                        ←
                      </button>
                    )}

                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index + 1)}
                        className="flex size-7 items-center justify-center rounded-full bg-white/15 text-xs text-white hover:bg-white/30"
                      >
                        →
                      </button>
                    )}

                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="flex size-7 items-center justify-center rounded-full bg-red-500/80 text-white hover:bg-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <label className="block cursor-pointer border-t border-white/8 bg-white/[0.03] px-2 py-1.5 text-center text-[10px] font-bold text-white/40 transition hover:bg-white/[0.07] hover:text-white/70">
                {uploadingIdx === index ? "A fazer upload..." : "Substituir"}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      handleUpload(file, index);
                    }
                  }}
                />
              </label>

              {img.isPrimary && (
                <div className="absolute right-2 top-2 rounded-full bg-[#c46a2d] p-1">
                  <Star size={10} className="text-white" fill="white" />
                </div>
              )}
            </div>
          ))}

          <label
            className={`group flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 transition-all hover:border-white/35 hover:bg-white/[0.04] ${
              uploading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <Plus
              size={22}
              className="text-white/30 transition group-hover:text-white/60"
            />

            <span className="text-[10px] font-bold text-white/30 transition group-hover:text-white/60">
              {uploading ? "A fazer upload..." : "Adicionar foto"}
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  handleUpload(file);
                }
              }}
            />
          </label>
        </div>

        <p className="mt-3 text-xs text-white/25">
          A primeira foto é a foto principal. Usa as setas para reordenar.
        </p>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
        <div className="grid gap-6">
          <Input name="name" label="Nome" defaultValue={product.name} />

          <Input
            name="category"
            label="Categoria"
            defaultValue={product.category}
          />

          <div className="grid gap-6 md:grid-cols-3">
            <Input
              name="price"
              label="Preço (€)"
              type="number"
              defaultValue={
                product.priceCents ? String(product.priceCents / 100) : ""
              }
            />

            <Input
              name="stock"
              label="Stock"
              type="number"
              defaultValue={String(product.stock)}
            />

            <div>
              <label className="text-sm font-bold text-white/70">
                Estado
              </label>

              <select
                name="status"
                defaultValue={product.status}
                className="mt-2 h-13 w-full rounded-full border border-white/10 bg-neutral-900 px-5 text-white outline-none"
              >
                {PRODUCT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Textarea
            name="shortDescription"
            label="Descrição curta"
            defaultValue={product.shortDescription}
          />

          <Textarea
            name="description"
            label="Descrição longa"
            defaultValue={product.description}
            rows={6}
          />

          <Textarea
            name="specs"
            label="Detalhes técnicos (label: valor, uma por linha)"
            defaultValue={specsText}
            rows={7}
            placeholder={`Capacidade: 1-2 pessoas
Montagem: 60 segundos
Peso: 56 kg`}
          />

          <Textarea
            name="included"
            label="Incluído (uma por linha)"
            defaultValue={includedText}
            rows={5}
            placeholder={`Tenda
Escada telescópica
Colchão`}
          />

          <Textarea
            name="features"
            label="Features (título: descrição, uma por linha)"
            defaultValue={featuresText}
            rows={5}
            placeholder="Compacta em viagem: Fecha em apenas 28cm de altura."
          />

          <Textarea
            name="trustItems"
            label="Badges rápidos (label: valor)"
            defaultValue={trustItemsText}
            rows={3}
          />

          <Textarea
            name="compatibility"
            label="Compatibilidade (opcional)"
            defaultValue={product.compatibility ?? ""}
            rows={3}
          />

          <Textarea
            name="warranty"
            label="Garantia"
            defaultValue={
              product.warranty ?? "12 meses contra defeitos de fabrico."
            }
            rows={3}
          />

          <button
            type="submit"
            className="mt-2 flex h-13 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950 transition hover:bg-stone-100 active:scale-[0.98]"
          >
            Guardar alterações
          </button>
        </div>
      </div>
    </form>
  );
}

function Input({
  label,
  name,
  defaultValue,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-white/70">{label}</label>

      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-13 w-full rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/30 focus:border-[#c46a2d]/50"
      />
    </div>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-white/70">{label}</label>

      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-white outline-none placeholder:text-white/30 focus:border-[#c46a2d]/50"
      />
    </div>
  );
}