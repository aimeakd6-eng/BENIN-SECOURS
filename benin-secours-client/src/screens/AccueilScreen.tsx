import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, History, Phone, Settings, ChevronRight, X, Wrench, Car } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "@/services/auth_service";

type DrawerSection = "main" | "personal" | "payment" | "help" | "terms" | "delete" | null;

export default function AccueilScreen() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();

  const [showSplash, setShowSplash] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSection, setDrawerSection] = useState<DrawerSection>(null);

  // Splash -> Accueil après 2.5s
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const openDrawer = (section: DrawerSection) => {
    setDrawerSection(section);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setDrawerSection(null), 300);
  };

  const handleLogout = async () => {
    await signOut();
    await refreshProfile();
    closeDrawer();
  };

  const handleDeleteAccount = () => {
    alert("Fonctionnalité de suppression de compte à implémenter côté serveur.");
  };

  if (showSplash) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0F0F0E]">
        <div className="flex flex-col items-center animate-fade-in">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#FFFF00] shadow-[0_0_30px_rgba(255,255,0,0.2)]">
            <Wrench className="h-12 w-12 text-black" />
          </div>
          <h1 className="mt-8 text-4xl font-black tracking-tighter text-white">
            BENIN<span className="text-[#FFFF00]">SECOURS</span>
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
            <h1 className="text-2xl font-black tracking-tight">
              ROADA<span className="text-[#FFFF00]">SSIST</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Bénin Secours Platform</p>
          </div>
          {profile && (
            <button
              onClick={() => openDrawer("main")}
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
              <svg viewBox="0 0 24 24" className="h-10 w-10 fill-black">
                <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 20c0 1.65 1.35 3 3 3s3-1.35 3-3-1.35-3-3-3-3 1.35-3 3zm14-5c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm-9.3-4.7l2.8-4.8c.3-.5 1-.6 1.4-.3.5.3.6 1 .3 1.4L11.5 11H16c.6 0 1 .4 1 1s-.4 1-1 1h-5.5c-.3 0-.6-.1-.8-.4l-2-3.3-3.7 3.7V17h2v2H4c-.6 0-1-.4-1-1v-5c0-.3.1-.5.3-.7l4.4-4.4c.3-.3.8-.4 1.2-.2z" />
              </svg>
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

        {/* SOS Card style from screenshot */}
        <div className="mt-8 rounded-3xl bg-gradient-to-br from-red-600 to-red-900 p-6 shadow-xl shadow-red-900/20">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black uppercase italic">Urgence SOS</h3>
                    <p className="text-xs font-bold text-red-200">En cas d'accident grave</p>
                </div>
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-600 shadow-lg animate-pulse">
                    <Phone className="h-6 w-6" />
                </button>
            </div>
        </div>
      </main>

      {/* Bottom Navigation Dark */}
      <nav className="shrink-0 flex h-20 items-center justify-around bg-[#1C1C1A] border-t border-[#2D2D2A] px-2">
        <button onClick={() => {}} className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-xl bg-[#FFFF00]/10">
            <Shield className="h-6 w-6 text-[#FFFF00]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFFF00]">Accueil</span>
        </button>
        <button onClick={() => navigate("/mes-demandes")} className="flex flex-col items-center gap-1 text-zinc-500">
          <History className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Historique</span>
        </button>
        <button onClick={() => openDrawer("main")} className="flex flex-col items-center gap-1 text-zinc-500">
          <Settings className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Plus</span>
        </button>
      </nav>

      {/* Drawer Bottom Sheet */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 transition-opacity"
            onClick={closeDrawer}
          />
          {/* Sheet */}
          <div className="relative w-full max-w-md mx-auto rounded-t-2xl bg-white shadow-2xl animate-slide-up max-h-[85vh] flex flex-col">
            {/* Header sheet */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <h2 className="text-base font-bold text-gray-900">
                {drawerSection === "main" && "Plus"}
                {drawerSection === "personal" && "Informations personnelles"}
                {drawerSection === "payment" && "Mes moyens de paiement"}
                {drawerSection === "help" && "Aide et support"}
                {drawerSection === "terms" && "Conditions générales"}
                {drawerSection === "delete" && "Supprimer mon compte"}
              </h2>
              <button onClick={closeDrawer} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-5">
              {drawerSection === "main" && (
                <div className="space-y-2">
                  {/* Profil résumé */}
                  {profile && (
                    <div className="mb-4 flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: "var(--color-primary-light)" }}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full text-white font-bold" style={{ backgroundColor: "var(--color-primary)" }}>
                        {profile.full_name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{profile.full_name || "Utilisateur"}</p>
                        <p className="text-xs text-gray-500">{profile.email}</p>
                      </div>
                    </div>
                  )}

                  {[
                    { label: "Informations personnelles", icon: User, section: "personal" as DrawerSection },
                    { label: "Mes moyens de paiement", icon: CreditCard, section: "payment" as DrawerSection },
                    { label: "Aide et support", icon: HelpCircle, section: "help" as DrawerSection },
                    { label: "Conditions générales", icon: FileText, section: "terms" as DrawerSection },
                    { label: "Supprimer mon compte", icon: Trash2, section: "delete" as DrawerSection, danger: true },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => item.section ? setDrawerSection(item.section) : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all active:scale-[0.98] ${item.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <item.icon className={`h-5 w-5 ${item.danger ? "text-red-500" : "text-gray-400"}`} />
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </button>
                  ))}

                  {profile ? (
                    <button
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 transition-all active:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  ) : (
                    <button
                      onClick={() => { closeDrawer(); navigate("/login"); }}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all active:opacity-90"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      Se connecter
                    </button>
                  )}
                </div>
              )}

              {drawerSection === "personal" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase">Nom complet</label>
                    <input readOnly value={profile?.full_name || ""} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase">Email</label>
                    <input readOnly value={profile?.email || ""} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500 uppercase">Téléphone</label>
                    <input readOnly value={profile?.telephone || ""} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900" />
                  </div>
                  <p className="text-xs text-gray-400">Ces informations sont synchronisées avec votre profil Supabase.</p>
                </div>
              )}

              {drawerSection === "payment" && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold text-xs">MTN</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">MTN Mobile Money</p>
                        <p className="text-xs text-gray-400">+229 97 XX XX XX</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xs" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>MOOV</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Moov Money</p>
                        <p className="text-xs text-gray-400">Non configuré</p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-all hover:border-gray-400"
                  >
                    <CreditCard className="h-4 w-4" />
                    Ajouter un moyen de paiement
                  </button>
                </div>
              )}

              {drawerSection === "help" && (
                <div className="space-y-3">
                  {[
                    { q: "Comment fonctionne BENIN SECOURS ?", a: "BENIN SECOURS vous met en relation avec des dépanneurs professionnels près de vous en quelques minutes. Sélectionnez votre véhicule, le type de panne, et nous trouvons le meilleur dépanneur disponible." },
                    { q: "Combien coûte une intervention ?", a: "Les tarifs varient selon le type de panne et le dépanneur. Le prix vous est communiqué avant validation de l'intervention." },
                    { q: "Comment payer ?", a: "Vous pouvez payer par MTN Mobile Money, Moov Money, Celtis Cash ou carte bancaire via notre partenaire Kkiapay." },
                    { q: "Quelles zones sont couvertes ?", a: "Actuellement, nous couvrons Cotonou et ses environs (rayon de 30 km). L'expansion est prévue prochainement." },
                    { q: "Comment devenir dépanneur ?", a: "Contactez-nous via WhatsApp au +229 01 XX XX XX ou envoyez un email à contact@beninsecours.bj" },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 p-4">
                      <p className="text-sm font-semibold text-gray-900">{item.q}</p>
                      <p className="mt-1 text-xs text-gray-500 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}

              {drawerSection === "terms" && (
                <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
                  <h3 className="text-sm font-bold text-gray-900">1. Objet</h3>
                  <p>Les présentes conditions générales d'utilisation régissent l'accès et l'utilisation de la plateforme BENIN SECOURS, service d'assistance routière géolocalisée.</p>
                  <h3 className="text-sm font-bold text-gray-900">2. Services</h3>
                  <p>BENIN SECOURS met en relation des usagers en panne de véhicule avec des prestataires de dépannage agréés. Nous ne sommes pas directement responsables des prestations effectuées.</p>
                  <h3 className="text-sm font-bold text-gray-900">3. Commission</h3>
                  <p>Une commission de 10% est prélevée sur chaque intervention pour le fonctionnement de la plateforme.</p>
                  <h3 className="text-sm font-bold text-gray-900">4. Données personnelles</h3>
                  <p>Vos données sont stockées de manière sécurisée chez notre hébergeur Supabase. Vous pouvez demander la suppression de vos données à tout moment.</p>
                  <h3 className="text-sm font-bold text-gray-900">5. Responsabilité</h3>
                  <p>BENIN SECOURS agit comme intermédiaire et ne peut être tenu responsable des dommages causés lors d'une intervention. Les prestataires sont des entités indépendantes.</p>
                </div>
              )}

              {drawerSection === "delete" && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-red-50 p-4 text-center">
                    <Trash2 className="mx-auto mb-2 h-10 w-10 text-red-500" />
                    <h3 className="text-base font-bold text-red-700">Supprimer mon compte</h3>
                    <p className="mt-2 text-xs text-red-600 leading-relaxed">
                      Cette action est irréversible. Toutes vos données personnelles, votre historique de demandes et vos moyens de paiement seront définitivement supprimés.
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-2">Pour confirmer, tapez "SUPPRIMER" :</p>
                    <input
                      placeholder="SUPPRIMER"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full rounded-xl bg-red-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all active:scale-[0.98]"
                  >
                    Confirmer la suppression
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
