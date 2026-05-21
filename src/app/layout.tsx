import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import "./globals.css";

const varelaRound = Varela_Round({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-varela",
});

export const metadata: Metadata = {
  title: "WebCraft Maroc — Création de Sites Web Professionnels pour Tous les Secteurs",
  description:
    "Agence web au Maroc. Nous créons des sites web professionnels pour restaurants, cliniques, hôtels, e-commerce, cabinets et tous les secteurs d'activité. Devis gratuit.",
  keywords: ["création site web Maroc", "agence web Maroc", "site web restaurant", "site web clinique", "site web e-commerce Maroc"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={varelaRound.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
