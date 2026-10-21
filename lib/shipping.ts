// lib/shipping.ts
// Frais de livraison : UNE seule livraison par commande, quel que soit le nombre de vendeurs.
// Les tarifs sont ceux de l'administrateur (table ShippingRate + réglages).
import { db } from "@/lib/db";

export const DEFAULT_FEE_KEY = "shipping.defaultFee";
export const FREE_THRESHOLD_KEY = "shipping.freeThreshold";

function toInt(value: string | undefined) {
  const n = parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export async function getShippingConfig() {
  const [rates, settings] = await Promise.all([
    db.shippingRate.findMany(),
    db.setting.findMany({ where: { key: { in: [DEFAULT_FEE_KEY, FREE_THRESHOLD_KEY] } } }),
  ]);

  const values = new Map<string, string>(settings.map((s) => [s.key, s.value]));

  return {
    rates: new Map<string, number>(rates.map((r) => [r.city, r.feeFcfa])),
    defaultFee: toInt(values.get(DEFAULT_FEE_KEY)),
    freeThreshold: toInt(values.get(FREE_THRESHOLD_KEY)), // 0 = pas de livraison offerte
  };
}

/** Frais de livraison d'un panier : calculés par le serveur, jamais fournis par le navigateur. */
export async function computeShippingFee(city: string, subtotalFcfa: number): Promise<number> {
  const config = await getShippingConfig();

  if (config.freeThreshold > 0 && subtotalFcfa >= config.freeThreshold) return 0;
  return config.rates.get(city) ?? config.defaultFee;
}
