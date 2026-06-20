import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Clock, XCircle, Wrench, Car, CheckCircle2 } from "lucide-react";
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
      setLoading(false);
    });
  }, [profile, authLoading]);

  if (authLoading || loading) return <LoadingWidget fullScreen />;

  return (
    <div className="flex h-screen flex-col bg-[#0F0F0E]">
      <header className="flex items-center justify-between px-6 py-6 text-white">
        <button onClick={() => navigate("/")} className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">Historique</h1>
        <button onClick={() => navigate("/")} className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
          <XCircle className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6">
        {/* Top Filters */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <button className="flex items-center gap-2 shrink-0 rounded-xl bg-[#FFFF00] px-4 py-3 text-xs font-black text-black uppercase tracking-widest shadow-lg shadow-[#FFFF00]/10">
                <Clock className="h-4 w-4" /> Tous les mois
            </button>
            <button className="flex items-center gap-2 shrink-0 rounded-xl bg-zinc-800 px-4 py-3 text-xs font-black text-zinc-400 uppercase tracking-widest">
                <Wrench className="h-4 w-4" /> Type de service
            </button>
        </div>

        {demandes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
            <AlertCircle className="mb-4 h-16 w-12" />
            <p className="text-sm font-bold uppercase tracking-widest">Aucune demande trouvée</p>
          </div>
        ) : (
          <div className="space-y-8 pb-10">
            {/* Grouping logic could be added here, for now simple list with month label */}
            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Demandes récentes</p>
                {demandes.map((d) => (
                    <div key={d.id} className="rounded-3xl bg-[#1C1C1A] p-6 border border-[#2D2D2A] shadow-xl">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFFF00]/10 text-[#FFFF00]">
                                    {d.categorie_vehicule === "Moto" ? <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 20c0 1.65 1.35 3 3 3s3-1.35 3-3-1.35-3-3-3-3 1.35-3 3zm14-5c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm-9.3-4.7l2.8-4.8c.3-.5 1-.6 1.4-.3.5.3.6 1 .3 1.4L11.5 11H16c.6 0 1 .4 1 1s-.4 1-1 1h-5.5c-.3 0-.6-.1-.8-.4l-2-3.3-3.7 3.7V17h2v2H4c-.6 0-1-.4-1-1v-5c0-.3.1-.5.3-.7l4.4-4.4c.3-.3.8-.4 1.2-.2z"/></svg> : <Car className="h-6 w-6" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white">{d.type_panne}</h3>
                                    <p className="text-xs font-bold text-zinc-500 uppercase">{d.statut}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-[#FFFF00]">-- FCFA</p>
                                <p className="text-[10px] font-bold text-zinc-600 uppercase mt-1">
                                    {new Date(d.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button onClick={() => navigate(`/demande/${d.id}`)}
                                className="flex-1 rounded-xl bg-zinc-800 py-3 text-xs font-black uppercase tracking-widest text-zinc-300 transition-all active:scale-95">
                                Détails
                            </button>
                            <button className="flex-1 rounded-xl bg-[#FFFF00] py-3 text-xs font-black uppercase tracking-widest text-black transition-all active:scale-95 shadow-lg shadow-[#FFFF00]/10">
                                Facture
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}
      </main>
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
