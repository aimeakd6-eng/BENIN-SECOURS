import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, AlertCircle, Radio } from "lucide-react";
import { getPrestatairesProches } from "@/services/supabase_service";
import { useDemande } from "@/context/DemandeContext";
import type { Prestataire } from "@/types";
import DepanneurCard from "@/components/DepanneurCard";
import LoadingWidget from "@/components/LoadingWidget";

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
          <h1 className="text-lg font-bold text-gray-900">Dépanneurs disponibles</h1>
          <p className="text-xs text-gray-500">Rayon: {rayon} km · {prestataires.length} trouvé(s)</p>
        </div>
        {searching && <Radio className="h-5 w-5 animate-pulse" style={{ color: "var(--color-primary)" }} />}
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <LoadingWidget message="Recherche des dépanneurs à proximité..." />
        ) : (
          <>
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
            <div className="space-y-3">
              {prestataires.map((p) => (
                <DepanneurCard key={p.id} prestataire={p} onClick={() => navigate(`/depanneur/${p.id}`)} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
