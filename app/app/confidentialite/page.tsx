
// Fichier : app/confidentialite/page.tsx

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Annuaire Café CI",
  description:
    "Comment Annuaire Café CI collecte, utilise et protège vos données personnelles, conformément à la loi ivoirienne n°2013-450.",
};

export default function ConfidentialitePage() {
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
          Politique de confidentialité
        </h1>
        <p className="text-sm mb-10" style={{ color: "#8F8177" }}>
          Dernière mise à jour : [à compléter]
        </p>

        <div className="space-y-8 leading-relaxed">
          <p>
            Annuaire Café CI s'engage à protéger la vie privée de ses
            utilisateurs et à traiter leurs données personnelles conformément
            à la loi ivoirienne n°2013-450 du 19 juin 2013 relative à la
            protection des données à caractère personnel.
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              1. Données collectées
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Compte utilisateur : nom, prénom, e-mail, téléphone, mot de
                passe (chiffré)
              </li>
              <li>
                Compte professionnel : nom du commerce, adresse, téléphone,
                e-mail, description, photos, horaires
              </li>
              <li>Avis déposés : nom/pseudonyme, contenu, note</li>
              <li>Navigation : adresse IP, pages consultées, cookies</li>
              <li>Formulaire de contact : informations transmises</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              2. Finalités du traitement
            </h2>
            <p>
              Vos données servent à créer et gérer votre compte, afficher les
              fiches commerces, permettre le dépôt et la modération des avis,
              répondre à vos demandes, et améliorer le site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              3. Durée de conservation
            </h2>
            <p>
              Vos données sont conservées pendant la durée de vie de votre
              compte, puis supprimées ou anonymisées dans un délai de [ex. 12
              mois] après sa suppression, sauf obligation légale contraire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              4. Partage des données
            </h2>
            <p>
              Vos données ne sont jamais vendues à des tiers. Elles peuvent
              être partagées avec nos prestataires techniques (hébergement,
              e-mail), tenus à la confidentialité, ou avec les autorités
              compétentes si la loi l'exige.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
            <p>
              Le site utilise des cookies techniques (fonctionnement du
              site), statistiques (mesure d'audience) et de partage social.
              Vous pouvez configurer votre navigateur pour les refuser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Vos droits</h2>
            <p>
              Vous disposez d'un droit d'accès, de rectification,
              d'opposition et de suppression de vos données. Pour l'exercer,
              contactez-nous : [contact@annuairecafe.com]. Vous pouvez aussi
              saisir l'ARTCI (Autorité de Régulation des
              Télécommunications/TIC de Côte d'Ivoire).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
            <p>
              Pour toute question relative à cette politique :{" "}
              [contact@annuairecafe.com]
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
