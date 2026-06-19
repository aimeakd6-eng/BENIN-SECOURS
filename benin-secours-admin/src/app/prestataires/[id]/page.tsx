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
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase, type Prestataire } from "@/lib/supabase";

const statutConfig = {
  en_attente: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  validé: {
    label: "Validé",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  suspendu: {
    label: "Suspendu",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: PauseCircle,
  },
  rejeté: {
    label: "Rejeté",
    className: "bg-gray-100 text-gray-700 border-gray-200",
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
      <div className="flex">
        <Sidebar />
        <main className="ml-64 flex-1">
          <Header title="Chargement..." />
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        </main>
      </div>
    );
  }

  if (!prestataire) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="ml-64 flex-1">
          <Header title="Prestataire introuvable" />
          <div className="flex h-64 flex-col items-center justify-center">
            <p className="text-gray-500">Ce prestataire n&apos;existe pas</p>
            <Link href="/prestataires" className="btn-primary mt-4">
              Retour à la liste
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const config = statutConfig[prestataire.statut];
  const StatusIcon = config.icon;

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1">
        <Header
          title={`${prestataire.prenom} ${prestataire.nom}`}
          subtitle={prestataire.nom_atelier}
        />
        <div className="p-6">
          <Link
            href="/prestataires"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Link>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-2xl font-bold text-primary-600">
                      {prestataire.prenom[0]}
                      {prestataire.nom[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {prestataire.prenom} {prestataire.nom}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {prestataire.nom_atelier}
                      </p>
                      <span
                        className={`badge mt-1 border ${config.className} flex w-fit items-center gap-1`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="text-sm font-medium">
                        {prestataire.telephone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <Wrench className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Service</p>
                      <p className="text-sm font-medium">
                        {prestataire.type_service}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <Car className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Catégorie</p>
                      <p className="text-sm font-medium">
                        {prestataire.categorie}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Adresse</p>
                      <p className="text-sm font-medium">
                        {prestataire.adresse || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                </div>

                {prestataire.latitude && prestataire.longitude && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Coordonnées GPS</p>
                    <p className="text-sm font-medium">
                      {prestataire.latitude}, {prestataire.longitude}
                    </p>
                  </div>
                )}
              </div>

              <div className="card">
                <h3 className="section-title mb-4">Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "photo_cip", label: "CIP" },
                    { key: "photo_cnib", label: "CNIB" },
                    { key: "photo_ifu", label: "IFU" },
                    { key: "photo_atelier", label: "Atelier" },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
                    >
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">{label}</p>
                        {prestataire[key as keyof Prestataire] ? (
                          <a
                            href={
                              prestataire[key as keyof Prestataire] as string
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary-600 hover:underline"
                          >
                            Voir le document
                          </a>
                        ) : (
                          <p className="text-sm text-gray-400">Non fourni</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h3 className="section-title mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Note moyenne</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">
                        {prestataire.note_moyenne.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Avis reçus</span>
                    <span className="font-medium">
                      {prestataire.nombre_avis}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Disponible</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        prestataire.est_disponible
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {prestataire.est_disponible ? "Oui" : "Non"}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Wallet className="h-4 w-4" />
                        Solde wallet
                      </span>
                      <span className="font-bold text-primary-600">
                        {prestataire.wallet_solde.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="section-title mb-4">Actions</h3>
                <div className="space-y-2">
                  {prestataire.statut === "en_attente" && (
                    <>
                      <button
                        onClick={() => handleAction("valider")}
                        disabled={actionLoading}
                        className="btn-success w-full"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Valider le prestataire
                      </button>
                      <button
                        onClick={() => setShowRejetForm(true)}
                        disabled={actionLoading}
                        className="btn-danger w-full"
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
                      className="btn-danger w-full"
                    >
                      <PauseCircle className="h-4 w-4" />
                      Suspendre
                    </button>
                  )}

                  {(prestataire.statut === "suspendu" ||
                    prestataire.statut === "rejeté") && (
                    <button
                      onClick={() => handleAction("reactiver")}
                      disabled={actionLoading}
                      className="btn-success w-full"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Réactiver
                    </button>
                  )}
                </div>

                {showRejetForm && prestataire.statut === "en_attente" && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <label className="label">Motif du rejet</label>
                    <textarea
                      value={motifRejet}
                      onChange={(e) => setMotifRejet(e.target.value)}
                      className="input-field min-h-[80px] resize-none"
                      placeholder="Indiquez le motif du rejet..."
                    />
                    <button
                      onClick={() => handleAction("rejeter")}
                      disabled={actionLoading || !motifRejet.trim()}
                      className="btn-danger mt-2 w-full"
                    >
                      Confirmer le rejet
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
