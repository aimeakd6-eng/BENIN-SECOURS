"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Filter, Search } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PrestataireCard from "@/components/PrestataireCard";
import { supabase, type Prestataire } from "@/lib/supabase";

export default function PrestatairesPage() {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [filtered, setFiltered] = useState<Prestataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState("");
  const [filterService, setFilterService] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPrestataires = async () => {
      let query = supabase
        .from("prestataires")
        .select("*")
        .order("created_at", { ascending: false });

      const { data } = await query;
      setPrestataires(data || []);
      setFiltered(data || []);
      setLoading(false);
    };

    fetchPrestataires();
  }, []);

  useEffect(() => {
    let result = [...prestataires];
    if (filterStatut) result = result.filter((p) => p.statut === filterStatut);
    if (filterService)
      result = result.filter((p) => p.type_service === filterService);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nom.toLowerCase().includes(q) ||
          p.prenom.toLowerCase().includes(q) ||
          p.nom_atelier.toLowerCase().includes(q) ||
          p.telephone.includes(q)
      );
    }
    setFiltered(result);
  }, [filterStatut, filterService, search, prestataires]);

  const typesService = Array.from(
    new Set(prestataires.map((p) => p.type_service))
  );

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1">
        <Header title="Prestataires" subtitle="Gestion des dépanneurs" />
        <div className="p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-64 rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="en_attente">En attente</option>
                  <option value="validé">Validé</option>
                  <option value="suspendu">Suspendu</option>
                  <option value="rejeté">Rejeté</option>
                </select>
              </div>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-500"
              >
                <option value="">Tous les services</option>
                {typesService.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <Link href="/prestataires/nouveau" className="btn-primary">
              <Plus className="h-4 w-4" />
              Nouveau prestataire
            </Link>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-gray-400">
              <p className="text-lg">Aucun prestataire trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <PrestataireCard key={p.id} prestataire={p} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
