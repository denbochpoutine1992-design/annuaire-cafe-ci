"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

import type { Vendor } from "@/types/vendor";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

type Point = [number, number];

/** Ajuste la vue de la carte aux commerces affichés. */
function FitBounds({ points }: { points: Point[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(points, { padding: [40, 40], maxZoom: 14 });
  }, [map, points]);

  return null;
}

export default function MapView({
  vendors,
  center = [7.539989, -5.54708],
  zoom = 6,
  height = 420,
}: {
  vendors: Vendor[];
  center?: Point;
  zoom?: number;
  height?: number;
}) {
  const located = useMemo(
    () => vendors.filter((v) => v.latitude != null && v.longitude != null),
    [vendors]
  );

  const points = useMemo<Point[]>(
    () => located.map((v) => [v.latitude as number, v.longitude as number]),
    [located]
  );

  return (
    <div
      className="stitch relative overflow-hidden"
      style={{ height }}
      role="region"
      aria-label="Carte des commerces"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds points={points} />

        {located.map((v) => (
          <Marker
            key={v.id}
            position={[v.latitude as number, v.longitude as number]}
            icon={markerIcon}
          >
            <Popup>
              <div className="font-body">
                <strong>{v.name}</strong>
                {v.city && (
                  <>
                    <br />
                    {v.city}
                  </>
                )}
                <br />
                <Link href={`/vendors/${v.id}`} style={{ color: "#8A5C20" }}>
                  Voir la fiche
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {located.length === 0 && (
        <p className="pointer-events-none absolute inset-x-4 bottom-4 z-[1000] rounded-xl bg-white/95 px-4 py-3 text-center text-sm text-zinc-700 shadow">
          Aucun commerce de cette sélection n’a renseigné sa localisation.
        </p>
      )}
    </div>
  );
}
