import { MapPin, Phone, Star, Navigation, CheckCircle } from "lucide-react";
import type { Prestataire } from "@/types";

interface DepanneurCardProps {
  prestataire: Prestataire;
  onClick?: () => void;
}

export default function DepanneurCard({ prestataire, onClick }: DepanneurCardProps) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl bg-white p-4 shadow-sm transition-all active:scale-[0.98] text-left">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
          {prestataire.prenom[0]}{prestataire.nom[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-gray-900 truncate">{prestataire.prenom} {prestataire.nom}</h3>
            {prestataire.statut === "validé" && (
              <CheckCircle className="h-3.5 w-3.5 fill-blue-500 text-white" />
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{prestataire.nom_atelier}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>
              <MapPin className="h-3 w-3" />{prestataire.type_service}
            </span>
            {prestataire.distance_km !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: "var(--color-orange-light)", color: "var(--color-orange)" }}>
                <Navigation className="h-3 w-3" />
                {prestataire.distance_km < 1 ? `${(prestataire.distance_km * 1000).toFixed(0)} m` : `${prestataire.distance_km.toFixed(1)} km`}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-medium">{prestataire.note_moyenne.toFixed(1)}</span>
              <span>({prestataire.nombre_avis})</span>
            </div>
            <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{prestataire.telephone}</div>
          </div>
        </div>
      </div>
    </button>
  );
}
