import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex items-center gap-3 px-4 py-6 bg-[#0066CC] text-white shadow-md">
        <button onClick={() => navigate("/")} className="rounded-full p-1.5 text-white/80 transition-all active:bg-white/20">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">Connexion</h1>
      </header>

      <main className="flex-1 px-8 py-10">
        <div className="mb-10 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl shadow-blue-100 mb-4 border border-blue-50">
            <Shield className="h-10 w-10 text-[#0066CC]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Bon retour !</h2>
          <p className="text-sm text-gray-500 mt-1">Connectez-vous pour continuer</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none transition-all focus:border-[#0066CC] focus:ring-4 focus:ring-blue-50"
              placeholder="votre@email.com" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-widest">Mot de passe</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none transition-all focus:border-[#0066CC] focus:ring-4 focus:ring-blue-50"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="mt-4 w-full rounded-2xl bg-[#0066CC] py-5 text-sm font-bold text-white shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50">
            {loading ? "Connexion..." : "SE CONNECTER"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <button onClick={() => navigate("/register")} className="font-bold text-[#0066CC]">S&apos;inscrire</button>
        </p>
      </main>
    </div>
  );
}
