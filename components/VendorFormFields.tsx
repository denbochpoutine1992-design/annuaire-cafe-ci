"use client";

import dynamic from "next/dynamic";
import { CATEGORIES, VILLES, CITY_COORDS } from "@/lib/constants";

const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });

export type VendorFormState = {
  name: string;
  category: string;
  city: string;
  neighborhood: string;
  phone: string;
  description: string;
  priceInfo: string;
  latitude: number | null;
  longitude: number | null;
};

export function emptyVendorForm(): VendorFormState {
  return {
    name: "",
    category: CATEGORIES[0].id,
    city: VILLES[0],
    neighborhood: "",
    phone: "",
    description: "",
    priceInfo: "",
    latitude: null,
    longitude: null,
  };
}

export default function VendorFormFields({
  form,
  setForm,
}: {
  form: VendorFormState;
  setForm: (f: VendorFormState) => void;
}) {
  const set = (field: keyof VendorFormState, value: any) => setForm({ ...form, [field]: value });
  const center = CITY_COORDS[form.city] || CITY_COORDS["Autre"];
  const pinValue: [number, number] | null =
    form.latitude != null && form.longitude != null ? [form.latitude, form.longitude] : null;

  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "#78716C" }}>
          Nom du commerce *
        </span>
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-sm border border-line"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "#78716C" }}>
            Catégorie
          </span>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-sm border border-line"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "#78716C" }}>
            Ville *
          </span>
          <select
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-sm border border-line"
          >
            {VILLES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "#78716C" }}>
          Quartier
        </span>
        <input
          value={form.neighborhood}
          onChange={(e) => set("neighborhood", e.target.value)}
          className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-sm border border-line"
        />
      </label>

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "#78716C" }}>
          Téléphone / WhatsApp *
        </span>
        <input
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-sm border border-line"
        />
      </label>

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "#78716C" }}>
          Description
        </span>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-sm border border-line resize-none"
        />
      </label>

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "#78716C" }}>
          Prix (optionnel)
        </span>
        <input
          value={form.priceInfo}
          onChange={(e) => set("priceInfo", e.target.value)}
          placeholder="Ex : à partir de 1500 FCFA/kg"
          className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-sm border border-line"
        />
      </label>

      <div>
        <span className="font-mono text-[11px] uppercase tracking-wide" style={{ color: "#78716C" }}>
          Emplacement (cliquez sur la carte)
        </span>
        <div className="mt-1.5">
          <LocationPicker
            value={pinValue}
            center={center as [number, number]}
            onChange={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
          />
        </div>
      </div>
    </div>
  );
}
