import { PrismaClient, ProductStatus } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  const terr4Start = await prisma.product.create({
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
        "Compatível com a maioria dos veículos — incluindo citadinos, SUVs, carrinhas e veículos 4x4 — desde que equipados com barras de tejadilho transversais adequadas.",
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
      slug: "terr4-chair",
      name: "TERR4 Chair",
      category: "Outdoor Gear",
      priceCents: null,
      stock: 0,
      status: ProductStatus.COMING_SOON,
      shortDescription:
        "Cadeira dobrável compacta com estrutura reforçada, suporte em X e transporte fácil.",
      description:
        "Uma cadeira prática para campismo, roadtrips e dias fora, com estrutura estável e arrumação compacta.",
      specsJson: JSON.stringify([
        { label: "Estrutura", value: "Aço reforçado com sistema em X" },
        { label: "Tubos", value: "16 mm" },
        { label: "Material", value: "Oxford 600D" },
        { label: "Aberta", value: "50 x 50 x 80 cm" },
        { label: "Fechada", value: "80 x 13 cm" },
        { label: "Capacidade", value: "120 kg" },
      ]),
      includedJson: JSON.stringify(["Cadeira", "Saco de transporte"]),
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

  console.log(`Seeded ${terr4Start.name} and TERR4 Chair`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });