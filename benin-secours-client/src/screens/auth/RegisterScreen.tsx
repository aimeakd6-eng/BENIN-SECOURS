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
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.fullName, form.telephone);
      await refreshProfile();
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur d'inscription");
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
        <h1 className="text-lg font-bold">Inscription</h1>
      </header>

      <main className="flex-1 px-8 py-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-100 mb-4">
            <Shield className="h-8 w-8 text-[#0066CC]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Nouveau compte</h2>
          <p className="text-sm text-gray-500 mt-1">Rejoignez BENIN SECOURS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Nom complet" className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0066CC]" />
          <input name="telephone" value={form.telephone} onChange={handleChange} required placeholder="Téléphone" className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0066CC]" />
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0066CC]" />
          <div className="relative">
            <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required placeholder="Mot de passe" className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0066CC]" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Confirmer" className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm outline-none focus:border-[#0066CC]" />

          <button type="submit" disabled={loading}
            className="mt-4 w-full rounded-2xl bg-[#0066CC] py-5 text-sm font-bold text-white shadow-xl shadow-blue-200">
            {loading ? "Création..." : "S'INSCRIRE"}
          </button>
        </form>
      </main>
    </div>
  );
}
