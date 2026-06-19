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
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

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
    // Sauvegarder pour DetailDepanneurScreen
    localStorage.setItem("derniers_prestataires", JSON.stringify(data));
    setPrestataires(data);
    setRayon(r);
    setLoading(false);
    setSearching(false);
    if (data.length === 0) {
      setError(r >= 30
        ? "Aucun dépanneur disponible dans un rayon de 30 km. Veuillez réessayer plus tard."
        : `Aucun dépanneur trouvé dans un rayon de ${r} km.`
      );
    }
  };

  const handleExtendSearch = () => {
    if (rayon < 20) fetchDepanneurs(20);
    else if (rayon < 30) fetchDepanneurs(30);
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <header className="flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
        <button onClick={() => navigate("/signaler-panne")} className="rounded-full p-1.5 text-gray-600 transition-all active:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">Dépanneurs</h1>
          <p className="text-[10px] text-gray-500">{rayon} km · {prestataires.length} trouvé(s)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
            className="flex h-9 items-center gap-2 rounded-lg bg-gray-100 px-3 text-xs font-bold text-gray-600 transition-all active:scale-95"
          >
            {viewMode === "list" ? (
              <><MapIcon className="h-4 w-4" /> Carte</>
            ) : (
              <><List className="h-4 w-4" /> Liste</>
            )}
          </button>
          {searching && <Radio className="h-5 w-5 animate-pulse" style={{ color: "var(--color-primary)" }} />}
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        {loading ? (
          <div className="p-4">
            <LoadingWidget message="Recherche des dépanneurs..." />
          </div>
        ) : viewMode === "list" ? (
          <div className="h-full overflow-y-auto px-4 py-4">
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="flex-1">
                  <p>{error}</p>
                  {rayon < 30 && (
                    <button onClick={handleExtendSearch} className="mt-2 flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                      <MapPin className="h-3 w-3" />
                      Élargir à {rayon < 20 ? "20" : "30"} km
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="space-y-3 pb-20">
              {prestataires.map((p) => (
                <DepanneurCard key={p.id} prestataire={p} onClick={() => navigate(`/depanneur/${p.id}`)} />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full w-full">
            <MapContainer
              center={[userLocation?.latitude || 6.365, userLocation?.longitude || 2.418]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {userLocation && (
                <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
                  <Popup>Vous êtes ici</Popup>
                </Marker>
              )}
              {prestataires.map((p) => (
                p.latitude && p.longitude && (
                  <Marker
                    key={p.id}
                    position={[p.latitude, p.longitude]}
                    icon={defaultIcon}
                  >
                    <Popup className="custom-popup">
                      <div className="p-1">
                        <p className="font-bold text-gray-900">{p.prenom} {p.nom}</p>
                        <p className="text-[10px] text-gray-500">{p.nom_atelier}</p>
                        <p className="mt-1 text-xs font-semibold text-primary-600">{p.type_service}</p>
                        <button
                          onClick={() => navigate(`/depanneur/${p.id}`)}
                          className="mt-2 w-full rounded-md bg-blue-600 py-1.5 text-[10px] font-bold text-white"
                        >
                          VOIR FICHE
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>

            {/* Overlay bouton élargir sur la carte */}
            {error && rayon < 30 && (
              <div className="absolute bottom-6 left-1/2 z-[1000] -translate-x-1/2">
                <button
                  onClick={handleExtendSearch}
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold shadow-lg ring-1 ring-black/5 active:scale-95"
                  style={{ color: "var(--color-primary)" }}
                >
                  <MapPin className="h-4 w-4" />
                  Élargir le rayon ({rayon < 20 ? "20" : "30"} km)
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
