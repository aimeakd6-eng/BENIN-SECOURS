import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, XCircle } from "lucide-react";
import { getCurrentPosition } from "@/services/location_service";
import { useDemande } from "@/context/DemandeContext";
import { TYPES_PANNE } from "@/types";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div style="background-color: #FFFF00; width: 15px; height: 15px; border-radius: 50%; border: 3px solid #0F0F0E; box-shadow: 0 0 10px rgba(255,255,0,0.5);"></div>`,
  iconSize: [15, 15],
  iconAnchor: [7, 7],
});

export default function SignalerPanneScreen() {
  const navigate = useNavigate();
  const {
    userLocation,
    categorieVehicule,
    setCategorieVehicule,
    typePanne,
    setTypePanne,
    setUserLocation,
    description,
    setDescription,
  } = useDemande();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cat = localStorage.getItem("categorie_vehicule") as "Moto" | "Véhicule" | null;
    if (cat) {
      setCategorieVehicule(cat);
    } else if (!categorieVehicule) {
      navigate("/");
      return;
    }

    getCurrentPosition()
      .then((pos) => {
        setUserLocation({ latitude: pos.latitude, longitude: pos.longitude });
        setLoading(false);
      })
      .catch((err) => {
        console.error("GPS Error:", err);
        setError("Impossible de récupérer la position (Vérifiez le HTTPS)");
        // On met une position par défaut à Cotonou pour ne pas bloquer les tests
        setUserLocation({ latitude: 6.365, longitude: 2.418 });
        setLoading(false);
      });
  }, []);

  const handleSubmit = () => {
    if (!typePanne) {
      alert("Veuillez sélectionner un type de panne");
      return;
    }
    navigate("/depanneurs");
  };

  return (
    <div className="flex h-screen flex-col bg-[#0F0F0E] text-white font-sans">
      <header className="flex items-center justify-between px-6 py-6 border-b border-white/5">
        <button onClick={() => navigate("/")} className="text-zinc-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-widest text-[#FFFF00]">BENIN-SECOURS</h1>
        <button onClick={() => navigate("/")} className="text-zinc-400">
          <XCircle className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-4">
        {loading ? (
            <div className="flex h-40 flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFFF00] border-t-transparent"></div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Initialisation GPS...</p>
            </div>
        ) : (
          <>
            <div className="h-40 w-full overflow-hidden rounded-3xl border border-[#2D2D2A] relative">
               <MapContainer
                  center={[userLocation?.latitude || 6.365, userLocation?.longitude || 2.418]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {userLocation && <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon} />}
                </MapContainer>
                {error && (
                    <div className="absolute bottom-2 left-2 right-2 bg-red-900/80 p-2 rounded-xl text-[8px] font-bold text-white text-center">
                        MODE TEST : POSITION PAR DÉFAUT (COTONOU)
                    </div>
                )}
            </div>

            <div className="mt-6">
                <div className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 ring-1 ${error ? "bg-red-500/10 ring-red-500/20" : "bg-[#FFFF00]/10 ring-[#FFFF00]/20"}`}>
                    <MapPin className={`h-4 w-4 ${error ? "text-red-500" : "text-[#FFFF00]"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${error ? "text-red-500" : "text-[#FFFF00]"}`}>
                        {error ? "GPS Désactivé" : "Position GPS confirmée"}
                    </span>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4">Type de problème</h2>
                <div className="grid grid-cols-2 gap-3 pb-4">
                  {TYPES_PANNE.map((t) => (
                    <button
                      key={t.type}
                      onClick={() => { setTypePanne(t.type); setError(""); }}
                      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-4 transition-all active:scale-[0.95] ${
                        typePanne === t.type
                        ? "border-[#FFFF00] bg-[#FFFF00]/5 text-[#FFFF00]"
                        : "border-[#2D2D2A] bg-[#1C1C1A] text-zinc-500"
                      }`}
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">{t.type}</span>
                    </button>
                  ))}
                </div>
            </div>

            <div className="mt-6 mb-10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4">Commentaires</h2>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Ma moto s'est arrêtée brusquement..."
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-5 py-4 text-sm font-medium text-white outline-none focus:border-[#FFFF00] !bg-[#1C1C1A] !text-white"
                />
            </div>
          </>
        )}
      </main>

      {!loading && (
        <footer className="shrink-0 p-6 bg-[#0F0F0E] border-t border-zinc-900">
          <button
            onClick={handleSubmit}
            className="w-full rounded-2xl bg-[#FFFF00] py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-2xl shadow-[#FFFF00]/20 transition-all active:scale-[0.98]"
          >
            Trouver un dépanneur
          </button>
        </footer>
      )}
    </div>
  );
}
