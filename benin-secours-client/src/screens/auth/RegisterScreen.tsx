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
    <div className="flex min-h-screen flex-col bg-[#0F0F0E] text-white overflow-hidden relative">
      <header className="relative z-20 flex items-center justify-between px-6 py-8">
        <button onClick={() => navigate("/login")} className="text-zinc-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-[0.25em]">CREER <span className="text-[#FFFF00]">COMPTE</span></h1>
        <button onClick={() => navigate("/")} className="text-zinc-400">
          <X className="h-6 w-6" />
        </button>
      </header>

      <main className="relative z-20 flex-1 px-8 pt-4 pb-12 overflow-y-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFFF00] shadow-lg mb-6">
            <Shield className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-3xl font-black text-center">Rejoignez-nous</h2>
        </div>

        {/* Choice of role */}
        <div className="mb-10 grid grid-cols-2 gap-4">
          <button
            onClick={() => setRole("client")}
            className={`flex flex-col items-center gap-3 rounded-3xl p-5 border-2 transition-all ${
              role === "client" ? "border-[#FFFF00] bg-[#FFFF00]/10" : "border-zinc-800 bg-[#1C1C1A]"
            }`}
          >
            <User className={`h-8 w-8 ${role === "client" ? "text-[#FFFF00]" : "text-zinc-600"}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${role === "client" ? "text-[#FFFF00]" : "text-zinc-500"}`}>Client</span>
          </button>
          <button
            onClick={() => { setRole("artisan"); navigate("/register-artisan"); }}
            className={`flex flex-col items-center gap-3 rounded-3xl p-5 border-2 transition-all ${
              role === "artisan" ? "border-[#FFFF00] bg-[#FFFF00]/10" : "border-zinc-800 bg-[#1C1C1A]"
            }`}
          >
            <Wrench className={`h-8 w-8 ${role === "artisan" ? "text-[#FFFF00]" : "text-zinc-600"}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${role === "artisan" ? "text-[#FFFF00]" : "text-zinc-500"}`}>Artisan</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900/50 bg-red-900/10 p-4 text-xs font-bold uppercase tracking-widest text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {[
            { label: "Nom complet", name: "fullName", type: "text", placeholder: "Ex: Koffi AKODO" },
            { label: "Téléphone", name: "telephone", type: "text", placeholder: "+229 XX XX XX XX" },
            { label: "Adresse e-mail", name: "email", type: "email", placeholder: "votre@email.com" },
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                value={(form as any)[field.name]}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-5 py-4 text-sm font-medium text-white !text-white outline-none transition-all focus:border-[#FFFF00]"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-5 py-4 text-sm font-medium text-white !text-white outline-none transition-all focus:border-[#FFFF00]"
                placeholder="Minimum 6 caractères"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
              Confirmer
            </label>
            <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-5 py-4 text-sm font-medium text-white !text-white outline-none transition-all focus:border-[#FFFF00]"
                placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-[#FFFF00] py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-xl shadow-[#FFFF00]/10 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Création..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-10 mb-10 flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-600">
                Déjà inscrit ?{" "}
                <button onClick={() => navigate("/login")} className="text-[#FFFF00]">
                    Se connecter
                </button>
            </p>
        </div>
      </main>
    </div>
  );
}
