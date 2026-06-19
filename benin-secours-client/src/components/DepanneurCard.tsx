import { Phone, Star, Car } from "lucide-react";
import type { Prestataire } from "@/types";

interface DepanneurCardProps {
  prestataire: Prestataire;
  onClick?: () => void;
}

export default function DepanneurCard({ prestataire, onClick }: DepanneurCardProps) {
  return (
    <div className="w-full rounded-3xl bg-[#1C1C1A] p-4 border border-[#2D2D2A] shadow-xl transition-all active:scale-[0.98] text-left">
      <div className="flex items-start gap-4">
        {/* Artisan Image */}
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
           {prestataire.photo_atelier ? (
             <img src={prestataire.photo_atelier} alt={prestataire.nom} className="h-full w-full object-cover" />
           ) : (
             <div className="flex h-full w-full items-center justify-center text-xl font-black text-[#FFFF00]">
               {prestataire.nom[0]}
             </div>
           )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white truncate">{prestataire.prenom} {prestataire.nom}</h3>
            <span className="rounded-md bg-[#FFFF00]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#FFFF00]">Proche</span>
          </div>

          <div className="mt-1 flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-[#FFFF00] text-[#FFFF00]" />
            <span className="text-sm font-bold text-[#FFFF00]">{prestataire.note_moyenne.toFixed(1)}</span>
            <span className="text-xs font-medium text-zinc-500">({prestataire.nombre_avis} avis)</span>
          </div>

          <p className="mt-1 text-sm font-medium text-zinc-400">
            <span className="uppercase">{prestataire.type_service}</span> • {prestataire.nom_atelier}
          </p>

          <div className="mt-4 flex gap-2">
            <button
                onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${prestataire.telephone}`; }}
                className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-[#FFFF00] py-3 text-sm font-black uppercase tracking-tighter text-black transition-all active:scale-95"
            >
              <Phone className="h-4 w-4 fill-black" />
              Appeler
            </button>
            <button
                onClick={onClick}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 transition-all active:scale-95"
            >
              <Car className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
