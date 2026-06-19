"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  Car,
  XCircle,
  AlertCircle,
  MapPin,
  Search,
  Filter,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase, type Demande } from "@/lib/supabase";

const statutConfig = {
  en_attente: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  acceptée: {
    label: "Acceptée",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle2,
  },
  en_cours: {
    label: "En cours",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Car,
  },
  complétée: {
    label: "Complétée",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  annulée: {
    label: "Annulée",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

export default function DemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [filtered, setFiltered] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState("");
  const [filterCategorie, setFilterCategorie] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDemandes = async () => {
      const { data } = await supabase
        .from("demandes")
        .select("*, client:profiles(full_name, telephone), prestataire:prestataires(nom, prenom)")
        .order("created_at", { ascending: false });
      setDemandes(data || []);
      setFiltered(data || []);
      setLoading(false);
    };

    fetchDemandes();
  }, []);

  useEffect(() => {
    let result = [...demandes];
    if (filterStatut) result = result.filter((d) => d.statut === filterStatut);
    if (filterCategorie)
      result = result.filter((d) => d.categorie_vehicule === filterCategorie);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.type_panne.toLowerCase().includes(q) ||
          d.adresse_panne?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [filterStatut, filterCategorie, search, demandes]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1">
        <Header title="Demandes" subtitle="Suivi des demandes d'assistance" />
        <div className="p-6">
          <div className="mb-6 flex flex-wrap items-center gap-3">
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
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-500"
              >
                <option value="">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="acceptée">Acceptée</option>
                <option value="en_cours">En cours</option>
                <option value="complétée">Complétée</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
            <select
              value={filterCategorie}
              onChange={(e) => setFilterCategorie(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-500"
            >
              <option value="">Toutes catégories</option>
              <option value="Moto">Moto</option>
              <option value="Véhicule">Véhicule</option>
            </select>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-gray-400">
              <AlertCircle className="mb-2 h-8 w-8" />
              <p>Aucune demande trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Type de panne</th>
                    <th className="px-4 py-3">Catégorie</th>
                    <th className="px-4 py-3">Adresse</th>
                    <th className="px-4 py-3">Prestataire</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((d) => {
                    const cfg = statutConfig[d.statut];
                    const Icon = cfg.icon;
                    return (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-400">
                          {d.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium">
                            {(d.client as any)?.full_name || "Anonyme"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(d.client as any)?.telephone || ""}
                          </p>
                        </td>
                        <td className="px-4 py-3">{d.type_panne}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              d.categorie_vehicule === "Moto"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {d.categorie_vehicule}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {d.adresse_panne || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {(d.prestataire as any)
                            ? `${(d.prestataire as any).prenom} ${(d.prestataire as any).nom}`
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`badge flex w-fit items-center gap-1 border ${cfg.className}`}
                          >
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {new Date(d.created_at).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
