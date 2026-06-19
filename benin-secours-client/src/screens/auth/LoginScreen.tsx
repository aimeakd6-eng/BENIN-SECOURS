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
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <header className="flex items-center gap-3 px-4 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
        <button
          onClick={() => navigate("/")}
          className="rounded-full p-1.5 text-white/80 transition-all active:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">Connexion</h1>
      </header>

      <main className="flex-1 px-5 py-6">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Shield className="h-8 w-8" style={{ color: "var(--color-primary)" }} />
          </div>
          <h2 className="mt-3 text-xl font-bold text-gray-900">Bienvenue</h2>
          <p className="mt-1 text-sm text-gray-500">Connectez-vous à votre compte</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm outline-none transition-all focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all active:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <button onClick={() => navigate("/register")} className="font-semibold" style={{ color: "var(--color-primary)" }}>
            S&apos;inscrire
          </button>
        </p>
      </main>
    </div>
  );
}
