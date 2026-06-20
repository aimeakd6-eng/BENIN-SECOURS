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
    <div className="flex min-h-screen flex-col bg-[#0F0F0E] text-white overflow-hidden relative font-sans">
      {/* Background Image Effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F0F0E] z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
            alt="background"
            className="w-full h-full object-cover grayscale"
          />
      </div>

      <header className="relative z-20 flex items-center justify-between px-6 py-8">
        <button onClick={() => navigate("/")} className="text-white opacity-80 hover:opacity-100 transition-opacity">
          <ArrowLeft className="h-7 w-7" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-[0.25em]">BENIN <span className="text-[#FFFF00]">SECOURS</span></h1>
        <button onClick={() => navigate("/")} className="text-white opacity-40 hover:opacity-100 transition-opacity bg-white/10 rounded-full p-1.5">
          <X className="h-6 w-6" />
        </button>
      </header>

      <main className="relative z-20 flex-1 px-8 pt-4 pb-12 overflow-y-auto">
        <div className="flex flex-col items-center mb-12">
          {/* Yellow Logo Square */}
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#FFFF00] shadow-[0_0_50px_rgba(255,255,0,0.15)] mb-10 transform -rotate-3">
            <div className="relative">
                <Wrench className="h-10 w-10 text-black stroke-[2.5]" />
                <Hammer className="absolute -bottom-1 -right-1 h-5 w-5 text-black stroke-[2.5]" />
            </div>
          </div>

          <div className="w-full text-left">
            <h2 className="text-4xl font-black tracking-tight text-white mb-2">Bienvenue</h2>
            <p className="text-zinc-500 font-bold tracking-widest uppercase text-[10px]">Accédez à votre espace sécurisé</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-900/50 bg-red-900/10 p-5 text-xs font-bold uppercase tracking-widest text-red-500 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#FFFF00]/60 ml-1">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A]/80 backdrop-blur-sm px-6 py-5 text-sm font-medium text-white outline-none transition-all focus:border-[#FFFF00] focus:bg-[#1C1C1A] placeholder:text-zinc-700 shadow-inner"
              placeholder="nom@exemple.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#FFFF00]/60 ml-1">
              Mot de passe
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A]/80 backdrop-blur-sm px-6 py-5 text-sm font-medium text-white outline-none transition-all focus:border-[#FFFF00] focus:bg-[#1C1C1A] placeholder:text-zinc-700 shadow-inner"
                placeholder="Entrez votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-[#FFFF00] transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-[#FFFF00] py-5 text-sm font-black uppercase tracking-[0.25em] text-black shadow-[0_20px_40px_-10px_rgba(255,255,0,0.2)] transition-all hover:shadow-[0_25px_50px_-12px_rgba(255,255,0,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:grayscale overflow-hidden group relative"
          >
            <span className="relative z-10">{loading ? "Authentification..." : "Se connecter"}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </form>

        <div className="mt-12 flex flex-col items-center gap-6">
            <p className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-600">
                Pas encore de compte ?{" "}
                <button onClick={() => navigate("/register")} className="text-[#FFFF00] hover:underline decoration-2 underline-offset-4">
                    S&apos;inscrire ici
                </button>
            </p>

            <div className="h-[1px] w-16 bg-zinc-800/50"></div>
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-zinc-800 mix-blend-difference">BENIN SECOURS © 2024</p>
        </div>
      </main>
    </div>
  );
}
