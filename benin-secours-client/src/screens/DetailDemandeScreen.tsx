import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Phone, MessageCircle, MapPin, Clock, Star,
  XCircle, AlertTriangle, CheckCircle, CreditCard, Car
} from "lucide-react";

declare global {
  interface Window {
    openKkiapayWidget: any;
    addKkiapayListener: any;
  }
}
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
  acceptée: { label: "Acceptée", className: "bg-blue-50 text-blue-700", icon: CheckCircle },
  en_cours: { label: "En cours", className: "bg-purple-50 text-purple-700", icon: Car },
  complétée: { label: "Complétée", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle },
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

    window.openKkiapayWidget({
      amount: 5000,
      position: "center",
      callback: "/mes-demandes",
      data: "Paiement intervention " + demande.id,
      key: "de23467000c211ef9bc19d380720468a",
      sandbox: true
    });

    window.addKkiapayListener("success", async (response: any) => {
        const { data: intData } = await supabase
            .from("interventions")
            .select("id")
            .eq("demande_id", demande.id)
            .single();

        if (intData) {
            await supabase.from("paiements").insert({
                intervention_id: intData.id,
                kkiapay_transaction_id: response.transactionId,
                montant: 5000,
                statut: "payé",
                methode: "mtn"
            });
        }

        alert("Paiement effectué avec succès !");
        navigate("/mes-demandes");
    });
  };

  if (!demande) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0F0F0E] px-4">
        <AlertTriangle className="mb-3 h-12 w-12 text-zinc-600" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-center">Demande introuvable</p>
        <button onClick={() => navigate("/mes-demandes")}
          className="mt-6 rounded-2xl bg-[#FFFF00] px-8 py-4 text-xs font-black uppercase tracking-widest text-black">
          RETOUR
        </button>
      </div>
    );
  }

  const cfg = statutConfig[demande.statut] || statutConfig.en_attente;
  const Icon = cfg.icon;
  const prestataire = demande.prestataire;

  return (
    <div className="flex h-screen flex-col bg-[#0F0F0E] text-white">
      <header className="flex items-center justify-between px-6 py-6">
        <button onClick={() => navigate("/mes-demandes")} className="text-zinc-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">Suivi Demande</h1>
        <button onClick={() => navigate("/")} className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
          <XCircle className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6">
        {(demande.statut === "acceptée" || demande.statut === "en_cours") && prestataire && (
          <div className="mb-6 h-48 overflow-hidden rounded-3xl border border-[#2D2D2A] relative">
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
            <div className="absolute top-4 left-4 z-[1000] rounded-full bg-[#FFFF00] px-4 py-1.5 text-[10px] font-black shadow-xl text-black animate-pulse uppercase tracking-widest">
              Dépanneur en route
            </div>
          </div>
        )}

        <div className="rounded-3xl bg-[#1C1C1A] p-6 border border-[#2D2D2A] shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFFF00]/10 text-[#FFFF00]">
                {demande.categorie_vehicule === "Moto" ? <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 20c0 1.65 1.35 3 3 3s3-1.35 3-3-1.35-3-3-3-3 1.35-3 3zm14-5c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm-9.3-4.7l2.8-4.8c.3-.5 1-.6 1.4-.3.5.3.6 1 .3 1.4L11.5 11H16c.6 0 1 .4 1 1s-.4 1-1 1h-5.5c-.3 0-.6-.1-.8-.4l-2-3.3-3.7 3.7V17h2v2H4c-.6 0-1-.4-1-1v-5c0-.3.1-.5.3-.7l4.4-4.4c.3-.3.8-.4 1.2-.2z"/></svg> : <Car className="h-6 w-6" />}
              </div>
              <h2 className="text-xl font-black text-white">{demande.type_panne}</h2>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${cfg.className}`}>
              {cfg.label}
            </span>
          </div>
          {demande.description && <p className="mt-4 text-sm font-medium text-zinc-400 italic">"{demande.description}"</p>}
          <div className="mt-6 space-y-3 border-t border-zinc-800 pt-6">
            <div className="flex items-center gap-3 text-zinc-500">
                <MapPin className="h-4 w-4 text-[#FFFF00]" />
                <span className="text-xs font-bold uppercase tracking-tight">{demande.adresse_panne || "Position confirmée"}</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-500">
                <Clock className="h-4 w-4 text-[#FFFF00]" />
                <span className="text-xs font-bold uppercase tracking-tight">
                    {new Date(demande.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}
                </span>
            </div>
          </div>
        </div>

        {prestataire && (
          <div className="mt-6 rounded-3xl bg-[#1C1C1A] p-6 border border-[#2D2D2A]">
            <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Dépanneur</h3>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 font-black text-[#FFFF00] border border-zinc-700">
                {prestataire.prenom?.[0]}{prestataire.nom?.[0]}
              </div>
              <div className="flex-1">
                <p className="font-black text-white text-lg">{prestataire.prenom} {prestataire.nom}</p>
                <p className="text-xs font-bold text-zinc-500 uppercase">{prestataire.nom_atelier}</p>
              </div>
              <div className="flex items-center gap-1 bg-[#FFFF00]/10 px-2 py-1 rounded-lg">
                <Star className="h-3 w-3 fill-[#FFFF00] text-[#FFFF00]" />
                <span className="text-xs font-black text-[#FFFF00]">{prestataire.note_moyenne?.toFixed(1) || "0"}</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <a href={`tel:${prestataire.telephone}`} className="flex items-center justify-center gap-2 rounded-xl bg-zinc-800 py-4 text-xs font-black uppercase text-white transition-all active:scale-[0.98]">
                <Phone className="h-4 w-4 text-[#FFFF00]" />Appeler
              </a>
              <a href={`https://wa.me/${prestataire.whatsapp?.replace(/\+/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-800 py-4 text-xs font-black uppercase text-white transition-all active:scale-[0.98]">
                <MessageCircle className="h-4 w-4 text-emerald-500" />WhatsApp
              </a>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4 pb-10">
          {(demande.statut === "complétée" || (!prestataire?.est_autonome && (demande.statut === "acceptée" || demande.statut === "en_cours"))) && (
            <button onClick={handlePayment}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#FFFF00] py-5 text-sm font-black uppercase tracking-widest text-black shadow-xl shadow-[#FFFF00]/10 transition-all active:scale-[0.98]">
              <CreditCard className="h-5 w-5" />Payer l'intervention
            </button>
          )}
          {demande.statut === "complétée" && (
            <button onClick={() => navigate(`/notation/${id}`)}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-800 py-5 text-sm font-black uppercase tracking-widest text-white border border-zinc-700 transition-all active:scale-[0.98]">
              <Star className="h-5 w-5 text-[#FFFF00]" />Laisser un avis
            </button>
          )}
          {(demande.statut === "en_attente" || demande.statut === "acceptée") && (
            <button onClick={handleAnnuler} disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-red-900/30 bg-red-900/10 py-5 text-sm font-black uppercase tracking-widest text-red-500 transition-all active:scale-[0.98] disabled:opacity-50">
              <XCircle className="h-5 w-5" />{loading ? "Annulation..." : "Annuler la demande"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
