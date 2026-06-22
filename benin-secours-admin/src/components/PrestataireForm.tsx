"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Upload, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

const typesService = ["Mécanique", "Électricité", "Pneu", "Dépannage", "Remorquage", "Carrosserie", "Vidange", "Batterie"];
const categories = ["Moto", "Véhicule", "Les deux"];
const typesInstallation = ["Atelier Fixe", "Dépanneur Mobile"];

interface PrestataireFormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
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
    email: "",
    password: "",
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
  const [files, setFiles] = useState<any>({
    photo_cip: null, photo_cnib: null, photo_ifu: null, photo_atelier: null
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, e: any) => {
    if (e.target.files?.[0]) {
      setFiles((prev: any) => ({ ...prev, [name]: e.target.files[0] }));
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({ ...prev, latitude: pos.coords.latitude.toString(), longitude: pos.coords.longitude.toString() }));
    }, (err) => alert("Erreur GPS: " + err.message));
  };

  const uploadFile = async (file: File, path: string) => {
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const { data, error } = await supabase.storage.from("documents").upload(`${path}/${fileName}`, file);
    if (error) return null;
    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Créer le compte Auth avec Email et Password choisis par l'Admin
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;
      const userId = authData.user?.id;

      // 2. Upload Documents
      const cipUrl = files.photo_cip ? await uploadFile(files.photo_cip, "cip") : null;
      const cnibUrl = files.photo_cnib ? await uploadFile(files.photo_cnib, "cnib") : null;
      const ifuUrl = files.photo_ifu ? await uploadFile(files.photo_ifu, "ifu") : null;
      const atelierUrl = files.photo_atelier ? await uploadFile(files.photo_atelier, "atelier") : null;

      // 3. Créer Profil
      await supabase.from("profiles").insert({
        id: userId,
        email: form.email,
        full_name: `${form.prenom} ${form.nom}`,
        telephone: form.telephone,
        role: "prestataire"
      });

      // 4. Créer Prestataire
      const { error: prestError } = await supabase.from("prestataires").insert({
        id: userId,
        nom: form.nom,
        prenom: form.prenom,
        nom_atelier: form.nom_atelier,
        telephone: form.telephone,
        whatsapp: form.whatsapp || null,
        type_service: form.type_service,
        categorie: form.categorie,
        latitude: parseFloat(form.latitude) || null,
        longitude: parseFloat(form.longitude) || null,
        adresse: form.adresse || null,
        photo_cip: cipUrl,
        photo_cnib: cnibUrl,
        photo_ifu: ifuUrl,
        photo_atelier: atelierUrl,
        statut: "en_attente",
        est_disponible: true,
        note_moyenne: 0,
        nombre_avis: 0,
        wallet_solde: 0,
        updated_at: new Date().toISOString()
      });

      if (prestError) throw prestError;
      router.push("/prestataires");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "input-field";
  const labelClass = "label";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
        {[1, 2, 3, 4].map((s) => (
          <button key={s} type="button" onClick={() => setStep(s)} className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black transition-all ${step === s ? "bg-primary-500 text-black" : "bg-zinc-800 text-gray-500"}`}>{s}</button>
        ))}
        <span className="text-xs font-bold text-white uppercase tracking-tight ml-2">Étape {step}</span>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2"><label className={labelClass}>Nom</label><input name="nom" value={form.nom} onChange={handleChange} required className={inputClass} /></div>
          <div className="space-y-2"><label className={labelClass}>Prénom</label><input name="prenom" value={form.prenom} onChange={handleChange} required className={inputClass} /></div>
          <div className="space-y-2">
            <label className={labelClass}>Email (Identifiant)</label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field pl-10" placeholder="artisan@gmail.com" />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Mot de passe</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input name="password" value={form.password} onChange={handleChange} required className="input-field pl-10" placeholder="Min 6 caractères" />
            </div>
          </div>
          <div className="space-y-2"><label className={labelClass}>Téléphone</label><input name="telephone" value={form.telephone} onChange={handleChange} required className={inputClass} /></div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2"><label className={labelClass}>Atelier</label><input name="nom_atelier" value={form.nom_atelier} onChange={handleChange} required className={inputClass} /></div>
          <div className="space-y-2"><label className={labelClass}>Service</label><select name="type_service" value={form.type_service} onChange={handleChange} required className="select-field">{typesService.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          <div className="space-y-2"><label className={labelClass}>Catégorie</label><select name="categorie" value={form.categorie} onChange={handleChange} required className="select-field">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div className="space-y-2"><label className={labelClass}>Localisation</label><div className="flex gap-2"><input name="latitude" value={form.latitude} readOnly className="input-field bg-zinc-900" /><button type="button" onClick={getLocation} className="btn-primary">GPS</button></div></div>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {["photo_cip", "photo_cnib", "photo_ifu", "photo_atelier"].map(doc => (
                <div key={doc} className="space-y-2">
                    <label className={labelClass}>{doc.toUpperCase()}</label>
                    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-800 p-6 bg-zinc-900/50">
                        <Upload className="h-6 w-6 text-zinc-500" />
                        <span className="text-xs text-zinc-400">{files[doc]?.name || "Sélectionner"}</span>
                        <input type="file" className="hidden" onChange={(e) => handleFileChange(doc, e)} />
                    </label>
                </div>
            ))}
        </div>
      )}

      {step === 4 && (
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 text-center">
            <h3 className="text-xl font-black text-white">Confirmation</h3>
            <p className="mt-4 text-sm text-zinc-400">Le prestataire {form.prenom} utilisera l'email <b>{form.email}</b> pour se connecter.</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-8">
        {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary">Précédent</button>}
        {step < 4 ? <button type="button" onClick={() => setStep(step + 1)} className="btn-primary">Suivant</button> : <button type="submit" disabled={loading} className="btn-primary">Créer le compte</button>}
      </div>
    </form>
  );
}
