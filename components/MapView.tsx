"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function MapView({
  vendors,
  center = [7.539989, -5.54708],
  zoom = 6,
  height = 420,
}: {
  vendors: any[];
  center?: [number, number];
  zoom?: number;
  height?: number;
}) {
  const withCoords = vendors.filter((v) => v.latitude != null && v.longitude != null);

  return (
    <div className="stitch overflow-hidden" style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map((v) => (
          <Marker key={v.id} position={[v.latitude, v.longitude]} icon={markerIcon}>
            <Popup>
              <div className="font-body">
                <strong>{v.name}</strong>
                <br />
                {v.city}
                <br />
                <Link href={`/vendors/${v.id}`} style={{ color: "#B85C38" }}>
                  Voir la fiche →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
