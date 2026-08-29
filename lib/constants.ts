export const CATEGORIES = [
  { id: "torrefacteur", label: "Torréfacteur" },
  { id: "detaillant", label: "Détaillant / Boutique" },
  { id: "communautaire", label: "Café communautaire" },
  { id: "grossiste", label: "Grossiste / Export" },
  { id: "enligne", label: "Vente en ligne" },
];

export const VILLES = [
  "Abidjan",
  "Bouaké",
  "Yamoussoukro",
  "San-Pédro",
  "Korhogo",
  "Daloa",
  "Man",
  "Gagnoa",
  "Abengourou",
  "Divo",
  "Autre",
];

export function catLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label || id;
}

// Approximate city centers for the map default view / picker
export const CITY_COORDS: Record<string, [number, number]> = {
  "Abidjan": [5.359951, -4.008256],
  "Bouaké": [7.693889, -5.030278],
  "Yamoussoukro": [6.827623, -5.289343],
  "San-Pédro": [4.7485, -6.6363],
  "Korhogo": [9.458333, -5.629722],
  "Daloa": [6.877778, -6.45],
  "Man": [7.412778, -7.554167],
  "Gagnoa": [6.133333, -5.95],
  "Abengourou": [6.729444, -3.496111],
  "Divo": [5.838611, -5.357222],
  "Autre": [7.539989, -5.54708],
};
