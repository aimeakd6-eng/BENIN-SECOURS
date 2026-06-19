import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, History, Phone, Settings, CreditCard, HelpCircle, FileText, LogOut, ChevronRight, X, Trash2, Bell } from "lucide-react";
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
      <div className="flex h-screen flex-col items-center justify-center" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="flex flex-col items-center animate-fade-in">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-white">
            BENIN SECOURS
          </h1>
          <div className="mt-3 h-1 w-24 overflow-hidden rounded-full bg-white/20">
            <div className="h-full animate-pulse rounded-full bg-white" />
          </div>
          <p className="mt-6 text-center text-base font-medium text-white/80">
            Votre dépanneur en 15 minutes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <header className="shrink-0 px-5 pb-2 pt-5" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">
                BENIN SECOURS
              </h1>
            </div>
          </div>
          {profile && (
            <button
              onClick={() => openDrawer("main")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-all active:bg-white/30"
            >
              <User className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-white/70">Assistance routière géolocalisée</p>
      </header>

      {/* Contenu scrollable */}
      <main className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 text-center text-sm font-medium text-gray-500">
          Choisissez votre véhicule
        </p>

        {/* Tuile Moto */}
        <button
          onClick={() => {
            localStorage.setItem("categorie_vehicule", "Moto");
            navigate("/signaler-panne");
          }}
          className="group relative mb-4 flex w-full items-center gap-6 rounded-3xl bg-white p-6 shadow-xl shadow-orange-100 ring-1 ring-orange-50 transition-all active:scale-[0.97]"
        >
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-200">
            <svg viewBox="0 0 24 24" className="h-12 w-12 fill-white">
              <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 20c0 1.65 1.35 3 3 3s3-1.35 3-3-1.35-3-3-3-3 1.35-3 3zm14-5c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm-9.3-4.7l2.8-4.8c.3-.5 1-.6 1.4-.3.5.3.6 1 .3 1.4L11.5 11H16c.6 0 1 .4 1 1s-.4 1-1 1h-5.5c-.3 0-.6-.1-.8-.4l-2-3.3-3.7 3.7V17h2v2H4c-.6 0-1-.4-1-1v-5c0-.3.1-.5.3-.7l4.4-4.4c.3-.3.8-.4 1.2-.2z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-xl font-black tracking-tight text-gray-900 uppercase">En Moto</span>
            <span className="mt-0.5 block text-sm font-medium text-gray-400">Dépannage 2 roues rapide</span>
            <div className="mt-2 flex items-center gap-1.5">
               <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Disponible</span>
            </div>
          </div>
          <ChevronRight className="ml-auto h-6 w-6 text-gray-200" />
        </button>

        {/* Tuile Véhicule */}
        <button
          onClick={() => {
            localStorage.setItem("categorie_vehicule", "Véhicule");
            navigate("/signaler-panne");
          }}
          className="group relative flex w-full items-center gap-6 rounded-3xl bg-white p-6 shadow-xl shadow-blue-100 ring-1 ring-blue-50 transition-all active:scale-[0.97]"
        >
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-200">
             <Car className="h-12 w-12 text-white" />
          </div>
          <div className="text-left">
            <span className="block text-xl font-black tracking-tight text-gray-900 uppercase">En Véhicule</span>
            <span className="mt-0.5 block text-sm font-medium text-gray-400">Voiture, 4x4 & Camionnettes</span>
            <div className="mt-2 flex items-center gap-1.5">
               <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Disponible</span>
            </div>
          </div>
          <ChevronRight className="ml-auto h-6 w-6 text-gray-200" />
        </button>
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 flex h-16 items-center justify-around border-t border-gray-200 bg-white z-30">
        <button onClick={() => {}} className="flex flex-col items-center gap-0.5 px-3 py-1">
          <Shield className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
          <span className="text-[10px] font-medium" style={{ color: "var(--color-primary)" }}>Accueil</span>
        </button>
        <button onClick={() => navigate("/mes-demandes")} className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-400">
          <History className="h-5 w-5" />
          <span className="text-[10px] font-medium">Historique</span>
        </button>

        {/* Bouton SOS au centre */}
        <button
          onClick={() => {
            navigate("/signaler-panne");
          }}
          className="flex -mt-6 h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-red-300 transition-all active:scale-90"
          style={{ backgroundColor: "var(--color-sos)" }}
        >
          <Phone className="h-6 w-6 text-white" />
        </button>

        <button onClick={() => {}} className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-400">
          <Bell className="h-5 w-5" />
          <span className="text-[10px] font-medium">Urgence</span>
        </button>
        <button onClick={() => openDrawer("main")} className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-400">
          <Settings className="h-5 w-5" />
          <span className="text-[10px] font-medium">Plus</span>
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
