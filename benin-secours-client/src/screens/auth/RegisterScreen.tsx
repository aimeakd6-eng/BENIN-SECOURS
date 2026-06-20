import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Wrench, Hammer, X } from "lucide-react";
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
    <div className="flex min-h-screen flex-col bg-[#0F0F0E] text-white font-sans">
      <header className="flex items-center justify-between px-6 py-8 border-b border-white/5">
        <button onClick={() => navigate("/login")} className="text-white opacity-80">
          <ArrowLeft className="h-7 w-7" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-[0.25em]">CREER <span className="text-[#FFFF00]">COMPTE</span></h1>
        <div className="w-7" />
      </header>

      <main className="flex-1 px-8 pt-6 pb-12 overflow-y-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFFF00] shadow-lg mb-6">
            <Wrench className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-3xl font-black">Nouveau Profil</h2>
          <p className="text-zinc-500 font-bold uppercase text-[10px] mt-2">Rejoignez BENIN SECOURS</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-900/50 bg-red-900/10 p-4 text-xs font-bold text-red-500 uppercase">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="NOM COMPLET" className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-6 py-4 text-sm font-medium outline-none focus:border-[#FFFF00]" />
          <input name="telephone" value={form.telephone} onChange={handleChange} required placeholder="TELEPHONE" className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-6 py-4 text-sm font-medium outline-none focus:border-[#FFFF00]" />
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="ADRESSE EMAIL" className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-6 py-4 text-sm font-medium outline-none focus:border-[#FFFF00]" />

          <div className="relative">
            <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required placeholder="MOT DE PASSE" className="w-full rounded-2xl border border-zinc-800 bg-[#1C1C1A] px-6 py-4 text-sm font-medium outline-none focus:border-[#FFFF00]" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button type="submit" disabled={loading}
            className="mt-6 w-full rounded-2xl bg-[#FFFF00] py-5 text-sm font-black uppercase tracking-widest text-black shadow-xl">
            {loading ? "Chargement..." : "S'INSCRIRE MAINTENANT"}
          </button>
        </form>
      </main>
    </div>
  );
}
