// Fichier : app/cgu/page.tsx

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Annuaire Café CI",
  description:
    "Conditions générales d'utilisation du site Annuaire Café CI : inscription, avis, obligations des utilisateurs et des commerces.",
};

export default function CguPage() {
  return (
    <main
      className="min-h-screen px-5 md:px-10 py-16"
      style={{ background: "#F7F3EC", color: "#18120E" }}
    >
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm underline"
          style={{ color: "#8F8177" }}
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-3xl md:text-4xl font-semibold mt-6 mb-2">
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-sm mb-10" style={{ color: "#8F8177" }}>
          Dernière mise à jour : [à compléter]
        </p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Objet</h2>
            <p>
              Les présentes CGU définissent les modalités d'utilisation du
              site Annuaire Café CI, annuaire de commerces (cafés et
              établissements assimilés) en Côte d'Ivoire. L'utilisation du
              site implique l'acceptation pleine et entière des présentes
              CGU.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              2. Création de compte
            </h2>
            <p>
              Deux types de comptes existent : le compte utilisateur
              (recherche, avis) et le compte professionnel (gestion d'une
              fiche commerce). L'utilisateur doit fournir des informations
              exactes et reste responsable de la confidentialité de ses
              identifiants.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              3. Inscription d'un commerce
            </h2>
            <p>
              Tout professionnel référençant son établissement s'engage à
              fournir des informations exactes. Annuaire Café CI se réserve
              le droit de vérifier, modifier ou refuser une fiche ne
              respectant pas ces exigences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              4. Avis et témoignages
            </h2>
            <p>
              Les avis doivent refléter une expérience réelle et personnelle.
              Sont interdits : propos injurieux, diffamatoires,
              discriminatoires, mensongers, ou faux avis (y compris pour son
              propre commerce ou celui d'un concurrent). Annuaire Café CI se
              réserve le droit de modérer ou supprimer tout avis non
              conforme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              5. Obligations de l'utilisateur
            </h2>
            <p>
              L'utilisateur s'engage à ne pas utiliser le site à des fins
              frauduleuses, à ne pas nuire à son bon fonctionnement, et à
              respecter les droits des commerces référencés et des autres
              utilisateurs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Responsabilité</h2>
            <p>
              Annuaire Café CI agit en tant qu'intermédiaire. Il ne saurait
              être tenu responsable de l'exactitude des informations
              fournies par les commerces, de la qualité de leurs services, ni
              des litiges entre utilisateurs et commerces.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              7. Suspension de compte
            </h2>
            <p>
              Annuaire Café CI se réserve le droit de suspendre ou supprimer,
              sans préavis, tout compte ne respectant pas les présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              8. Droit applicable
            </h2>
            <p>
              Les présentes CGU sont régies par le droit ivoirien. Tout
              litige relève de la compétence exclusive des tribunaux de Côte
              d'Ivoire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Contact</h2>
            <p>[contact@annuairecafe.com]</p>
          </section>
        </div>
      </div>
    </main>
  );
}
