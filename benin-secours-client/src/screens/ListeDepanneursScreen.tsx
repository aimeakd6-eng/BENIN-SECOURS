import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, AlertCircle, Radio, List, Map as MapIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getPrestatairesProches } from "@/services/supabase_service";
import { useDemande } from "@/context/DemandeContext";
import type { Prestataire } from "@/types";
import DepanneurCard from "@/components/DepanneurCard";
import LoadingWidget from "@/components/LoadingWidget";

// Correction icône Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div style="background-color: #3b82f6; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [15, 15],
  iconAnchor: [7, 7],
});

export default function ListeDepanneursScreen() {
  const navigate = useNavigate();
  const { userLocation, categorieVehicule } = useDemande();

  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rayon, setRayon] = useState(10);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!userLocation) {
      navigate("/signaler-panne");
      return;
    }
    fetchDepanneurs(10);
  }, [userLocation]);

  const fetchDepanneurs = async (r: number) => {
    setSearching(true);
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
    setSearching(false);
    if (data.length === 0) {
      setError(r >= 30
        ? "Aucun dépanneur disponible."
        : `Élargissez votre recherche.`
      );
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#0F0F0E]">
      <header className="flex items-center justify-between px-6 py-6">
        <button onClick={() => navigate(-1)} className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black text-white uppercase tracking-tight">Prestataires Proches</h1>
        <button onClick={() => navigate("/")} className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
          <XCircle className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Map Preview */}
        <div className="mx-6 h-48 overflow-hidden rounded-3xl border border-[#2D2D2A]">
           <MapContainer
              center={[userLocation?.latitude || 6.365, userLocation?.longitude || 2.418]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              {userLocation && (
                <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon} />
              )}
            </MapContainer>
        </div>

        {/* Info Badge */}
        <div className="mt-6 px-6">
            <div className="flex w-fit items-center gap-2 rounded-full bg-[#FFFF00]/10 px-4 py-2 ring-1 ring-[#FFFF00]/20">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#FFFF00]"></div>
                <span className="text-xs font-black uppercase tracking-widest text-[#FFFF00]">
                    {prestataires.length} prestataires en ligne à proximité
                </span>
            </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex gap-3 overflow-x-auto px-6 pb-2 no-scrollbar">
            <button className="flex items-center gap-2 shrink-0 rounded-xl bg-[#FFFF00] px-4 py-3 text-sm font-black text-black uppercase">
                <List className="h-4 w-4" /> Tous
            </button>
            <button className="flex items-center gap-2 shrink-0 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-black text-zinc-400 uppercase">
                <Wrench className="h-4 w-4" /> Mécanicien
            </button>
            <button className="flex items-center gap-2 shrink-0 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-black text-zinc-400 uppercase">
                <Car className="h-4 w-4" /> Remorqueur
            </button>
        </div>

        {/* Results */}
        <div className="mt-6 space-y-4 px-6 pb-24">
            {loading ? (
                <div className="flex h-40 flex-col items-center justify-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFFF00] border-t-transparent"></div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Recherche en cours...</p>
                </div>
            ) : prestataires.length === 0 ? (
                <div className="rounded-3xl bg-zinc-900/50 p-8 text-center">
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
                    <p className="text-sm font-bold text-zinc-500 uppercase">{error}</p>
                    {rayon < 30 && (
                        <button onClick={() => fetchDepanneurs(rayon + 10)} className="mt-4 text-xs font-black text-[#FFFF00] underline uppercase tracking-widest">
                            Élargir le rayon à {rayon + 10}km
                        </button>
                    )}
                </div>
            ) : (
                prestataires.map((p) => (
                    <DepanneurCard key={p.id} prestataire={p} onClick={() => navigate(`/depanneur/${p.id}`)} />
                ))
            )}
        </div>
      </main>
    </div>
  );
}
