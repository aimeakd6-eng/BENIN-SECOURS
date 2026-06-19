"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  Car,
  XCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { supabase, type Intervention } from "@/lib/supabase";

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

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [filtered, setFiltered] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchInterventions = async () => {
      const { data } = await supabase
        .from("interventions")
        .select(
          "*, prestataire:prestataires(nom, prenom), client:profiles(full_name)"
        )
        .order("created_at", { ascending: false });
      setInterventions(data || []);
      setFiltered(data || []);
      setLoading(false);
    };

    fetchInterventions();
  }, []);

  useEffect(() => {
    let result = [...interventions];
    if (filterStatut) result = result.filter((i) => i.statut === filterStatut);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) =>
        (i.prestataire as any)?.nom?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [filterStatut, search, interventions]);

  return (
    <MainLayout title="Interventions" subtitle="Suivi des interventions">
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
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-gray-400">
          <AlertCircle className="mb-2 h-8 w-8" />
          <p>Aucune intervention trouvée</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Prestataire</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((i) => {
                const cfg = statutConfig[i.statut];
                const Icon = cfg.icon;
                return (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                      {i.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3">
                      {(i.prestataire as any)
                        ? `${(i.prestataire as any).prenom} ${(i.prestataire as any).nom}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {(i.client as any)?.full_name || "-"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {i.montant
                        ? `${i.montant.toLocaleString("fr-FR")} FCFA`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {i.montant_commission
                        ? `${i.montant_commission.toLocaleString("fr-FR")} FCFA`
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
                      {new Date(i.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
}
