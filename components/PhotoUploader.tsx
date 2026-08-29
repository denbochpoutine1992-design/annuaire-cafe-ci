"use client";

import { useState } from "react";

export default function PhotoUploader({
  vendorId,
  onUploaded,
}: {
  vendorId: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) {
      setError("Upload de photos non configuré (variables Cloudinary manquantes).");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.secure_url) throw new Error("Échec de l'upload");

      const saveRes = await fetch(`/api/vendors/${vendorId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.secure_url }),
      });
      if (!saveRes.ok) throw new Error("Échec de l'enregistrement");

      onUploaded(data.secure_url);
    } catch (err) {
      setError("L'envoi de la photo a échoué. Réessayez.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="btn-primary inline-block px-4 py-2 rounded-full text-sm font-mono cursor-pointer">
        {uploading ? "Envoi..." : "Ajouter une photo"}
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
      </label>
      {error && <p className="text-xs mt-2" style={{ color: "#B85C38" }}>{error}</p>}
    </div>
  );
}
