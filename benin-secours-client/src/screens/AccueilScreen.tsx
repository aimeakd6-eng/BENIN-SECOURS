import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, History, Phone, Settings, ChevronRight, X, Wrench, Car, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/services/auth_service";

export default function AccueilScreen() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await signOut();
    await refreshProfile();
    setDrawerOpen(false);
  };

  if (showSplash) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0066CC]">
        <div className="flex flex-col items-center animate-fade-in text-white">
          <Shield className="h-16 w-16 mb-4" />
          <h1 className="text-3xl font-black">BENIN SECOURS</h1>
          <p className="mt-2 opacity-80 text-sm uppercase tracking-widest">Assistance Routière</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="shrink-0 px-6 pb-6 pt-10 bg-[#0066CC] rounded-b-[40px] shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20">
                <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">BENIN SECOURS</h1>
          </div>
          {profile && (
            <button onClick={() => setDrawerOpen(true)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white">
              <User className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Besoin d'aide ?</h2>
            <p className="text-gray-500 text-sm text-center mt-1">Sélectionnez votre type de véhicule</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => { localStorage.setItem("categorie_vehicule", "Moto"); navigate("/signaler-panne"); }}
            className="flex w-full items-center gap-6 rounded-3xl bg-white p-6 shadow-md border border-gray-100 transition-all active:scale-[0.97]"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Wrench className="h-8 w-8" />
            </div>
            <div className="text-left">
              <span className="block text-lg font-bold text-gray-900">MOTO</span>
              <span className="text-xs text-gray-400">2 roues et tricycles</span>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 text-gray-300" />
          </button>

          <button
            onClick={() => { localStorage.setItem("categorie_vehicule", "Véhicule"); navigate("/signaler-panne"); }}
            className="flex w-full items-center gap-6 rounded-3xl bg-white p-6 shadow-md border border-gray-100 transition-all active:scale-[0.97]"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Car className="h-8 w-8" />
            </div>
            <div className="text-left">
              <span className="block text-lg font-bold text-gray-900">VÉHICULE</span>
              <span className="text-xs text-gray-400">Voiture, 4x4, Camion</span>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 text-gray-300" />
          </button>
        </div>

        <div className="mt-12 rounded-3xl bg-red-50 p-6 border border-red-100 flex items-center justify-between">
            <div>
                <h3 className="text-red-700 font-bold uppercase text-xs">Urgence Médicale</h3>
                <p className="text-red-600/60 text-[10px]">Contact direct secours SAMU</p>
            </div>
            <button className="h-12 w-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-200">
                <Phone className="h-6 w-6" />
            </button>
        </div>
      </main>

      <nav className="shrink-0 flex h-20 items-center justify-around bg-white border-t border-gray-100 px-2 pb-2">
        <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 text-[#0066CC]">
          <Shield className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Accueil</span>
        </button>
        <button onClick={() => navigate("/mes-demandes")} className="flex flex-col items-center gap-1 text-gray-400">
          <History className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Historique</span>
        </button>
        <button onClick={() => setDrawerOpen(true)} className="flex flex-col items-center gap-1 text-gray-400">
          <Settings className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Menu</span>
        </button>
      </nav>
    </div>
  );
}
