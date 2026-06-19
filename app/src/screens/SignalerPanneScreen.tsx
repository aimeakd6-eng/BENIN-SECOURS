import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, AlertTriangle, Navigation } from "lucide-react";
import { getCurrentPosition } from "@/services/location_service";
import { useDemande } from "@/context/DemandeContext";
import { TYPES_PANNE } from "@/types";
import TypePanneTile from "@/components/TypePanneTile";
import LoadingWidget from "@/components/LoadingWidget";

export default function SignalerPanneScreen() {
  const navigate = useNavigate();
  const {
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
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSubmit = () => {
    if (!typePanne) {
      setError("Veuillez sélectionner un type de panne");
      return;
    }
    navigate("/depanneurs");
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <header className="flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
        <button onClick={() => navigate("/")} className="rounded-full p-1.5 text-gray-600 transition-all active:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">Signaler une panne</h1>
          <p className="text-xs text-gray-500">
            {categorieVehicule === "Moto" ? "🏍️ Moto" : "🚗 Véhicule"}
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <LoadingWidget message="Récupération de votre position GPS..." />
        ) : (
          <>
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* GPS Status */}
            <div className="mb-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs"
              style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>
              <MapPin className="h-4 w-4" />
              <span>Position GPS récupérée avec succès</span>
            </div>

            {/* Type de panne */}
            <h2 className="mb-3 text-sm font-semibold text-gray-700">Type de panne</h2>
            <div className="grid grid-cols-2 gap-3">
              {TYPES_PANNE.map((t) => (
                <TypePanneTile
                  key={t.type}
                  type={t.type}
                  icon={t.icon}
                  selected={typePanne === t.type}
                  onClick={() => { setTypePanne(t.type); setError(""); }}
                />
              ))}
            </div>

            {/* Description */}
            <h2 className="mb-3 mt-6 text-sm font-semibold text-gray-700">Description (optionnel)</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre problème..."
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20"
            />
          </>
        )}
      </main>

      {/* Bouton action */}
      {!loading && (
        <footer className="sticky bottom-0 border-t border-gray-200 bg-white p-4">
          <button
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98]"
            style={{ backgroundColor: "var(--color-sos)", boxShadow: "0 4px 14px rgba(255, 59, 48, 0.3)" }}
          >
            <Navigation className="h-5 w-5" />
            TROUVER UN DÉPANNEUR
          </button>
        </footer>
      )}
    </div>
  );
}
