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
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <header className="flex items-center gap-3 px-4 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
        <button onClick={() => navigate("/")} className="rounded-full p-1.5 text-white/80 transition-all active:bg-white/20">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">Inscription</h1>
      </header>

      <main className="flex-1 px-5 py-6">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Shield className="h-8 w-8" style={{ color: "var(--color-primary)" }} />
          </div>
          <h2 className="mt-3 text-xl font-bold text-gray-900">Créer un compte</h2>
          <p className="mt-1 text-sm text-gray-500">Rejoignez BENIN SECOURS</p>
        </div>

        {/* Choix du rôle */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => {}}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-[#4A90E2] bg-white p-4 transition-all"
          >
            <span className="text-2xl">👤</span>
            <span className="text-xs font-bold text-[#4A90E2]">CLIENT</span>
          </button>
          <button
            onClick={() => navigate("/register-artisan")}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-transparent bg-gray-50 p-4 transition-all hover:bg-gray-100"
          >
            <span className="text-2xl">🔧</span>
            <span className="text-xs font-bold text-gray-500">DÉPANNEUR</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Nom complet</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20"
              placeholder="Votre nom complet" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Téléphone</label>
            <input name="telephone" value={form.telephone} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20"
              placeholder="+229 XX XX XX XX" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20"
              placeholder="votre@email.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm outline-none transition-all focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20"
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="mt-2 w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all active:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}>
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <button onClick={() => navigate("/login")} className="font-semibold" style={{ color: "var(--color-primary)" }}>
            Se connecter
          </button>
        </p>
      </main>
    </div>
  );
}
