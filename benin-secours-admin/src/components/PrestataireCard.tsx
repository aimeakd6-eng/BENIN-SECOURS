"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
  AlertCircle,
  Wrench,
  Car
} from "lucide-react";
import type { Prestataire } from "@/lib/supabase";

interface PrestataireCardProps {
  prestataire: Prestataire;
}

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

export default function PrestataireCard({ prestataire }: PrestataireCardProps) {
  const config = statutConfig[prestataire.statut];
  const StatusIcon = config.icon;

  return (
    <Link
      href={`/prestataires/${prestataire.id}`}
      className="card group cursor-pointer transition-all hover:border-primary-500/50 hover:shadow-primary-500/5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 text-2xl font-black text-primary-500 shadow-inner">
            {prestataire.prenom[0]}
            {prestataire.nom[0]}
          </div>
          <div>
            <h3 className="text-lg font-black text-white group-hover:text-primary-500 transition-colors uppercase">
              {prestataire.prenom} {prestataire.nom}
            </h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">{prestataire.nom_atelier}</p>
          </div>
        </div>
        <span
          className={`badge border ${config.className} flex items-center gap-1.5`}
        >
          <StatusIcon className="h-3 w-3" />
          {config.label}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tight">
          <Wrench className="h-4 w-4 text-primary-500/60" />
          {prestataire.type_service}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tight">
          <Car className="h-4 w-4 text-primary-500/60" />
          {prestataire.categorie}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tight">
          <Phone className="h-4 w-4 text-primary-500/60" />
          {prestataire.telephone}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tight">
          <MapPin className="h-4 w-4 text-primary-500/60" />
          <span className="truncate">{prestataire.adresse || "Non renseigné"}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span className="text-sm font-black text-white">
            {prestataire.note_moyenne.toFixed(1)}
          </span>
          <span className="text-[10px] font-bold text-gray-600 uppercase">
            ({prestataire.nombre_avis} avis)
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-primary-500/5 px-2 py-1 rounded-lg border border-primary-500/10">
          <AlertCircle className="h-3 w-3 text-primary-500" />
          <span className="text-xs font-black text-primary-500">
            {prestataire.wallet_solde.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      </div>
    </Link>
  );
}
