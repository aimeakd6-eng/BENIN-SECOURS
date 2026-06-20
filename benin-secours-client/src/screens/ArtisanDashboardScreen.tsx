import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Wrench, Wallet, Star, Clock,
  Phone, Settings, LogOut, Power, ArrowRightLeft, Check,
  ArrowUpRight, ArrowDownLeft
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/config/supabase";
import { signOut } from "@/services/auth_service";

export default function ArtisanDashboardScreen() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const [prestataire, setPrestataire] = useState<any>(null);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"interventions" | "wallet">("interventions");
  const [history, setHistory] = useState<any[]>([]);

  // États pour le retrait rapide
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [momoNumber, setMomoNumber] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    if (profile && profile.role === "prestataire") {
      fetchArtisanData();
      listenToWallet();
    } else if (profile && profile.role !== "prestataire") {
        navigate("/");
    }
  }, [profile]);

  const fetchArtisanData = async () => {
    setLoading(true);
    // On récupère les infos de l'atelier
    const { data: prest } = await supabase
      .from("prestataires")
      .select("*")
      .eq("id", profile?.id)
      .single();

    setPrestataire(prest);

    // On récupère les interventions
    const { data: ints } = await supabase
      .from("interventions")
      .select("*, client:profiles(full_name, telephone), demande:demandes(*)")
      .eq("prestataire_id", profile?.id)
      .order("created_at", { ascending: false });

    setInterventions(ints || []);

    // On récupère l'historique financier (interventions complétées + retraits)
    const { data: rets } = await supabase
        .from("retraits_wallet")
        .select("*")
        .eq("prestataire_id", profile?.id)
        .order("created_at", { ascending: false });

    setHistory(rets || []);
    setLoading(false);
  };

  // Écouter les changements du Wallet en temps réel
  const listenToWallet = () => {
    const channel = supabase
      .channel('wallet_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'prestataires',
        filter: `id=eq.${profile?.id}`
      }, (payload) => {
        const oldSolde = prestataire?.wallet_solde || 0;
        const newSolde = payload.new.wallet_solde;

        if (newSolde > oldSolde) {
          setPrestataire(payload.new);
          setShowWithdrawPopup(true); // Afficher le pop-up de retrait dès qu'on reçoit de l'argent
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };

  const handleWithdrawNow = async () => {
    if (!momoNumber) return;
    setWithdrawLoading(true);

    // Simuler le transfert via Kkiapay Disburse
    const { error } = await supabase.from("retraits_wallet").insert({
        prestataire_id: profile?.id,
        montant: prestataire.wallet_solde,
        numero_mobile_money: momoNumber,
        methode: momoNumber.startsWith("97") || momoNumber.startsWith("96") || momoNumber.startsWith("61") || momoNumber.startsWith("51") ? "mtn" : "moov",
        statut: "en_attente" // Sera traité auto par le système
    });

    if (!error) {
        // Remise à zéro locale du solde pour l'effet visuel
        await supabase.from("prestataires").update({ wallet_solde: 0 }).eq("id", profile?.id);

        setWithdrawSuccess(true);
        setTimeout(() => {
            setShowWithdrawPopup(false);
            setWithdrawSuccess(false);
            fetchArtisanData(); // Rafraîchir pour voir le solde à 0
        }, 3000);
    }
    setWithdrawLoading(false);
  };

  const toggleAvailability = async () => {
    if (!prestataire) return;
    const newStatus = !prestataire.est_disponible;
    const { error } = await supabase
      .from("prestataires")
      .update({ est_disponible: newStatus })
      .eq("id", prestataire.id);

    if (!error) {
      setPrestataire({ ...prestataire, est_disponible: newStatus });
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("interventions")
      .update({ statut: newStatus })
      .eq("id", id);

    if (!error) {
      // Si on complète l'intervention, on met aussi à jour la demande
      if (newStatus === "complétée") {
          const int = interventions.find(i => i.id === id);
          if (int?.demande_id) {
              await supabase.from("demandes").update({ statut: "complétée" }).eq("id", int.demande_id);
          }
      }
      fetchArtisanData();
    }
  };

  const handleLogout = async () => {
    await signOut();
    await refreshProfile();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-5 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900">ESPACE ARTISAN</h1>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{prestataire?.nom_atelier}</p>
            </div>
          </div>
          <button
            onClick={toggleAvailability}
            className={`flex h-10 items-center gap-2 rounded-full px-4 text-xs font-bold transition-all active:scale-95 ${
              prestataire?.est_disponible
                ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
            }`}
          >
            <Power className="h-4 w-4" />
            {prestataire?.est_disponible ? "DISPONIBLE" : "HORS LIGNE"}
          </button>
        </div>
      </header>

      <main className="flex-1 space-y-6 px-5 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setActiveTab("wallet")}
            className={`rounded-3xl p-5 shadow-sm border transition-all ${
                activeTab === "wallet" ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100"
            }`}
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <Wallet className="h-5 w-5" />
            </div>
            <p className="text-left text-sm font-medium text-gray-500">Wallet</p>
            <p className="text-left text-xl font-black text-gray-900">{prestataire?.wallet_solde?.toLocaleString("fr-FR")} <span className="text-xs">F</span></p>
          </button>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Star className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-gray-500">Note</p>
            <p className="text-xl font-black text-gray-900">{prestataire?.note_moyenne?.toFixed(1) || "0.0"}</p>
          </div>
        </div>

        {activeTab === "interventions" ? (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">Interventions</h2>
              <span className="rounded-full bg-gray-200 px-3 py-1 text-[10px] font-bold text-gray-600">
                {interventions.filter(i => i.statut !== "complétée").length} EN COURS
              </span>
            </div>
            {/* ... (boucle interventions existante) */}
            <div className="space-y-4">
              {interventions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-12 text-center shadow-sm border border-gray-100">
                  <Clock className="mb-3 h-10 w-10 text-gray-300" />
                  <p className="text-sm font-medium text-gray-500">Aucune demande reçue</p>
                </div>
              ) : (
                interventions.map((int) => (
                  <div key={int.id} className="overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/50 px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{int.demande?.categorie_vehicule === "Moto" ? "🏍️" : "🚗"}</span>
                        <span className="text-xs font-bold text-gray-700 uppercase">{int.demande?.type_panne}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                        int.statut === "complétée" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {int.statut}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                          {int.client?.full_name?.[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">{int.client?.full_name}</p>
                          <p className="text-xs text-gray-500">{int.client?.telephone}</p>
                        </div>
                        <a href={`tel:${int.client?.telephone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 active:scale-90">
                          <Phone className="h-5 w-5" />
                        </a>
                      </div>
                      {int.statut === "acceptée" && (
                        <button onClick={() => handleUpdateStatus(int.id, "en_cours")} className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg active:scale-95">COMMENCER</button>
                      )}
                      {int.statut === "en_cours" && (
                        <button onClick={() => handleUpdateStatus(int.id, "complétée")} className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg active:scale-95">TERMINER ET FACTURER</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : (
          <section className="animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">Historique Wallet</h2>
              <button onClick={() => setActiveTab("interventions")} className="text-xs font-bold text-blue-600">VOIR MISSIONS</button>
            </div>
            <div className="space-y-3">
               {history.length === 0 && <p className="text-center text-sm text-gray-400 py-10">Aucune transaction</p>}
               {history.map((item) => (
                 <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                   <div className="flex items-center gap-3">
                     <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.statut === "traité" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}>
                       {item.statut === "traité" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                     </div>
                     <div>
                       <p className="text-sm font-bold text-gray-900">{item.statut === "traité" ? "Retrait MoMo" : "Gain Intervention"}</p>
                       <p className="text-[10px] text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                     </div>
                   </div>
                   <p className={`font-black ${item.statut === "traité" ? "text-red-500" : "text-emerald-500"}`}>
                     {item.statut === "traité" ? "-" : "+"}{item.montant} F
                   </p>
                 </div>
               ))}
            </div>
          </section>
        )}
      </main>

      {/* Pop-up Retrait Instantané */}
      {showWithdrawPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-slide-up">
            {!withdrawSuccess ? (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                    <ArrowRightLeft className="h-8 w-8" />
                </div>
                <h3 className="text-center text-lg font-black text-gray-900">Paiement reçu !</h3>
                <p className="mt-2 text-center text-sm text-gray-500">
                    Vous avez <b>{prestataire.wallet_solde} FCFA</b> disponibles. Voulez-vous les retirer sur votre MoMo maintenant ?
                </p>

                <div className="mt-6 space-y-3">
                    <input
                        type="tel"
                        placeholder="Numéro MTN ou Moov"
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-center text-lg font-bold outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleWithdrawNow}
                        disabled={withdrawLoading || !momoNumber}
                        className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {withdrawLoading ? "Transfert en cours..." : "OUI, RETIRER MAINTENANT"}
                    </button>
                    <button
                        onClick={() => setShowWithdrawPopup(false)}
                        className="w-full rounded-2xl py-3 text-sm font-bold text-gray-400 active:scale-95"
                    >
                        PLUS TARD
                    </button>
                </div>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white mx-auto animate-bounce">
                    <Check className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Transfert réussi !</h3>
                <p className="mt-2 text-sm text-gray-500">L&apos;argent arrive sur votre téléphone dans quelques instants.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 flex h-20 items-center justify-around border-t border-gray-100 bg-white px-6">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <Shield className="h-6 w-6" />
          <span className="text-[10px] font-bold">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Wallet className="h-6 w-6" />
          <span className="text-[10px] font-bold">Portefeuille</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Settings className="h-6 w-6" />
          <span className="text-[10px] font-bold">Profil</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-red-400">
          <LogOut className="h-6 w-6" />
          <span className="text-[10px] font-bold">Sortie</span>
        </button>
      </nav>
    </div>
  );
}
