"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

const typesService = [
  "Mécanique",
  "Électricité",
  "Pneu",
  "Dépannage",
  "Remorquage",
  "Carrosserie",
  "Vidange",
  "Batterie",
];

const categories = ["Moto", "Véhicule", "Les deux"];
const typesInstallation = ["Atelier Fixe", "Dépanneur Mobile"];

interface PrestataireFormData {
  nom: string;
  prenom: string;
  nom_atelier: string;
  telephone: string;
  whatsapp: string;
  type_service: string;
  categorie: string;
  type_installation: string;
  est_autonome: boolean;
  adresse: string;
  latitude: string;
  longitude: string;
}

export default function PrestataireForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<PrestataireFormData>({
    nom: "",
    prenom: "",
    nom_atelier: "",
    telephone: "",
    whatsapp: "",
    type_service: "",
    categorie: "",
    type_installation: "Atelier Fixe",
    est_autonome: true,
    adresse: "",
    latitude: "",
    longitude: "",
  });
  const [files, setFiles] = useState<{
    photo_cip: File | null;
    photo_cnib: File | null;
    photo_ifu: File | null;
    photo_atelier: File | null;
  }>({
    photo_cip: null,
    photo_cnib: null,
    photo_ifu: null,
    photo_atelier: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: keyof typeof files, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFiles((prev) => ({ ...prev, [name]: e.target.files![0] }));
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }));
      },
      (err) => alert("Erreur GPS: " + err.message)
    );
  };

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error } = await supabase.storage
      .from("documents")
      .upload(`${path}/${fileName}`, file);
    if (error) return null;
    const { data } = supabase.storage.from("documents").getPublicUrl(`${path}/${fileName}`);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const photoCipUrl = files.photo_cip ? await uploadFile(files.photo_cip, "cip") : null;
      const photoCnibUrl = files.photo_cnib ? await uploadFile(files.photo_cnib, "cnib") : null;
      const photoIfuUrl = files.photo_ifu ? await uploadFile(files.photo_ifu, "ifu") : null;
      const photoAtelierUrl = files.photo_atelier
        ? await uploadFile(files.photo_atelier, "atelier")
        : null;

      const { error } = await supabase.from("prestataires").insert({
        nom: form.nom,
        prenom: form.prenom,
        nom_atelier: form.nom_atelier,
        telephone: form.telephone,
        whatsapp: form.whatsapp || null,
        type_service: form.type_service,
        categorie: form.categorie,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        adresse: form.adresse || null,
        photo_cip: photoCipUrl,
        photo_cnib: photoCnibUrl,
        photo_ifu: photoIfuUrl,
        photo_atelier: photoAtelierUrl,
        statut: "en_attente",
        est_disponible: true,
        note_moyenne: 0,
        nombre_avis: 0,
        wallet_solde: 0,
      });

      if (error) throw error;
      router.push("/prestataires");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      alert("Erreur lors de la création: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "input-field";
  const labelClass = "label";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
              step === s
                ? "bg-primary-500 text-white"
                : step > s
                ? "bg-primary-100 text-primary-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {s}
          </button>
        ))}
        <span className="text-sm text-gray-500">
          {step === 1 && "Identité"}
          {step === 2 && "Atelier"}
          {step === 3 && "Documents"}
          {step === 4 && "Validation"}
        </span>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Nom</label>
            <input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Nom du prestataire"
            />
          </div>
          <div>
            <label className={labelClass}>Prénom</label>
            <input
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Prénom du prestataire"
            />
          </div>
          <div>
            <label className={labelClass}>Téléphone</label>
            <input
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="+229 XX XX XX XX"
            />
          </div>
          <div>
            <label className={labelClass}>WhatsApp (optionnel)</label>
            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              className={inputClass}
              placeholder="+229 XX XX XX XX"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Nom de l&apos;atelier</label>
            <input
              name="nom_atelier"
              value={form.nom_atelier}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Nom de l'atelier"
            />
          </div>
          <div>
            <label className={labelClass}>Type de service</label>
            <select
              name="type_service"
              value={form.type_service}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="">Choisir...</option>
              {typesService.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Catégorie</label>
            <select
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="">Choisir...</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Type d&apos;installation</label>
            <select
              name="type_installation"
              value={form.type_installation}
              onChange={handleChange}
              required
              className="select-field"
            >
              {typesInstallation.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex items-center gap-2 py-2">
             <input
                type="checkbox"
                checked={form.est_autonome}
                onChange={(e) => setForm({...form, est_autonome: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300 text-primary-600"
             />
             <label className="text-sm font-medium text-gray-700">Utilise l&apos;application (Autonome)</label>
          </div>
          <div>
            <label className={labelClass}>Adresse</label>
            <input
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              className={inputClass}
              placeholder="Adresse complète"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Localisation GPS</label>
            <div className="flex gap-2">
              <input
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                className={inputClass}
                placeholder="Latitude"
                readOnly
              />
              <input
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                className={inputClass}
                placeholder="Longitude"
                readOnly
              />
              <button
                type="button"
                onClick={getLocation}
                className="btn-secondary shrink-0"
              >
                <MapPin className="h-4 w-4" />
                GPS
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { key: "photo_cip" as const, label: "Photo CIP" },
            { key: "photo_cnib" as const, label: "Photo CNIB" },
            { key: "photo_ifu" as const, label: "Photo IFU" },
            { key: "photo_atelier" as const, label: "Photo Atelier" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-all hover:border-primary-400 hover:bg-primary-50">
                <Upload className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {files[key]?.name || `Télécharger ${label}`}
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG jusqu&apos;à 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(key, e)}
                  className="hidden"
                />
              </label>
            </div>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="section-title">Récapitulatif</h3>
          <div className="rounded-lg bg-gray-50 p-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-500">Nom:</span>{" "}
                <span className="font-medium">
                  {form.prenom} {form.nom}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Atelier:</span>{" "}
                <span className="font-medium">{form.nom_atelier}</span>
              </div>
              <div>
                <span className="text-gray-500">Téléphone:</span>{" "}
                <span className="font-medium">{form.telephone}</span>
              </div>
              <div>
                <span className="text-gray-500">Service:</span>{" "}
                <span className="font-medium">{form.type_service}</span>
              </div>
              <div>
                <span className="text-gray-500">Catégorie:</span>{" "}
                <span className="font-medium">{form.categorie}</span>
              </div>
              <div>
                <span className="text-gray-500">Documents:</span>{" "}
                <span className="font-medium">
                  {Object.values(files).filter(Boolean).length}/4
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="btn-secondary"
          >
            Précédent
          </button>
        ) : (
          <div />
        )}
        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="btn-primary"
          >
            Suivant
          </button>
        ) : (
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Création..." : "Créer le prestataire"}
          </button>
        )}
      </div>
    </form>
  );
}
