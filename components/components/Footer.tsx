// Fichier : components/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="px-5 md:px-10 py-14"
      style={{ background: "#0E0A07", color: "#C9BDB0" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Logo + description */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg">
                ☕
              </span>
              <div className="font-semibold text-white">
                Annuaire Café CI
              </div>
            </div>

            <p className="text-sm mt-3 max-w-md">
              Le rendez-vous des professionnels et amateurs du café en
              Côte d'Ivoire.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4 mt-5">
              
                href="https://wa.me/[VOTRE_NUMERO]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="transition hover:text-white"
              >
                WhatsApp
              </a>
              
                href="https://facebook.com/[VOTRE_PAGE]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition hover:text-white"
              >
                Facebook
              </a>
              
                href="https://instagram.com/[VOTRE_COMPTE]"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition hover:text-white"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
            <Link href="/#explorer" className="transition hover:text-white">
              Explorer
            </Link>
            <Link href="/#resultats" className="transition hover:text-white">
              Commerces
            </Link>
            <Link href="/login" className="transition hover:text-white">
              Connexion
            </Link>
            <Link href="/register" className="transition hover:text-white">
              Inscrire mon commerce
            </Link>
          </div>

          {/* Liens légaux */}
          <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
            <Link
              href="/mentions-legales"
              className="transition hover:text-white"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="transition hover:text-white"
            >
              Confidentialité
            </Link>
            <Link href="/cgu" className="transition hover:text-white">
              CGU
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.10)",
            color: "#8F8177",
          }}
        >
          © {new Date().getFullYear()} Annuaire Café CI — Tous droits
          réservés.
        </div>
      </div>
    </footer>
  );
}
