import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Shield, User, Wrench, X } from "lucide-react";
import { signUp } from "@/services/auth_service";
import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [role, setRole] = useState<"client" | "artisan">("client");
  const [form, setForm] = useState({
    fullName: "",
    telephone: "",
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
      await signUp(form.telephone, form.password, form.fullName);
      await refreshProfile();
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur d'inscription";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "#1C1C1A",
    color: "#FFFFFF",
    borderColor: "#2D2D2A"
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0F0F0E] text-white">
      <header className="flex items-center justify-between px-6 py-8">
        <button onClick={() => navigate("/login")} className="text-zinc-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-widest text-[#FFFF00]">BENIN-SECOURS</h1>
        <button onClick={() => navigate("/")} className="text-zinc-400">
          <X className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 px-8 pt-4 pb-12 overflow-y-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFFF00] shadow-lg mb-4">
            <Shield className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-2xl font-black text-center uppercase tracking-tight">Nouveau Compte</h2>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => setRole("client")}
            className={`flex flex-col items-center gap-2 rounded-2xl p-4 border-2 transition-all ${
              role === "client" ? "border-[#FFFF00] bg-[#FFFF00]/5 text-[#FFFF00]" : "border-zinc-800 bg-[#1C1C1A] text-zinc-500"
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-[10px] font-black uppercase">Client</span>
          </button>
          <button
            onClick={() => navigate("/register-artisan")}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-zinc-800 bg-[#1C1C1A] p-4 text-zinc-500"
          >
            <Wrench className="h-6 w-6" />
            <span className="text-[10px] font-black uppercase">Artisan</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900/50 bg-red-900/10 p-4 text-xs font-bold uppercase tracking-widest text-red-500">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase text-zinc-500">Nom Complet</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required style={inputStyle} className="w-full rounded-2xl border px-5 py-4 text-sm outline-none focus:border-[#FFFF00]" placeholder="Ex: Koffi AKODO" />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase text-zinc-500">Numéro de téléphone</label>
            <input name="telephone" type="tel" value={form.telephone} onChange={handleChange} required style={inputStyle} className="w-full rounded-2xl border px-5 py-4 text-sm outline-none focus:border-[#FFFF00]" placeholder="Ex: 97000000" />
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase text-zinc-500">Mot de passe</label>
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required style={inputStyle} className="w-full rounded-2xl border px-5 py-4 text-sm outline-none focus:border-[#FFFF00]" placeholder="Minimum 6 caractères" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase text-zinc-500">Confirmer</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required style={inputStyle} className="w-full rounded-2xl border px-5 py-4 text-sm outline-none focus:border-[#FFFF00]" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="mt-6 w-full rounded-full bg-[#FFFF00] py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-xl active:scale-[0.98] disabled:opacity-50">
            {loading ? "Création..." : "S'inscrire"}
          </button>
        </form>
      </main>
    </div>
  );
}
