import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Wrench, Hammer, X } from "lucide-react";
import { signIn } from "@/services/auth_service";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn(email, password);
      const profile = await refreshProfile() as any;
      if (profile?.role === "prestataire") {
        navigate("/artisan-dashboard");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur de connexion";
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
        <button onClick={() => navigate("/")} className="text-zinc-400">
          <X className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 px-8 py-4">
        <div className="mb-10 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFFF00] shadow-xl shadow-[#FFFF00]/10">
            <div className="relative">
                <Wrench className="h-8 w-8 text-black" />
                <Hammer className="absolute -bottom-1 -right-1 h-4 w-4 text-black" />
            </div>
          </div>
          <h2 className="mt-8 text-4xl font-black tracking-tight">Bienvenue</h2>
          <p className="mt-2 text-zinc-500 font-medium tracking-wide uppercase text-[10px]">Identifiez-vous pour continuer</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900/50 bg-red-900/10 p-4 text-xs font-bold uppercase tracking-widest text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-5 py-4 text-sm font-medium outline-none transition-all focus:border-[#FFFF00] focus:ring-1 focus:ring-[#FFFF00]"
              placeholder="nom@exemple.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-5 py-4 text-sm font-medium outline-none transition-all focus:border-[#FFFF00] focus:ring-1 focus:ring-[#FFFF00]"
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
            className="mt-4 w-full rounded-2xl bg-[#FFFF00] py-4 text-sm font-black uppercase tracking-[0.2em] text-black shadow-xl shadow-[#FFFF00]/10 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-600">
                Pas de compte ?{" "}
                <button onClick={() => navigate("/register")} className="text-[#FFFF00]">
                    S&apos;inscrire
                </button>
            </p>

            <div className="mt-10 h-1 w-12 rounded-full bg-zinc-800"></div>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-800">Bénin Secours © 2024</p>
        </div>
      </main>
    </div>
  );
}
