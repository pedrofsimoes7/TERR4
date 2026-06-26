import type { Metadata, Viewport } from "next";
import { Barlow } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
// import { CustomCursor } from "@/components/layout/custom-cursor";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://terr4.pt"),
  title: {
    default: "TERR4 Outdoor Gear. Tendas de tejadilho e equipamento de aventura",
    template: "%s | TERR4 Outdoor Gear",
  },
  description:
    "TERR4 Outdoor Gear. Tendas de tejadilho, alugueres e equipamento para campismo e roadtrips. Transforma qualquer veículo numa base de aventura. Envio para todo o Portugal.",
  keywords: [
    // Marca
    "TERR4",
    "TERR4 Outdoor Gear",
    "TERR4 Portugal",
    "TERR4 tenda",
    // Produto principal — tenda de tejadilho
    "tenda de tejadilho",
    "tenda de tejadilho Portugal",
    "tenda de tejadilho para carro",
    "tenda de tejadilho preço",
    "comprar tenda de tejadilho",
    "tenda de tejadilho softshell",
    "tenda de tejadilho hardshell",
    "rooftop tent",
    "rooftop tent Portugal",
    "roof tent",
    "car roof tent",
    "tenda para carro",
    "tenda para jipe",
    "tenda 4x4",
    "tenda para roadtrip",
    "tenda de carro tejadilho",
    // Aluguer
    "aluguer tenda de tejadilho",
    "alugar tenda de tejadilho",
    "aluguer tenda tejadilho Portugal",
    "rooftop tent rental",
    "aluguer equipamento campismo",
    "alugar tenda carro",
    // Campismo / outdoor
    "campismo",
    "campismo Portugal",
    "equipamento de campismo",
    "equipamento campismo Portugal",
    "material de campismo",
    "loja de campismo online",
    "outdoor gear",
    "outdoor gear Portugal",
    "equipamento outdoor",
    "acessórios campismo",
    "campismo selvagem",
    "overlanding",
    "overlanding Portugal",
    "vanlife",
    "vanlife Portugal",
    // Roadtrip / aventura
    "roadtrip",
    "roadtrip Portugal",
    "viagem de carro",
    "aventura outdoor",
    "viagens 4x4",
    "acampar no carro",
    "dormir no carro",
    // Produtos secundários
    "cadeira de campismo",
    "cadeira dobrável campismo",
    "caneca de campismo",
    "caneca esmaltada",
    "acessórios outdoor",
    // Long-tail / intenção
    "melhor tenda de tejadilho",
    "tenda de tejadilho barata",
    "onde comprar tenda de tejadilho em Portugal",
    "tenda tejadilho 2 pessoas",
    "tenda tejadilho universal",
  ],
  authors: [{ name: "TERR4 Outdoor Gear" }],
  creator: "TERR4 Outdoor Gear",
  publisher: "TERR4 Outdoor Gear",
  category: "Outdoor & Camping Gear",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://terr4.pt",
    siteName: "TERR4 Outdoor Gear",
    title: "TERR4 Outdoor Gear. Tendas de tejadilho e equipamento de aventura",
    description:
      "Tendas de tejadilho, alugueres e equipamento para campismo e roadtrips. Transforma qualquer veículo numa base de aventura.",
    images: [
      {
        url: "/images/terr4/brand-rooftop.jpg",
        width: 1200,
        height: 630,
        alt: "TERR4 Outdoor Gear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TERR4 Outdoor Gear",
    description:
      "Tendas de tejadilho, alugueres e equipamento para campismo e roadtrips.",
    images: ["/images/terr4/brand-rooftop.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://terr4.pt",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover", // ← essencial para o notch/safe-area no iPhone
  themeColor: "#070706",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${barlow.variable} bg-[#070706]`}>
      <body className="min-h-screen overflow-x-hidden bg-[#070706] font-sans text-[#c8c4be] antialiased">
        {/* <CustomCursor /> */}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}