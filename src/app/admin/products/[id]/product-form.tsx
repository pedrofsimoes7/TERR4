"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductStatus } from "@prisma/client";

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
  };
  mainImage: string;
  updateAction: (formData: FormData) => void;
};

export function ProductForm({
  product,
  mainImage,
  updateAction,
}: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState(mainImage);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.url) {
      setImageUrl(data.url);
    }

    setUploading(false);
  }

  return (
    <form
      action={updateAction}
      className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-7"
    >
      <div className="grid gap-6">
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
          <Image
            src={imageUrl}
            alt={product.name}
            width={1200}
            height={700}
            className="aspect-[16/9] object-cover"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-white/70">
            Upload imagem
          </label>

          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm text-white"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                handleUpload(file);
              }
            }}
          />

          {uploading && (
            <p className="mt-3 text-sm text-white/45">
              A fazer upload...
            </p>
          )}
        </div>

        <Input
          name="imageUrl"
          label="Imagem principal"
          value={imageUrl}
          onChange={setImageUrl}
          placeholder="/images/hero-jeep.jpeg"
        />

        <Input
          name="name"
          label="Nome"
          defaultValue={product.name}
        />

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
              product.priceCents
                ? String(product.priceCents / 100)
                : ""
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
              {Object.values(ProductStatus).map((status) => (
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
          rows={7}
        />

        <button
          type="submit"
          className="mt-4 flex h-13 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-neutral-950 transition hover:bg-stone-200"
        >
          Guardar alterações
        </button>
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
      <label className="text-sm font-bold text-white/70">
        {label}
      </label>

      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-13 w-full rounded-full border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/30"
      />
    </div>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-white/70">
        {label}
      </label>

      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-white outline-none"
      />
    </div>
  );
}