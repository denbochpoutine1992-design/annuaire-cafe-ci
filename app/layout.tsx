// Fichier : app/layout.tsx

import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";

const TITLE = "Annuaire Café CI — L’annuaire du café ivoirien";
const DESCRIPTION =
  "Trouvez ou inscrivez un vendeur, torréfacteur ou café en Côte d’Ivoire. L’annuaire du café ivoirien.";

export const metadata: Metadata = {
  metadataBase: new URL("https://annuairecafe.com"),
  title: {
    default: TITLE,
    template: "%s | Annuaire Café CI",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://annuairecafe.com",
    siteName: "Annuaire Café CI",
    title: TITLE,
    description: DESCRIPTION,
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
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#21150F",
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
