import type { Metadata } from "next";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://terr4.pt"),
  title: "TERR4 Outdoor Gear",
  description:
    "Rooftop tents e outdoor gear premium. Feito para quem quer ir mais longe.",

  icons: {
    icon: "/images/terr4-logo-assets/favicon-black.ico",
    shortcut: "/images/terr4-logo-assets/favicon-black.ico",
  },
  openGraph: {
    title: "TERR4 Outdoor Gear",
    description:
      "Rooftop tents e outdoor gear premium. Feito para quem quer ir mais longe.",
    images: ["/images/terr4-logo-assets/terr4-logo-beige-transparent.png"],
  },
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