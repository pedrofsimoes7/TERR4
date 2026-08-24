import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 5 * 1024 * 1024;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Ficheiro inválido." }, { status: 400 });
  }

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato inválido. Usa JPG, PNG ou WEBP." },
      { status: 400 }
    );
  }

  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "Imagem demasiado grande. Máximo 5MB." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "terr4/products",
          resource_type: "image",
          transformation: [
            {
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload falhou."));
            return;
          }

          resolve({
            secure_url: result.secure_url,
          });
        }
      );

      stream.end(buffer);
    }
  );

  return NextResponse.json({
    url: uploadResult.secure_url,
  });
}