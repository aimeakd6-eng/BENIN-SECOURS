import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Phone, MessageCircle, MapPin, Star,
  CheckCircle2, AlertTriangle, XCircle, Wrench, Shield
} from "lucide-react";
import { useDemande } from "@/context/DemandeContext";
import { useAuth } from "@/context/AuthContext";
import { creerDemande, updateDemandePrestataire, creerIntervention } from "@/services/supabase_service";

export default function DetailDepanneurScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { userLocation, categorieVehicule, typePanne, description, setCurrentDemandeId } = useDemande();

  const [loading, setLoading] = useState(false);

  const prestataires = JSON.parse(localStorage.getItem("derniers_prestataires") || "[]");
  const prestataire = prestataires.find((p: any) => p.id === id);

  const handleDemander = async () => {
    if (!profile) { navigate("/login"); return; }
    if (!userLocation || !typePanne || !categorieVehicule) { navigate("/signaler-panne"); return; }

    setLoading(true);
    const demande = await creerDemande(profile.id, categorieVehicule, typePanne, userLocation.latitude, userLocation.longitude, description);
    if (demande && id) {
      await updateDemandePrestataire(demande.id, id);
      await creerIntervention(demande.id, id, profile.id);
      setCurrentDemandeId(demande.id);
      navigate(`/demande/${demande.id}`);
    } else {
      setLoading(false);
    }
  };

  if (!prestataire) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0F0F0E] px-4">
        <AlertTriangle className="mb-3 h-12 w-12 text-zinc-600" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-center">Prestataire introuvable</p>
        <button onClick={() => navigate("/depanneurs")}
          className="mt-6 rounded-2xl bg-[#FFFF00] px-8 py-4 text-xs font-black uppercase tracking-widest text-black">
          RETOUR
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#0F0F0E] text-white">
      <header className="flex items-center justify-between px-6 py-6">
        <button onClick={() => navigate(-1)} className="text-zinc-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">Fiche Dépanneur</h1>
        <button onClick={() => navigate("/")} className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
          <XCircle className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6">
        {/* Profile Card */}
        <div className="rounded-3xl bg-[#1C1C1A] p-8 border border-[#2D2D2A] shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-zinc-800 border-2 border-[#FFFF00] overflow-hidden shadow-[0_0_20px_rgba(255,255,0,0.1)]">
                   {prestataire.photo_atelier ? (
                       <img src={prestataire.photo_atelier} className="h-full w-full object-cover" />
                   ) : (
                       <span className="text-3xl font-black text-[#FFFF00]">{prestataire.prenom?.[0]}{prestataire.nom?.[0]}</span>
                   )}
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#FFFF00] border-4 border-[#1C1C1A] flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-black" strokeWidth={3} />
                </div>
            </div>

            <h2 className="mt-6 text-2xl font-black text-white">{prestataire.prenom} {prestataire.nom}</h2>
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 mt-1">{prestataire.nom_atelier}</p>

            <div className="mt-4 flex items-center gap-2 rounded-full bg-[#FFFF00]/10 px-4 py-1.5 border border-[#FFFF00]/20">
                <Star className="h-4 w-4 fill-[#FFFF00] text-[#FFFF00]" />
                <span className="text-sm font-black text-[#FFFF00]">{prestataire.note_moyenne?.toFixed(1) || "0.0"}</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">({prestataire.nombre_avis || 0} avis)</span>
            </div>
          </div>

          <div className="mt-8 space-y-4 border-t border-zinc-800 pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                <Wrench className="h-5 w-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Service</p>
                <p className="text-sm font-black text-white uppercase">{prestataire.type_service}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                <MapPin className="h-5 w-5 text-zinc-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Localisation</p>
                <p className="text-sm font-medium text-zinc-300 truncate">
                  {prestataire.type_installation === "Dépanneur Mobile" ? "Mobile (Il vient vers vous)" : prestataire.adresse || "Cotonou, Bénin"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <a href={`tel:${prestataire.telephone}`}
            className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-zinc-800 p-6 border border-zinc-700 transition-all active:scale-[0.95]">
            <Phone className="h-6 w-6 text-[#FFFF00]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Appeler</span>
          </a>
          <a href={`https://wa.me/${prestataire.whatsapp?.replace(/\+/g, "")}`} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-zinc-800 p-6 border border-zinc-700 transition-all active:scale-[0.95]">
            <MessageCircle className="h-6 w-6 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">WhatsApp</span>
          </a>
        </div>

        <div className="mt-8 mb-10 rounded-3xl bg-red-900/10 p-6 border border-red-900/30">
            <div className="flex gap-4">
                <Shield className="h-6 w-6 text-red-500 shrink-0" />
                <p className="text-xs font-bold text-red-300 leading-relaxed uppercase tracking-wider">
                    Passez par la plateforme pour bénéficier de l'assistance sécurisée.
                </p>
            </div>
        </div>
      </main>

      <footer className="shrink-0 p-6 bg-[#0F0F0E] border-t border-zinc-900">
        <button onClick={handleDemander} disabled={loading}
          className="w-full rounded-2xl bg-[#FFFF00] py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-2xl shadow-[#FFFF00]/20 transition-all active:scale-[0.98] disabled:opacity-50">
          {loading ? "Chargement..." : "Confirmer l'assistance"}
        </button>
      </footer>
    </div>
  );
}
