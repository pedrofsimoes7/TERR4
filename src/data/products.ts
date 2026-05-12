export type Product = {
  slug: string;
  name: string;
  category: string;
  price?: number;
  stock?: number;
  status: "available" | "coming-soon";
  shortDescription: string;
  description: string;
  images: string[];
  specs: { label: string; value: string }[];
  included: string[];
  warranty?: string;
  compatibility?: string;
};

export const products: Product[] = [
  {
    slug: "terr4-start",
    name: "TERR4 Start",
    category: "Rooftop Tent",
    price: 1250,
    stock: 5,
    status: "available",
    shortDescription:
      "Uma tenda de tejadilho leve, resistente e prática para transformar qualquer veículo numa base confortável para explorar.",
    description:
      "A TERR4 Start foi pensada para aventuras e viagens ocasionais, combinando montagem rápida, conforto real e resistência para diferentes condições climatéricas.",
    images: ["/images/hero-jeep.jpeg", "/images/warehouse-2.jpg"],
    specs: [
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
    ],
    included: [
      "Tenda",
      "Escada telescópica em alumínio",
      "Colchão",
      "Duas bolsas para calçado",
      "Kit de instalação",
      "Rede mosquiteira nas portas e janelas",
    ],
    warranty:
      "3 anos contra defeitos de fabrico. Exclui desgaste normal, mau uso, acidentes, montagem incorreta, exposição negligente e bolor por má secagem.",
    compatibility:
      "Compatível com a maioria dos veículos com barras de tejadilho transversais adequadas.",
  },
  {
    slug: "terr4-chair",
    name: "TERR4 Chair",
    category: "Outdoor Gear",
    status: "coming-soon",
    shortDescription:
      "Cadeira dobrável compacta com estrutura reforçada, suporte em X e transporte fácil.",
    description:
      "Uma cadeira prática para campismo, roadtrips e dias fora, com estrutura estável e arrumação compacta.",
    images: ["/images/mug.jpeg"],
    specs: [
      { label: "Estrutura", value: "Aço reforçado com sistema em X" },
      { label: "Tubos", value: "16 mm" },
      { label: "Material", value: "Oxford 600D" },
      { label: "Aberta", value: "50 x 50 x 80 cm" },
      { label: "Fechada", value: "80 x 13 cm" },
      { label: "Capacidade", value: "120 kg" },
    ],
    included: ["Cadeira", "Saco de transporte"],
  },
];

export const featuredProduct = products[0];