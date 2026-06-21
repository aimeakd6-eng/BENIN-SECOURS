"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  Clock,
  Wrench,
  Car,
  Wallet,
  ImageIcon,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { supabase, type Prestataire } from "@/lib/supabase";

const statutConfig = {
  en_attente: {
    label: "En attente",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: Clock,
  },
  validé: {
    label: "Validé",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: CheckCircle2,
  },
  suspendu: {
    label: "Suspendu",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: PauseCircle,
  },
  rejeté: {
    label: "Rejeté",
    className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    icon: XCircle,
  },
};

export default function DetailPrestatairePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prestataire, setPrestataire] = useState<Prestataire | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [motifRejet, setMotifRejet] = useState("");
  const [showRejetForm, setShowRejetForm] = useState(false);

  useEffect(() => {
    const fetchPrestataire = async () => {
      const { data } = await supabase
        .from("prestataires")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setPrestataire(data);
      setLoading(false);
    };

    fetchPrestataire();
  }, [id]);

  const handleAction = async (
    action: "valider" | "suspendre" | "rejeter" | "reactiver"
  ) => {
    if (action === "rejeter" && !motifRejet.trim()) {
      setShowRejetForm(true);
      return;
    }

    setActionLoading(true);

    let newStatut: string;
    let logAction: string;

    switch (action) {
      case "valider":
        newStatut = "validé";
        logAction = "valider_prestataire";
        break;
      case "suspendre":
        newStatut = "suspendu";
        logAction = "suspendre_prestataire";
        break;
      case "rejeter":
        newStatut = "rejeté";
        logAction = "rejeter_prestataire";
        break;
      case "reactiver":
        newStatut = "validé";
        logAction = "reactiver_prestataire";
        break;
      default:
        newStatut = "en_attente";
        logAction = "";
    }

    const updates: any = {
      statut: newStatut,
      updated_at: new Date().toISOString(),
    };
    if (action === "valider") updates.validated_at = new Date().toISOString();
    if (action === "rejeter") updates.motif_rejet = motifRejet;

    const { error } = await supabase
      .from("prestataires")
      .update(updates)
      .eq("id", id);

    if (error) {
      alert("Erreur: " + error.message);
      setActionLoading(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      await supabase.from("admin_actions").insert({
        admin_id: userData.user.id,
        action: logAction,
        prestataire_id: id,
        description: `Prestataire ${prestataire?.prenom} ${prestataire?.nom} - ${logAction}`,
        motif: action === "rejeter" ? motifRejet : null,
        date_action: new Date().toISOString(),
      });
    }

    if (prestataire) {
      setPrestataire({ ...prestataire, statut: newStatut as any });
    }
    setShowRejetForm(false);
    setActionLoading(false);
  };

  if (loading) {
    return (
      <MainLayout title="Chargement...">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  if (!prestataire) {
    return (
      <MainLayout title="Prestataire introuvable">
        <div className="flex h-64 flex-col items-center justify-center">
          <p className="text-gray-500">Ce prestataire n&apos;existe pas</p>
          <Link href="/prestataires" className="btn-primary mt-4">
            Retour à la liste
          </Link>
        </div>
      </MainLayout>
    );
  }

  const config = statutConfig[prestataire.statut];
  const StatusIcon = config.icon;

  return (
    <MainLayout
      title={`${prestataire.prenom} ${prestataire.nom}`}
      subtitle={prestataire.nom_atelier}
    >
      <Link
        href="/prestataires"
        className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-500 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la liste
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-800 border-2 border-primary-500/20 text-3xl font-black text-primary-500 shadow-inner">
                  {prestataire.prenom[0]}
                  {prestataire.nom[0]}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                    {prestataire.prenom} {prestataire.nom}
                  </h2>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
                    {prestataire.nom_atelier}
                  </p>
                  <span
                    className={`badge mt-4 border ${config.className} flex w-fit items-center gap-2 px-3 py-1`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {config.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 rounded-2xl bg-zinc-900 border border-dark-border p-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-800 text-primary-500/60">
                    <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Téléphone</p>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">
                    {prestataire.telephone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-zinc-900 border border-dark-border p-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-800 text-primary-500/60">
                    <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Service</p>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">
                    {prestataire.type_service}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-zinc-900 border border-dark-border p-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-800 text-primary-500/60">
                    <Car className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Catégorie</p>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">
                    {prestataire.categorie}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-zinc-900 border border-dark-border p-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-800 text-primary-500/60">
                    <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Adresse</p>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">
                    {prestataire.adresse || "Non renseigné"}
                  </p>
                </div>
              </div>
            </div>

            {prestataire.latitude && prestataire.longitude && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-primary-500/5 border border-primary-500/10 p-4">
                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary-500/20 text-primary-500">
                    <MapPin className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-500/60">Coordonnées GPS</p>
                    <p className="text-xs font-mono font-bold text-primary-500/80">
                      {prestataire.latitude.toFixed(6)}, {prestataire.longitude.toFixed(6)}
                    </p>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="section-title mb-6">Documents Légaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: "photo_cip", label: "Photo CIP" },
                { key: "photo_cnib", label: "Photo CNIB" },
                { key: "photo_ifu", label: "Photo IFU" },
                { key: "photo_atelier", label: "Photo Atelier" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center gap-4 rounded-2xl border border-dark-border bg-zinc-900 p-4 transition-all hover:border-primary-500/20"
                >
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-zinc-800 text-gray-500">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">{label}</p>
                    {prestataire[key as keyof Prestataire] ? (
                      <a
                        href={
                          prestataire[key as keyof Prestataire] as string
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-primary-500 hover:underline uppercase tracking-tighter block truncate"
                      >
                        Visualiser le document
                      </a>
                    ) : (
                      <p className="text-xs font-bold text-red-500/50 uppercase tracking-tighter">Manquant</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card border-l-4 border-l-primary-500">
            <h3 className="section-title mb-6 text-primary-500">Performances</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-dark-border">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Note moyenne</span>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <span className="text-xl font-black text-white">
                    {prestataire.note_moyenne.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-dark-border">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Avis reçus</span>
                <span className="text-xl font-black text-white">
                  {prestataire.nombre_avis}
                </span>
              </div>
              <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-dark-border">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Disponibilité</span>
                <span
                  className={`badge ${
                    prestataire.est_disponible
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-red-500/20 text-red-500"
                  } px-3 py-1`}
                >
                  {prestataire.est_disponible ? "Actif" : "Inactif"}
                </span>
              </div>
              <div className="bg-primary-500/10 p-5 rounded-2xl border border-primary-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">Solde Wallet</span>
                  </div>
                  <span className="text-2xl font-black text-primary-500">
                    {prestataire.wallet_solde.toLocaleString("fr-FR")} <span className="text-xs">F</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title mb-6">Gestion du compte</h3>
            <div className="space-y-4">
              {prestataire.statut === "en_attente" && (
                <>
                  <button
                    onClick={() => handleAction("valider")}
                    disabled={actionLoading}
                    className="btn-success w-full py-4 uppercase font-black tracking-widest text-xs"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approuver le dossier
                  </button>
                  <button
                    onClick={() => setShowRejetForm(true)}
                    disabled={actionLoading}
                    className="btn-danger w-full py-4 uppercase font-black tracking-widest text-xs bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500"
                  >
                    <XCircle className="h-4 w-4" />
                    Rejeter
                  </button>
                </>
              )}

              {prestataire.statut === "validé" && (
                <button
                  onClick={() => handleAction("suspendre")}
                  disabled={actionLoading}
                  className="btn-danger w-full py-4 uppercase font-black tracking-widest text-xs"
                >
                  <PauseCircle className="h-4 w-4" />
                  Suspendre le compte
                </button>
              )}

              {(prestataire.statut === "suspendu" ||
                prestataire.statut === "rejeté") && (
                <button
                  onClick={() => handleAction("reactiver")}
                  disabled={actionLoading}
                  className="btn-success w-full py-4 uppercase font-black tracking-widest text-xs"
                >
                  <PlayCircle className="h-4 w-4" />
                  Réactiver l&apos;accès
                </button>
              )}
            </div>

            {showRejetForm && prestataire.statut === "en_attente" && (
              <div className="mt-6 space-y-4 border-t border-zinc-800 pt-6 animate-fade-in">
                <div className="space-y-2">
                    <label className="label">Précisez le motif du rejet</label>
                    <textarea
                      value={motifRejet}
                      onChange={(e) => setMotifRejet(e.target.value)}
                      className="input-field min-h-[100px] resize-none border-red-500/20 focus:border-red-500"
                      placeholder="Ex: Document illisible, informations incomplètes..."
                    />
                </div>
                <button
                  onClick={() => handleAction("rejeter")}
                  disabled={actionLoading || !motifRejet.trim()}
                  className="btn-danger w-full py-4 uppercase font-black tracking-widest text-xs shadow-lg shadow-red-500/20"
                >
                  Confirmer le rejet définitif
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
