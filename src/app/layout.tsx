import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Warriors Market | Alimentation Saine & Produits Locaux au Bénin",
  description: "Votre alimentation saine, notre priorité. Commandez en ligne nos viandes fraîches (bœuf, mouton, poulet), épices naturelles, farines et produits transformés du Bénin.",
  keywords: ["Warriors Market", "agroalimentaire", "Bénin", "viande fraîche", "épices naturelles", "farines locales", "Cotonou", "livraison à domicile"],
  authors: [{ name: "Warriors Market" }],
  openGraph: {
    title: "Warriors Market | Votre alimentation saine, notre priorité",
    description: "Vente de viandes fraîches, farines locales, épices et produits agroalimentaires transformés au Bénin. Livraison rapide à domicile.",
    type: "website",
    locale: "fr_BJ",
    siteName: "Warriors Market",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream font-sans antialiased text-slate-dark selection:bg-primary/20 selection:text-primary-dark">
        <CartProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
