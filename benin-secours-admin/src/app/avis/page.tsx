"use client";

import { useEffect, useState } from "react";
import { Star, AlertCircle, Search } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { supabase, type Avis } from "@/lib/supabase";

export default function AvisPage() {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [filtered, setFiltered] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAvis = async () => {
      const { data } = await supabase
        .from("avis")
        .select(
          "*, client:profiles(full_name), prestataire:prestataires(nom, prenom, nom_atelier)"
        )
        .order("created_at", { ascending: false });
      setAvis(data || []);
      setFiltered(data || []);
      setLoading(false);
    };

    fetchAvis();
  }, []);

  useEffect(() => {
    if (search) {
      const q = search.toLowerCase();
      setFiltered(
        avis.filter(
          (a) =>
            (a.prestataire as any)?.nom?.toLowerCase().includes(q) ||
            (a.client as any)?.full_name?.toLowerCase().includes(q) ||
            a.commentaire?.toLowerCase().includes(q)
        )
      );
    } else {
      setFiltered(avis);
    }
  }, [search, avis]);

  const renderStars = (note: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i <= note
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <MainLayout title="Avis" subtitle="Évaluations des prestataires">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-64 rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-gray-400">
          <AlertCircle className="mb-2 h-8 w-8" />
          <p>Aucun avis trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <div key={a.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {(a.prestataire as any)
                      ? `${(a.prestataire as any).prenom} ${(a.prestataire as any).nom}`
                      : "Prestataire inconnu"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(a.prestataire as any)?.nom_atelier || ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1">
                  <Star className="h-3 w-3 fill-primary-500 text-primary-500" />
                  <span className="text-xs font-semibold text-primary-600">
                    {a.note_globale}/5
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Compétence</span>
                  {renderStars(a.note_competence)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Ponctualité</span>
                  {renderStars(a.note_ponctualite)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Tarif</span>
                  {renderStars(a.note_tarif)}
                </div>
              </div>

              {a.commentaire && (
                <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 italic">
                  &ldquo;{a.commentaire}&rdquo;
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span>{(a.client as any)?.full_name || "Anonyme"}</span>
                <span>
                  {new Date(a.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
