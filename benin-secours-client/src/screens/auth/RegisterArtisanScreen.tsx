import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, Upload, MapPin, X } from "lucide-react";
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
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
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

      const cipUrl = files.photo_cip ? await uploadFile(files.photo_cip, "cip") : null;
      const cnibUrl = files.photo_cnib ? await uploadFile(files.photo_cnib, "cnib") : null;
      const ifuUrl = files.photo_ifu ? await uploadFile(files.photo_ifu, "ifu") : null;
      const atelierUrl = files.photo_atelier ? await uploadFile(files.photo_atelier, "atelier") : null;

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
      setStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "#1C1C1A",
    color: "#FFFFFF",
    borderColor: "#2D2D2A"
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0F0F0E] text-white">
      <header className="flex items-center justify-between px-6 py-6">
        <button onClick={() => step > 1 && step < 4 ? setStep(step - 1) : navigate("/register")} className="text-zinc-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-widest text-[#FFFF00]">BENIN-SECOURS</h1>
        <button onClick={() => navigate("/")} className="text-zinc-400">
          <X className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 px-8 py-4">
        {step < 4 && (
          <div className="mb-10 flex justify-between gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-[#FFFF00]" : "bg-zinc-800"}`} />
            ))}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-900/50 bg-red-900/10 p-4 text-xs font-bold uppercase tracking-widest text-red-500">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">Identité</h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Étape 1 sur 3</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Nom complet</label>
                    <input name="fullName" placeholder="Ex: Koffi AKODO" value={form.fullName} onChange={handleChange} style={inputStyle} className="w-full rounded-2xl border px-5 py-4 text-sm font-medium outline-none focus:border-[#FFFF00]" />
                </div>
                <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Email professionnel</label>
                    <input name="email" type="email" placeholder="votre@email.com" value={form.email} onChange={handleChange} style={inputStyle} className="w-full rounded-2xl border px-5 py-4 text-sm font-medium outline-none focus:border-[#FFFF00]" />
                </div>
                <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Mot de passe</label>
                    <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} style={inputStyle} className="w-full rounded-2xl border px-5 py-4 text-sm font-medium outline-none focus:border-[#FFFF00]" />
                </div>
                <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Téléphone</label>
                    <input name="telephone" placeholder="+229 XX XX XX XX" value={form.telephone} onChange={handleChange} style={inputStyle} className="w-full rounded-2xl border px-5 py-4 text-sm font-medium outline-none focus:border-[#FFFF00]" />
                </div>
            </div>

            <button onClick={() => setStep(2)} className="mt-4 w-full rounded-full bg-[#FFFF00] py-4 text-sm font-black uppercase tracking-widest text-black shadow-xl shadow-[#FFFF00]/10 transition-all active:scale-[0.98]">SUIVANT</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">Activité</h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Étape 2 sur 3</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Nom de l'atelier</label>
                    <input name="nomAtelier" placeholder="Ex: Garage du Progrès" value={form.nomAtelier} onChange={handleChange} style={inputStyle} className="w-full rounded-2xl border px-5 py-4 text-sm font-medium outline-none focus:border-[#FFFF00]" />
                </div>

                <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Spécialité</label>
                    <select name="typeService" value={form.typeService} onChange={handleChange} style={inputStyle} className="w-full rounded-2xl border px-5 py-4 text-sm font-medium outline-none focus:border-[#FFFF00]">
                        <option value="">Choisir...</option>
                        {typesService.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Localisation GPS</label>
                    <div className="flex gap-2">
                        <input name="latitude" placeholder="Latitude" value={form.latitude} readOnly style={inputStyle} className="flex-1 rounded-2xl border px-5 py-4 text-xs font-mono outline-none" />
                        <button onClick={getLocation} className="rounded-2xl bg-zinc-800 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#FFFF00] border border-zinc-700">GPS</button>
                    </div>
                </div>
            </div>

            <button onClick={() => setStep(3)} className="mt-4 w-full rounded-full bg-[#FFFF00] py-4 text-sm font-black uppercase tracking-widest text-black shadow-xl shadow-[#FFFF00]/10 transition-all active:scale-[0.98]">SUIVANT</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 pb-10">
            <div className="mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">Documents</h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Étape finale (KYC)</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {["photo_cip", "photo_cnib", "photo_ifu", "photo_atelier"].map(doc => (
                <label key={doc} className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed p-6 transition-all ${files[doc] ? "border-[#FFFF00] bg-[#FFFF00]/5" : "border-zinc-800 bg-[#1C1C1A]"}`}>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{doc.replace("photo_", "")}</span>
                        <span className="text-[8px] text-zinc-600 mt-1 uppercase">Format PNG/JPG</span>
                    </div>
                    {files[doc] ? <CheckCircle className="h-6 w-6 text-[#FFFF00]" /> : <Upload className="h-6 w-6 text-zinc-700" />}
                    <input type="file" className="hidden" onChange={(e) => handleFileChange(doc, e)} />
                </label>
                ))}
            </div>

            <button onClick={handleSubmit} disabled={loading} className="mt-4 w-full rounded-full bg-[#FFFF00] py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-2xl shadow-[#FFFF00]/20 disabled:opacity-50 transition-all active:scale-[0.98]">
              {loading ? "ENVOI EN COURS..." : "SOUMETTRE DOSSIER"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
            <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-[#FFFF00] shadow-[0_0_40px_rgba(255,255,0,0.2)]">
              <CheckCircle className="h-14 w-14 text-black" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Dossier reçu !</h2>
            <p className="mt-6 px-4 text-sm font-medium text-zinc-500 leading-relaxed uppercase tracking-widest">
              Vérification en cours sous 24h.
            </p>
            <button onClick={() => navigate("/login")} className="mt-12 w-full rounded-full bg-zinc-800 py-5 text-xs font-black uppercase tracking-widest text-zinc-400">RETOUR À LA CONNEXION</button>
          </div>
        )}
      </main>
    </div>
  );
}
