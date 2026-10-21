import { requireAdmin } from "@/lib/admin";
import { VILLES } from "@/lib/constants";
import { formatFcfa } from "@/lib/format";
import { getShippingConfig } from "@/lib/shipping";
import { saveShippingRates, saveShippingSettings } from "./actions";

export const dynamic = "force-dynamic";

const FIELD =
  "h-11 w-full rounded-xl border border-[#D9CFC1] bg-white px-3 text-base text-[#18120E]";

export default async function AdminShipping() {
  await requireAdmin();

  const config = await getShippingConfig();
  const notConfigured = config.rates.size === 0 && config.defaultFee === 0;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Livraison</h1>
      <p className="mt-1 text-sm text-[#6B5F55]">
        Une seule livraison par commande, quel que soit le nombre de vendeurs : tu fixes ici les
        tarifs, et le serveur les applique.
      </p>

      {notConfigured && (
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Aucun tarif n’est défini : la livraison est actuellement <strong>gratuite</strong> partout.
          Renseigne un tarif par défaut ci-dessous.
        </p>
      )}

      <section className="mt-8 rounded-2xl border border-[#E5DDD2] bg-white p-5">
        <h2 className="text-lg font-semibold">Réglages généraux</h2>

        <form action={saveShippingSettings} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="defaultFee" className="mb-1.5 block text-sm font-medium">
              Tarif par défaut (FCFA)
            </label>
            <input
              id="defaultFee"
              name="defaultFee"
              inputMode="numeric"
              defaultValue={config.defaultFee > 0 ? String(config.defaultFee) : ""}
              placeholder="ex : 2000"
              className={FIELD}
            />
            <p className="mt-1 text-xs text-[#6B5F55]">
              Pour toute ville sans tarif particulier.
            </p>
          </div>

          <div>
            <label htmlFor="freeThreshold" className="mb-1.5 block text-sm font-medium">
              Livraison offerte dès (FCFA)
            </label>
            <input
              id="freeThreshold"
              name="freeThreshold"
              inputMode="numeric"
              defaultValue={config.freeThreshold > 0 ? String(config.freeThreshold) : ""}
              placeholder="vide = jamais offerte"
              className={FIELD}
            />
            <p className="mt-1 text-xs text-[#6B5F55]">
              Montant des produits au-delà duquel la livraison est gratuite.
            </p>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-[#21150F] px-6 py-2.5 text-sm font-semibold text-white"
            >
              Enregistrer les réglages
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-[#E5DDD2] bg-white p-5">
        <h2 className="text-lg font-semibold">Tarif par ville</h2>
        <p className="mt-1 text-sm text-[#6B5F55]">
          Laisse une case vide pour appliquer le tarif par défaut
          {config.defaultFee > 0 ? ` (${formatFcfa(config.defaultFee)})` : ""}.
        </p>

        <form action={saveShippingRates} className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {VILLES.map((city) => (
              <div key={city} className="flex items-center justify-between gap-3">
                <label htmlFor={`fee-${city}`} className="text-sm font-medium">
                  {city}
                </label>
                <input
                  id={`fee-${city}`}
                  name={`fee:${city}`}
                  inputMode="numeric"
                  defaultValue={config.rates.has(city) ? String(config.rates.get(city)) : ""}
                  placeholder="par défaut"
                  className={`${FIELD} w-36`}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-5 rounded-full bg-[#21150F] px-6 py-2.5 text-sm font-semibold text-white"
          >
            Enregistrer les tarifs
          </button>
        </form>
      </section>
    </div>
  );
}
