"use client";

import { useState } from "react";

export default function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
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
      setError("Upload de photos non configuré.");
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
      onChange(data.secure_url);
    } catch (err) {
      setError("L'envoi de la photo a échoué. Réessayez.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3">
      {value && (
        <img
          src={value}
          alt=""
          className="w-14 h-14 object-cover rounded-md"
          style={{ border: "1px solid #E7E5E4" }}
        />
      )}
      <label
        className="font-mono text-xs px-3 py-2 rounded-full border border-line cursor-pointer"
        style={{ color: "#18181B" }}
      >
        {uploading ? "Envoi..." : value ? "Changer la photo" : "Ajouter une photo"}
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
      </label>
      {error && <p className="text-xs" style={{ color: "#C2410C" }}>{error}</p>}
    </div>
  );
}
