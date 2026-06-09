import bcrypt from "bcryptjs";
import { PrismaClient, ProductStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});
async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  await prisma.adminUser.deleteMany();

  const passwordHash = await bcrypt.hash("terr4admin", 12);

  await prisma.adminUser.create({
    data: {
      name: "TERR4 Admin",
      email: "admin@terr4.pt",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.product.create({
    data: {
      slug: "terr4-start",
      name: "TERR4 Start",
      category: "Rooftop Tent",
      priceCents: 125000,
      stock: 5,
      status: ProductStatus.AVAILABLE,
      shortDescription:
        "Uma tenda de tejadilho leve, resistente e prática para transformar qualquer veículo numa base confortável para explorar.",
      description:
        "A TERR4 Start é uma tenda de tejadilho leve e prática, pensada para aventuras e viagens ocasionais. Permite transformar qualquer veículo numa solução simples e confortável para explorar, relaxar e dormir na natureza.",
      specsJson: JSON.stringify([
        { label: "Capacidade", value: "1-2 pessoas" },
        { label: "Montagem", value: "60 segundos" },
        { label: "Peso", value: "56 kg" },
        { label: "Aberta", value: "210 x 130 x 110 cm" },
        { label: "Fechada", value: "210 x 130 x 28 cm" },
        { label: "Shell", value: "ABS preto" },
        { label: "Rainfly", value: "Oxford 420D, 2500mm, UV resistant" },
        { label: "Corpo", value: "Canvas Rip-Stop 280g, 2500mm, UV resistant" },
        { label: "Colchão", value: "Alta densidade 5cm, capa lavável" },
        { label: "Escada", value: "Alumínio telescópico" },
      ]),
      includedJson: JSON.stringify([
        "Tenda",
        "Escada telescópica em alumínio",
        "Colchão",
        "Duas bolsas para calçado",
        "Kit de instalação",
        "Rede mosquiteira nas portas e janelas",
      ]),
      warranty:
        "3 anos contra defeitos de fabrico. Cobre estrutura, mecanismos e componentes, excluindo desgaste normal, danos por utilização incorreta, acidentes, montagem incorreta, exposição negligente e bolor por má secagem.",
      compatibility:
        "Compatível com a maioria dos veículos (incluindo citadinos, SUVs, carrinhas e veículos 4x4) desde que equipados com barras de tejadilho transversais adequadas.",
      images: {
        create: [
          {
            url: "/images/hero-jeep.jpeg",
            alt: "TERR4 Start montada num veículo em ambiente outdoor",
            sortOrder: 0,
          },
          {
            url: "/images/warehouse-2.jpg",
            alt: "TERR4 Start em instalação no armazém",
            sortOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "terr4-camp-mug",
      name: "TERR4 Camp Mug",
      category: "Outdoor Gear",
      priceCents: 2500,
      stock: 20,
      status: ProductStatus.AVAILABLE,
      shortDescription:
        "Caneca outdoor em aço esmaltado para campismo, roadtrips e aventuras ao ar livre.",
      description:
        "A TERR4 Camp Mug foi criada para acompanhar viagens, campismo e manhãs frias ao ar livre. Compacta, resistente e com identidade TERR4.",
      specsJson: JSON.stringify([
        { label: "Material", value: "Aço esmaltado" },
        { label: "Capacidade", value: "350 ml" },
        { label: "Peso", value: "Leve e compacto" },
        { label: "Utilização", value: "Outdoor e campismo" },
      ]),
      includedJson: JSON.stringify([
        "Caneca TERR4",
      ]),
      images: {
        create: [
          {
            url: "/images/mug.jpeg",
            alt: "Outdoor gear TERR4",
            sortOrder: 0,
          },
        ],
      },
    },
  });

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });