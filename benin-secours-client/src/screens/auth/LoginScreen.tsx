import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Wrench, Hammer, X } from "lucide-react";
import { signIn } from "@/services/auth_service";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn(phone, password);
      const profile = await refreshProfile() as any;
      if (profile?.role === "prestataire") {
        navigate("/artisan-dashboard");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur de connexion";
      setError(message === "Invalid login credentials" ? "Numéro ou mot de passe incorrect" : message);
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
    <div className="flex min-h-screen flex-col bg-[#0F0F0E] text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1/2 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F0F0E] z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
            alt="background"
            className="w-full h-full object-cover grayscale"
          />
      </div>

      <header className="relative z-20 flex items-center justify-between px-6 py-8">
        <button onClick={() => navigate("/")} className="text-zinc-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-widest text-[#FFFF00]">BENIN-SECOURS</h1>
        <button onClick={() => navigate("/")} className="text-zinc-400">
          <X className="h-6 w-6" />
        </button>
      </header>

      <main className="relative z-20 flex-1 px-8 pt-4 pb-12 overflow-y-auto">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#FFFF00] shadow-xl mb-8">
            <div className="relative">
                <Wrench className="h-10 w-10 text-black" />
                <Hammer className="absolute -bottom-1 -right-1 h-5 w-5 text-black" />
            </div>
          </div>
          <h2 className="text-4xl font-black tracking-tight">Bienvenue</h2>
          <p className="mt-2 text-zinc-500 font-medium tracking-wide uppercase text-[10px]">Identifiez-vous avec votre numéro</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900/50 bg-red-900/10 p-4 text-xs font-bold uppercase tracking-widest text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={inputStyle}
              className="w-full rounded-2xl border px-6 py-5 text-sm font-medium outline-none transition-all focus:border-[#FFFF00]"
              placeholder="Ex: 97000000"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
                className="w-full rounded-2xl border px-6 py-5 text-sm font-medium outline-none transition-all focus:border-[#FFFF00]"
                placeholder="Entrez votre mot de passe"
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

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-[#FFFF00] py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-xl shadow-[#FFFF00]/10 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Chargement..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-600">
                Pas de compte ?{" "}
                <button onClick={() => navigate("/register")} className="text-[#FFFF00]">
                    S&apos;inscrire
                </button>
            </p>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-800 mt-10">Bénin Secours © 2024</p>
        </div>
      </main>
    </div>
  );
}
