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
} from "lucide-react";
import type { Prestataire } from "@/lib/supabase";

interface PrestataireCardProps {
  prestataire: Prestataire;
}

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

export default function PrestataireCard({ prestataire }: PrestataireCardProps) {
  const config = statutConfig[prestataire.statut];
  const StatusIcon = config.icon;

  return (
    <Link
      href={`/prestataires/${prestataire.id}`}
      className="card group cursor-pointer transition-all hover:border-primary-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-xl font-bold text-primary-600">
            {prestataire.prenom[0]}
            {prestataire.nom[0]}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
              {prestataire.prenom} {prestataire.nom}
            </h3>
            <p className="text-sm text-gray-500">{prestataire.nom_atelier}</p>
          </div>
        </div>
        <span
          className={`badge border ${config.className} flex items-center gap-1`}
        >
          <StatusIcon className="h-3 w-3" />
          {config.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <WrenchIcon className="h-4 w-4 text-gray-400" />
          {prestataire.type_service}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CarIcon className="h-4 w-4 text-gray-400" />
          {prestataire.categorie}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4 text-gray-400" />
          {prestataire.telephone}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          {prestataire.adresse || "Non renseigné"}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-gray-700">
            {prestataire.note_moyenne.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">
            ({prestataire.nombre_avis} avis)
          </span>
        </div>
        <div className="flex items-center gap-1">
          <AlertCircle className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {prestataire.wallet_solde.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      </div>
    </Link>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}
