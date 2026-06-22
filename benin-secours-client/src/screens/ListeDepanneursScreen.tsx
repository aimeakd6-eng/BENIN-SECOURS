import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, List, XCircle, Wrench, Car, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getPrestatairesProches } from "@/services/supabase_service";
import { useDemande } from "@/context/DemandeContext";
import type { Prestataire } from "@/types";
import DepanneurCard from "@/components/DepanneurCard";

// Icône Client (Point Jaune)
const userIcon = L.divIcon({
  className: "user-marker",
  html: `<div style="background-color: #FFFF00; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #0F0F0E; box-shadow: 0 0 15px rgba(255,255,0,0.6);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// Icône Dépanneur (Clé à molette)
const artisanIcon = L.divIcon({
  className: "artisan-marker",
  html: `<div style="background-color: #1C1C1A; width: 34px; height: 34px; border-radius: 12px; border: 2px solid #FFFF00; display: flex; items-center; justify-content: center; shadow: 0 5px 15px rgba(0,0,0,0.5);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFF00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
         </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

export default function ListeDepanneursScreen() {
  const navigate = useNavigate();
  const { userLocation, categorieVehicule } = useDemande();

  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rayon, setRayon] = useState(10);

  useEffect(() => {
    if (!userLocation) {
      navigate("/signaler-panne");
      return;
    }
    fetchDepanneurs(10);
  }, [userLocation]);

  const fetchDepanneurs = async (r: number) => {
    setLoading(true);
    setError("");
    const data = await getPrestatairesProches(
      userLocation!.latitude,
      userLocation!.longitude,
      r,
      undefined,
      categorieVehicule || undefined
    );
    setPrestataires(data);
    setRayon(r);
    setLoading(false);
    if (data.length === 0) {
      setError(r >= 30 ? "Aucun dépanneur disponible." : "Élargissez la zone.");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#0F0F0E]">
      <header className="flex items-center justify-between px-6 py-6 text-white border-b border-white/5">
        <button onClick={() => navigate(-1)} className="text-zinc-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="text-center">
            <h1 className="text-lg font-black uppercase tracking-tight">Dépanneurs Proches</h1>
            <p className="text-[9px] font-bold text-[#FFFF00] uppercase tracking-widest">{rayon} KM · {prestataires.length} TROUVÉS</p>
        </div>
        <div className="w-6" /> {/* Spacer */}
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Partie CARTE (Haut 40%) */}
        <div className="h-[40%] w-full border-b border-zinc-800 relative">
            <MapContainer
              center={[userLocation?.latitude || 6.365, userLocation?.longitude || 2.418]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

              {/* Marqueur Utilisateur */}
              {userLocation && (
                <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
                  <Popup>Vous êtes ici</Popup>
                </Marker>
              )}

              {/* Marqueurs Prestataires */}
              {prestataires.map((p) => (
                p.latitude && p.longitude && (
                  <Marker
                    key={p.id}
                    position={[p.latitude, p.longitude]}
                    icon={artisanIcon}
                    eventHandlers={{ click: () => navigate(`/depanneur/${p.id}`) }}
                  >
                    <Popup>
                        <div className="p-2 text-center">
                            <p className="font-bold text-gray-900">{p.nom_atelier}</p>
                            <p className="text-[10px] text-gray-500">{p.type_service}</p>
                        </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>

            {loading && (
                <div className="absolute inset-0 z-[1001] bg-black/40 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFFF00] border-t-transparent"></div>
                </div>
            )}
        </div>

        {/* Partie LISTE (Bas 60%) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#0F0F0E] rounded-t-[32px] -mt-6 z-10 relative shadow-2xl">
            {/* Petit indicateur de drag pour le style */}
            <div className="flex justify-center mb-2">
                <div className="w-12 h-1 rounded-full bg-zinc-800"></div>
            </div>

            {error && (
              <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 text-center">
                <p className="text-xs font-bold text-amber-500 uppercase">{error}</p>
                {rayon < 30 && (
                    <button onClick={() => fetchDepanneurs(rayon + 10)} className="mt-2 text-[10px] font-black text-[#FFFF00] underline uppercase tracking-widest">
                        Chercher à {rayon + 10}km
                    </button>
                )}
              </div>
            )}

            {loading && prestataires.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Recherche des experts...</p>
                </div>
            ) : (
                prestataires.map((p) => (
                    <DepanneurCard key={p.id} prestataire={p} onClick={() => navigate(`/depanneur/${p.id}`)} />
                ))
            )}

            {prestataires.length === 0 && !loading && !error && (
                <div className="text-center py-10">
                    <p className="text-zinc-600 text-sm font-bold uppercase">Aucun résultat dans cette zone</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
