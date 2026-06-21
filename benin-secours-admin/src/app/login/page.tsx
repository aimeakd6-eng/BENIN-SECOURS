"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff, Wrench, Hammer } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message === "Invalid login credentials" ? "Email ou mot de passe incorrect" : authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        setError("Accès réservé aux administrateurs");
        await supabase.auth.signOut();
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0E] p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="card border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-10">
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFFF00] shadow-2xl shadow-primary-500/20 mb-8 transform -rotate-3">
                <div className="relative">
                    <Wrench className="h-8 w-8 text-black stroke-[2.5]" />
                    <Hammer className="absolute -bottom-1 -right-1 h-4 w-4 text-black stroke-[2.5]" />
                </div>
              </div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                BENIN<span className="text-primary-500">-SECOURS</span>
              </h1>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
                Administration Centrale
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-4 text-xs font-bold uppercase tracking-widest text-red-500 animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="label">Adresse Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field py-4 bg-zinc-800/50"
                  placeholder="admin@beninsecours.bj"
                />
              </div>

              <div className="space-y-2">
                <label className="label">Clé d&apos;accès</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field py-4 bg-zinc-800/50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-primary-500 py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-2xl shadow-primary-500/20 transition-all hover:bg-primary-600 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Vérification..." : "Ouvrir la session"}
              </button>
            </form>

            <p className="mt-10 text-center text-[8px] font-black uppercase tracking-[0.5em] text-gray-700">
              BENIN SECOURS © 2024
            </p>
        </div>
      </div>
    </div>
  );
}
