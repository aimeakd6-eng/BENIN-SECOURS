import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Phone, MessageCircle, MapPin, Star,
  Navigation, CheckCircle2, AlertTriangle, CheckCircle
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
      <div className="flex h-screen flex-col items-center justify-center px-4" style={{ backgroundColor: "var(--color-bg)" }}>
        <AlertTriangle className="mb-3 h-10 w-10 text-gray-400" />
        <p className="text-gray-500">Prestataire introuvable</p>
        <button onClick={() => navigate("/depanneurs")}
          className="mt-4 rounded-xl px-6 py-3 text-sm font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <header className="flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
        <button onClick={() => navigate("/depanneurs")} className="rounded-full p-1.5 text-gray-600 transition-all active:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Fiche dépanneur</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
              {prestataire.prenom?.[0]}{prestataire.nom?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 truncate">{prestataire.prenom} {prestataire.nom}</h2>
                {prestataire.statut === "validé" && (
                  <CheckCircle className="h-5 w-5 fill-blue-500 text-white" />
                )}
              </div>
              <p className="text-sm text-gray-500">{prestataire.nom_atelier}</p>
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{prestataire.note_moyenne?.toFixed(1) || "0"}</span>
                <span className="text-xs text-gray-400">({prestataire.nombre_avis || 0} avis)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex items-center gap-3 text-gray-500">
              <MapPin className="h-4 w-4 text-gray-400" />
              {prestataire.type_installation === "Dépanneur Mobile" ? "📍 Dépanneur Mobile (Se déplace)" : prestataire.adresse || "Adresse non renseignée"}
            </div>
            {!prestataire.est_autonome && (
              <div className="rounded-lg bg-blue-50 p-3 text-[10px] text-blue-700">
                ℹ️ Ce dépanneur travaille par appel direct uniquement.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-amber-50 p-4 border border-amber-100">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-800">GARANTIE BENIN SECOURS</p>
              <p className="mt-0.5 text-[10px] text-amber-700 leading-tight">
                Pour votre sécurité, passez toujours par le bouton <b>"Demander l'intervention"</b> ci-dessous.
                Cela permet de tracer l'artisan et de garantir les tarifs officiels.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <a href={`tel:${prestataire.telephone}`}
            className="flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#4A90E2" }}>
            <Phone className="h-5 w-5" />Appeler
          </a>
          {prestataire.whatsapp && (
            <a href={`https://wa.me/${prestataire.whatsapp.replace(/\+/g, "")}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98]">
              <MessageCircle className="h-5 w-5" />WhatsApp
            </a>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-gray-200 bg-white p-4">
        <button onClick={handleDemander} disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)", boxShadow: "0 4px 14px rgba(74, 144, 226, 0.3)" }}>
          <CheckCircle2 className="h-5 w-5" />
          {loading ? "Création..." : "DEMANDER INTERVENTION"}
        </button>
      </footer>
    </div>
  );
}
