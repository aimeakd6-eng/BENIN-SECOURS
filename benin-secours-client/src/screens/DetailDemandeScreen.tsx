import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Phone, MessageCircle, MapPin, Clock, Star,
  XCircle, AlertTriangle, CheckCircle2, CreditCard, Navigation
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { annulerDemande } from "@/services/supabase_service";
import { supabase } from "@/config/supabase";

// Icônes personnalisées pour la carte de suivi
const userIcon = L.divIcon({
  className: "user-marker",
  html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
  iconSize: [12, 12],
});

const artisanIcon = L.divIcon({
  className: "artisan-marker",
  html: `<div style="font-size: 20px;">🏃‍♂️</div>`,
  iconSize: [25, 25],
});

const statutConfig: Record<string, { label: string; className: string; icon: any }> = {
  en_attente: { label: "En attente", className: "bg-amber-50 text-amber-700", icon: Clock },
  acceptée: { label: "Acceptée", className: "bg-blue-50 text-blue-700", icon: CheckCircle2 },
  en_cours: { label: "En cours", className: "bg-purple-50 text-purple-700", icon: CarIcon },
  complétée: { label: "Complétée", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  annulée: { label: "Annulée", className: "bg-red-50 text-red-700", icon: XCircle },
};

export default function DetailDemandeScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const demandes = JSON.parse(localStorage.getItem("mes_demandes") || "[]");
  const demande = demandes.find((d: any) => d.id === id);

  const handleAnnuler = async () => {
    if (!id || !confirm("Êtes-vous sûr de vouloir annuler cette demande ?")) return;
    setLoading(true);
    await annulerDemande(id);
    setLoading(false);
    navigate("/mes-demandes");
  };

  const handlePayment = () => {
    if (!demande) return;

    // Configuration Kkiapay (Mode Test)
    openKkiapayWidget({
      amount: 5000, // Montant fictif pour le test (Ex: 5000 FCFA)
      position: "center",
      callback: "/mes-demandes",
      data: "Paiement intervention " + demande.id,
      key: "de23467000c211ef9bc19d380720468a", // Remplacer par une vraie clé
      sandbox: true
    });

    addKkiapayListener("success", async (response: any) => {
        console.log("Paiement réussi", response);

        // 1. Récupérer l'intervention liée à cette demande
        const { data: intData } = await supabase
            .from("interventions")
            .select("id")
            .eq("demande_id", demande.id)
            .single();

        // 2. Enregistrer le paiement (Le trigger SQL fera le calcul des 10%)
        if (intData) {
            await supabase.from("paiements").insert({
                intervention_id: intData.id,
                kkiapay_transaction_id: response.transactionId,
                montant: 5000,
                statut: "payé",
                methode: "mtn" // Par défaut pour le test
            });
        }

        alert("Paiement effectué avec succès !");
        navigate("/mes-demandes");
    });
  };

  if (!demande) {
    return (
      <div className="flex h-screen flex-col items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
        <AlertTriangle className="mb-3 h-10 w-10 text-gray-400" />
        <p className="text-gray-500">Demande introuvable</p>
        <button onClick={() => navigate("/mes-demandes")}
          className="mt-4 rounded-xl px-6 py-3 text-sm font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
          Retour
        </button>
      </div>
    );
  }

  const cfg = statutConfig[demande.statut] || statutConfig.en_attente;
  const Icon = cfg.icon;
  const prestataire = demande.prestataire;

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <header className="flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
        <button onClick={() => navigate("/mes-demandes")} className="rounded-full p-1.5 text-gray-600 transition-all active:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Détail demande</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        {/* Carte de suivi en temps réel */}
        {(demande.statut === "acceptée" || demande.statut === "en_cours") && prestataire && (
          <div className="mb-4 h-48 overflow-hidden rounded-2xl shadow-sm border border-gray-100">
            <MapContainer
              center={[demande.latitude, demande.longitude]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[demande.latitude, demande.longitude]} icon={userIcon} />
              {prestataire.latitude && prestataire.longitude && (
                <Marker position={[prestataire.latitude, prestataire.longitude]} icon={artisanIcon} />
              )}
            </MapContainer>
            <div className="absolute top-20 right-8 z-[1000] rounded-full bg-white px-3 py-1 text-[10px] font-bold shadow-md text-blue-600 animate-pulse">
              DÉPANNEUR EN ROUTE...
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{demande.type_panne}</h2>
              <span className="text-lg">{demande.categorie_vehicule === "Moto" ? "🏍️" : "🚗"}</span>
            </div>
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${cfg.className}`}>
              <Icon className="h-3 w-3" />{cfg.label}
            </span>
          </div>
          {demande.description && <p className="mt-3 text-sm text-gray-600">{demande.description}</p>}
          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex items-center gap-2 text-gray-500"><MapPin className="h-4 w-4" />{demande.adresse_panne || "Position GPS enregistrée"}</div>
            <div className="flex items-center gap-2 text-gray-500"><Clock className="h-4 w-4" />{new Date(demande.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}</div>
          </div>
        </div>

        {prestataire && (
          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Dépanneur assigné</h3>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
                {prestataire.prenom?.[0]}{prestataire.nom?.[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{prestataire.prenom} {prestataire.nom}</p>
                <p className="text-xs text-gray-500">{prestataire.nom_atelier}</p>
              </div>
              <div className="flex items-center gap-0.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{prestataire.note_moyenne?.toFixed(1) || "0"}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={`tel:${prestataire.telephone}`} className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all active:scale-[0.98]" style={{ backgroundColor: "#4A90E2" }}>
                <Phone className="h-4 w-4" />Appeler
              </a>
              {prestataire.whatsapp && (
                <a href={`https://wa.me/${prestataire.whatsapp.replace(/\+/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white transition-all active:scale-[0.98]">
                  <MessageCircle className="h-4 w-4" />WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {(demande.statut === "complétée" || (!prestataire?.est_autonome && (demande.statut === "acceptée" || demande.statut === "en_cours"))) && (
            <>
              <div className="rounded-xl bg-blue-50 p-4 border border-blue-100 mb-2">
                <p className="text-[10px] text-blue-700 text-center font-bold uppercase">
                  Paiement sécurisé obligatoire via l&apos;application
                </p>
              </div>
              <button onClick={handlePayment}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98]"
                style={{ backgroundColor: "#10B981", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)" }}>
                <CreditCard className="h-5 w-5" />PAYER L&apos;ARTISAN (5000 F)
              </button>
            </>
          )}
          {demande.statut === "complétée" && (
            <button onClick={() => navigate(`/notation/${id}`)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98]"
              style={{ backgroundColor: "var(--color-orange)", boxShadow: "0 4px 14px rgba(245, 166, 35, 0.3)" }}>
              <Star className="h-5 w-5" />ÉVALUER L&apos;INTERVENTION
            </button>
          )}
          {(demande.statut === "en_attente" || demande.statut === "acceptée") && (
            <button onClick={handleAnnuler} disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-200 bg-white py-4 text-sm font-bold text-red-500 transition-all active:scale-[0.98] disabled:opacity-50">
              <XCircle className="h-5 w-5" />{loading ? "Annulation..." : "ANNULER LA DEMANDE"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    </svg>
  );
}
