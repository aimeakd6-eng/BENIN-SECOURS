import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
import { signUp } from "@/services/auth_service";
import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    telephone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.fullName, form.telephone);
      await refreshProfile();
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur d'inscription";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0F0F0E] text-white">
      <header className="flex items-center justify-between px-6 py-6">
        <button onClick={() => navigate("/")} className="text-zinc-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-[0.2em]">ROAD<span className="text-[#FFFF00]">ASSIST</span></h1>
        <div className="w-6" /> {/* Placeholder pour l'équilibre */}
      </header>

      <main className="flex-1 px-8 py-4">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFFF00] shadow-xl shadow-[#FFFF00]/10 mb-6">
            <Shield className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-3xl font-black">Créer un compte</h2>
          <p className="mt-2 text-zinc-500 font-medium tracking-wide uppercase text-[10px]">Rejoignez la plateforme Bénin Secours</p>
        </div>

        {/* Choix du rôle */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => {}}
            className="flex flex-col items-center gap-3 rounded-2xl border-2 border-[#FFFF00] bg-[#FFFF00]/5 p-5 transition-all"
          >
            <span className="text-2xl">👤</span>
            <span className="text-[10px] font-black tracking-widest text-[#FFFF00] uppercase">Client</span>
          </button>
          <button
            onClick={() => navigate("/register-artisan")}
            className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-[#1C1C1A] p-5 transition-all hover:bg-zinc-800"
          >
            <span className="text-2xl">🔧</span>
            <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Artisan</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900/50 bg-red-900/10 p-4 text-xs font-bold uppercase tracking-widest text-red-500">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 pb-10">
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Nom complet</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required
              className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-5 py-4 text-sm font-medium outline-none transition-all focus:border-[#FFFF00]"
              placeholder="Ex: Koffi AKODO" />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Téléphone</label>
            <input name="telephone" value={form.telephone} onChange={handleChange} required
              className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-5 py-4 text-sm font-medium outline-none transition-all focus:border-[#FFFF00]"
              placeholder="+229 XX XX XX XX" />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required
              className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-5 py-4 text-sm font-medium outline-none transition-all focus:border-[#FFFF00]"
              placeholder="votre@email.com" />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Mot de passe</label>
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required
                className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-5 py-4 text-sm font-medium outline-none transition-all focus:border-[#FFFF00]"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Confirmer</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required
              className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-5 py-4 text-sm font-medium outline-none transition-all focus:border-[#FFFF00]"
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="mt-4 w-full rounded-2xl bg-[#FFFF00] py-4 text-sm font-black uppercase tracking-[0.2em] text-black shadow-xl shadow-[#FFFF00]/10 transition-all active:scale-[0.98] disabled:opacity-50">
            {loading ? "Création..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.1em] text-zinc-600 mb-10">
          Déjà un compte ?{" "}
          <button onClick={() => navigate("/login")} className="text-[#FFFF00]">
            Se connecter
          </button>
        </p>
      </main>
    </div>
  );
}
