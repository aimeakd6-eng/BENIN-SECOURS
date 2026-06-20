import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, History, Settings, ChevronRight, Wrench, Car, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/services/auth_service";

export default function AccueilScreen() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();

  const [showSplash, setShowSplash] = useState(true);

  // Splash -> Accueil après 2s
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await signOut();
    await refreshProfile();
  };

  if (showSplash) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0F0F0E]">
        <div className="flex flex-col items-center animate-fade-in">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#FFFF00] shadow-[0_0_30px_rgba(255,255,0,0.2)]">
            <Shield className="h-12 w-12 text-black" />
          </div>
          <h1 className="mt-8 text-4xl font-black tracking-tighter text-white uppercase">
            BENIN-<span className="text-[#FFFF00]">SECOURS</span>
          </h1>
          <p className="mt-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
            Assistance Routière
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#0F0F0E] text-white">
      {/* Header */}
      <header className="shrink-0 px-6 pb-6 pt-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight uppercase">
              BENIN-<span className="text-[#FFFF00]">SECOURS</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Plateforme d'assistance</p>
          </div>
          {profile && (
            <button
              onClick={() => navigate("/mes-demandes")}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-[#FFFF00]"
            >
              <User className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      {/* Contenu scrollable */}
      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mb-8">
          <h2 className="text-3xl font-black">Bienvenue</h2>
          <p className="text-zinc-500 font-medium">Quel est votre problème aujourd'hui ?</p>
        </div>

        <div className="space-y-4">
          {/* Tuile Moto */}
          <button
            onClick={() => {
              localStorage.setItem("categorie_vehicule", "Moto");
              navigate("/signaler-panne");
            }}
            className="group relative flex w-full items-center gap-6 rounded-3xl bg-[#1C1C1A] p-6 border border-[#2D2D2A] transition-all active:scale-[0.97]"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FFFF00]">
              <Wrench className="h-10 w-10 text-black" />
            </div>
            <div className="text-left">
              <span className="block text-lg font-black uppercase tracking-tight text-white">Moto</span>
              <span className="text-sm font-medium text-zinc-500">Dépannage 2 roues</span>
            </div>
            <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
              <ChevronRight className="h-5 w-5 text-[#FFFF00]" />
            </div>
          </button>

          {/* Tuile Véhicule */}
          <button
            onClick={() => {
              localStorage.setItem("categorie_vehicule", "Véhicule");
              navigate("/signaler-panne");
            }}
            className="group relative flex w-full items-center gap-6 rounded-3xl bg-[#1C1C1A] p-6 border border-[#2D2D2A] transition-all active:scale-[0.97]"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FFFF00]">
               <Car className="h-10 w-10 text-black" />
            </div>
            <div className="text-left">
              <span className="block text-lg font-black uppercase tracking-tight text-white">Véhicule</span>
              <span className="text-sm font-medium text-zinc-500">Voiture & Camion</span>
            </div>
            <div className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">
              <ChevronRight className="h-5 w-5 text-[#FFFF00]" />
            </div>
          </button>
        </div>

        <div className="mt-8 rounded-3xl bg-gradient-to-br from-red-600 to-red-900 p-6 shadow-xl shadow-red-900/20">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black uppercase italic text-white">Urgence SOS</h3>
                    <p className="text-xs font-bold text-red-200">En cas d'accident grave</p>
                </div>
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-600 shadow-lg animate-pulse">
                    <Phone className="h-6 w-6" />
                </button>
            </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 flex h-20 items-center justify-around bg-[#1C1C1A] border-t border-[#2D2D2A] px-2">
        <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-xl bg-[#FFFF00]/10">
            <Shield className="h-6 w-6 text-[#FFFF00]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFFF00]">Accueil</span>
        </button>
        <button onClick={() => navigate("/mes-demandes")} className="flex flex-col items-center gap-1 text-zinc-500">
          <History className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Historique</span>
        </button>
        <button onClick={() => navigate("/login")} className="flex flex-col items-center gap-1 text-zinc-500">
          <Settings className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Compte</span>
        </button>
      </nav>
    </div>
  );
}
