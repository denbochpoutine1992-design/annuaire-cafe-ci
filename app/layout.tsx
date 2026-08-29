import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "L'annuaire du café ivoirien",
  description: "Trouvez ou inscrivez un vendeur de café en Côte d'Ivoire.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-body">{children}</body>
    </html>
  );
}
