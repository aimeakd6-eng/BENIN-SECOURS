import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/config/supabase";

const typesService = ["Mécanique", "Électricité", "Pneu", "Remorquage", "Vidange", "Batterie"];

export default function RegisterArtisanScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    telephone: "",
    whatsapp: "",
    nomAtelier: "",
    typeService: "",
    categorie: "Véhicule",
    adresse: "",
    latitude: "",
    longitude: ""
  });

  const [files, setFiles] = useState<any>({
    photo_cip: null,
    photo_cnib: null,
    photo_ifu: null,
    photo_atelier: null
  });

  const handleChange = (e: any) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (name: string, e: any) => {
    if (e.target.files?.[0]) {
      setFiles((prev: any) => ({ ...prev, [name]: e.target.files[0] }));
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString()
        }));
      },
      (err) => alert("Erreur GPS: " + err.message)
    );
  };

  const uploadFile = async (file: File, path: string) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(`${path}/${fileName}`, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Création du compte Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            telephone: form.telephone,
            role: "prestataire",
          }
        }
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Erreur de création d'utilisateur");

      // 2. Upload des documents
      const cipUrl = files.photo_cip ? await uploadFile(files.photo_cip, "cip") : null;
      const cnibUrl = files.photo_cnib ? await uploadFile(files.photo_cnib, "cnib") : null;
      const ifuUrl = files.photo_ifu ? await uploadFile(files.photo_ifu, "ifu") : null;
      const atelierUrl = files.photo_atelier ? await uploadFile(files.photo_atelier, "atelier") : null;

      // 3. Création du profil et prestataire
      await supabase.from("profiles").insert({
        id: userId,
        email: form.email,
        full_name: form.fullName,
        telephone: form.telephone,
        role: "prestataire"
      });

      const { error: prestError } = await supabase.from("prestataires").insert({
        id: userId,
        nom: form.fullName.split(" ")[1] || form.fullName,
        prenom: form.fullName.split(" ")[0],
        nom_atelier: form.nomAtelier,
        telephone: form.telephone,
        whatsapp: form.whatsapp,
        type_service: form.typeService,
        categorie: form.categorie,
        latitude: parseFloat(form.latitude) || null,
        longitude: parseFloat(form.longitude) || null,
        adresse: form.adresse,
        photo_cip: cipUrl,
        photo_cnib: cnibUrl,
        photo_ifu: ifuUrl,
        photo_atelier: atelierUrl,
        statut: "en_attente",
        est_disponible: false,
        note_moyenne: 0,
        nombre_avis: 0,
        wallet_solde: 0
      });

      if (prestError) throw prestError;

      setStep(4); // Succès
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
        <button onClick={() => step > 1 && step < 4 ? setStep(step - 1) : navigate("/register")} className="rounded-full p-1.5 text-gray-600 transition-all active:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Devenir Dépanneur</h1>
      </header>

      <main className="flex-1 px-5 py-6">
        {step < 4 && (
          <div className="mb-6 flex justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 w-[30%] rounded-full ${step >= s ? "bg-blue-600" : "bg-gray-200"}`} />
            ))}
          </div>
        )}

        {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Identité</h2>
            <input name="fullName" placeholder="Nom complet" value={form.fullName} onChange={handleChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none" />
            <input name="email" type="email" placeholder="Email professionnel" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none" />
            <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none" />
            <input name="telephone" placeholder="Téléphone principal" value={form.telephone} onChange={handleChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none" />
            <button onClick={() => setStep(2)} className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg">SUIVANT</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Activité & Service</h2>
            <input name="nomAtelier" placeholder="Nom de l'atelier (ou 'Indépendant')" value={form.nomAtelier} onChange={handleChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none" />

            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="is_mobile" className="h-4 w-4 rounded border-gray-300 text-blue-600" />
              <label htmlFor="is_mobile" className="text-sm text-gray-600 font-medium">Je suis un dépanneur mobile (sans atelier fixe)</label>
            </div>

            <select name="typeService" value={form.typeService} onChange={handleChange} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none">
              <option value="">Spécialité principale</option>
              {typesService.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex gap-2">
              <input name="latitude" placeholder="Latitude" value={form.latitude} readOnly className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none" />
              <button onClick={getLocation} className="rounded-xl bg-gray-100 px-4 py-3 text-xs font-bold text-gray-600">GPS</button>
            </div>
            <button onClick={() => setStep(3)} className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg">SUIVANT</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Documents KYC</h2>
            {["photo_cip", "photo_cnib", "photo_ifu", "photo_atelier"].map(doc => (
              <label key={doc} className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 p-4 bg-white">
                <span className="text-sm font-medium text-gray-500 uppercase">{doc.replace("photo_", "")}</span>
                {files[doc] ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Upload className="h-5 w-5 text-gray-400" />}
                <input type="file" className="hidden" onChange={(e) => handleFileChange(doc, e)} />
              </label>
            ))}
            <button onClick={handleSubmit} disabled={loading} className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg disabled:opacity-50">
              {loading ? "ENVOI EN COURS..." : "SOUMETTRE MON DOSSIER"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Dossier reçu !</h2>
            <p className="mt-4 px-4 text-sm text-gray-500 leading-relaxed">
              Votre inscription a été transmise avec succès. Nos administrateurs vont vérifier vos documents sous 24h à 48h. Vous recevrez une notification par email dès que votre compte sera validé.
            </p>
            <button onClick={() => navigate("/login")} className="mt-8 w-full rounded-xl border-2 border-blue-600 py-4 text-sm font-bold text-blue-600">RETOUR À LA CONNEXION</button>
          </div>
        )}
      </main>
    </div>
  );
}
