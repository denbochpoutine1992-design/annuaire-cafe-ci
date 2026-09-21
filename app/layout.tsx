// Fichier : app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
export const metadata: Metadata = {
  metadataBase: new URL("https://annuairecafe.com"),
  title: {
    default: "Annuaire Café CI — L'annuaire du café ivoirien",
    template: "%s | Annuaire Café CI",
  },
  description:
    "Trouvez ou inscrivez un vendeur, torréfacteur ou café en Côte d'Ivoire. Le plus grand annuaire du café ivoirien.",
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://annuairecafe.com",
    siteName: "Annuaire Café CI",
    title: "Annuaire Café CI — L'annuaire du café ivoirien",
    description:
      "Trouvez ou inscrivez un vendeur, torréfacteur ou café en Côte d'Ivoire.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Annuaire Café CI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Annuaire Café CI — L'annuaire du café ivoirien",
    description:
      "Trouvez ou inscrivez un vendeur, torréfacteur ou café en Côte d'Ivoire.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-body">

<CartProvider>

{children}

<Footer />

</CartProvider>

</body>
    </html>
  );
}
