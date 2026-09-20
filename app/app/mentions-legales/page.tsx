// Fichier : app/mentions-legales/page.tsx

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales | Annuaire Café CI",
  description:
    "Mentions légales du site Annuaire Café CI, l'annuaire des professionnels et commerces du café en Côte d'Ivoire.",
};

export default function MentionsLegalesPage() {
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
          Mentions légales
        </h1>
        <p className="text-sm mb-10" style={{ color: "#8F8177" }}>
          Dernière mise à jour : [à compléter]
        </p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-2">
              1. Éditeur du site
            </h2>
            <p>Le site Annuaire Café CI est édité par :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Nom / Raison sociale : [À compléter]</li>
              <li>Forme juridique : [À compléter]</li>
              <li>Numéro RCCM : [À compléter]</li>
              <li>Siège social : [Adresse, Abidjan, Côte d'Ivoire]</li>
              <li>Téléphone : [À compléter]</li>
              <li>E-mail : [contact@annuairecafe.com]</li>
              <li>Directeur de la publication : [À compléter]</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Hébergement</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hébergeur : [À compléter]</li>
              <li>Adresse : [À compléter]</li>
              <li>Contact : [À compléter]</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              3. Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des contenus présents sur le site (textes, images,
              logo, charte graphique, base de données des commerces) est
              protégé par le droit d'auteur et le droit des marques. Toute
              reproduction totale ou partielle sans autorisation écrite
              préalable est interdite.
            </p>
            <p className="mt-2">
              Les marques, logos et noms commerciaux des établissements
              référencés dans l'annuaire restent la propriété de leurs
              titulaires respectifs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              4. Signalement d'un contenu
            </h2>
            <p>
              Pour signaler une fiche commerce erronée ou un contenu
              inapproprié, contactez-nous à l'adresse :{" "}
              [contact@annuairecafe.com].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Responsabilité</h2>
            <p>
              Nous nous efforçons d'assurer l'exactitude des informations
              diffusées (adresses, horaires, coordonnées des commerces), mais
              ne pouvons garantir leur exactitude ou leur actualité à tout
              moment. Il appartient à l'utilisateur de vérifier ces
              informations directement auprès des établissements concernés.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              6. Droit applicable
            </h2>
            <p>
              Les présentes mentions légales sont soumises au droit ivoirien.
              En cas de litige, les tribunaux compétents de Côte d'Ivoire
              seront seuls compétents.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
