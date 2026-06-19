import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Clock, Car, CheckCircle2, XCircle, Shield, Home } from "lucide-react";
import { getMesDemandes } from "@/services/supabase_service";
import { useAuth } from "@/context/AuthContext";
import type { Demande } from "@/types";
import LoadingWidget from "@/components/LoadingWidget";

const statutConfig: Record<string, { label: string; className: string; icon: any }> = {
  en_attente: { label: "En attente", className: "bg-amber-50 text-amber-700", icon: Clock },
  acceptée: { label: "Acceptée", className: "bg-blue-50 text-blue-700", icon: CheckCircle2 },
  en_cours: { label: "En cours", className: "bg-purple-50 text-purple-700", icon: Car },
  complétée: { label: "Complétée", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  annulée: { label: "Annulée", className: "bg-red-50 text-red-700", icon: XCircle },
};

export default function MesDemandesScreen() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) { navigate("/login"); return; }
    getMesDemandes(profile.id).then((data) => {
      setDemandes(data);
      localStorage.setItem("mes_demandes", JSON.stringify(data));
      setLoading(false);
    });
  }, [profile, authLoading]);

  if (authLoading || loading) return <LoadingWidget fullScreen />;

  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <header className="flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
        <button onClick={() => navigate("/")} className="rounded-full p-1.5 text-gray-600 transition-all active:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Mes demandes</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        {demandes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <AlertCircle className="mb-3 h-12 w-12" />
            <p className="text-sm">Aucune demande pour le moment</p>
            <button onClick={() => navigate("/")}
              className="mt-4 rounded-xl px-6 py-3 text-sm font-bold text-white" style={{ backgroundColor: "var(--color-primary)" }}>
              Faire une demande
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {demandes.map((d) => {
              const cfg = statutConfig[d.statut] || statutConfig.en_attente;
              const Icon = cfg.icon;
              return (
                <button key={d.id} onClick={() => navigate(`/demande/${d.id}`)}
                  className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{d.type_panne}</h3>
                    <span className="text-xs">{d.categorie_vehicule === "Moto" ? "🏍️" : "🚗"}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{d.description || "Pas de description"}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}>
                      <Icon className="h-3 w-3" />{cfg.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(d.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 flex h-16 items-center justify-around border-t border-gray-200 bg-white">
        <button onClick={() => navigate("/")} className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-400">
          <Home className="h-5 w-5" /><span className="text-[10px] font-medium">Accueil</span>
        </button>
        <button onClick={() => {}} className="flex flex-col items-center gap-0.5 px-3 py-1" style={{ color: "var(--color-primary)" }}>
          <Clock className="h-5 w-5" /><span className="text-[10px] font-medium">Historique</span>
        </button>
        <button onClick={() => navigate("/signaler-panne")}
          className="flex -mt-6 h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all active:scale-90"
          style={{ backgroundColor: "var(--color-sos)" }}>
          <AlertCircle className="h-6 w-6 text-white" />
        </button>
        <button onClick={() => {}} className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-400">
          <BellIcon className="h-5 w-5" /><span className="text-[10px] font-medium">Urgence</span>
        </button>
        <button onClick={() => {}} className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-400">
          <Shield className="h-5 w-5" /><span className="text-[10px] font-medium">Plus</span>
        </button>
      </nav>
    </div>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
