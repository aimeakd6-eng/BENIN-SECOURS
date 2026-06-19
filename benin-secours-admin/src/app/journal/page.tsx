"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  Pencil,
  Trash2,
  AlertCircle,
  Search,
  ScrollText,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase, type AdminAction } from "@/lib/supabase";

const actionConfig: Record<string, { label: string; icon: any; color: string }> = {
  valider_prestataire: {
    label: "Validation",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-50",
  },
  suspendre_prestataire: {
    label: "Suspension",
    icon: PauseCircle,
    color: "text-red-600 bg-red-50",
  },
  rejeter_prestataire: {
    label: "Rejet",
    icon: XCircle,
    color: "text-gray-600 bg-gray-100",
  },
  reactiver_prestataire: {
    label: "Réactivation",
    icon: PlayCircle,
    color: "text-emerald-600 bg-emerald-50",
  },
  modifier_prestataire: {
    label: "Modification",
    icon: Pencil,
    color: "text-blue-600 bg-blue-50",
  },
  supprimer_prestataire: {
    label: "Suppression",
    icon: Trash2,
    color: "text-red-600 bg-red-50",
  },
};

export default function JournalPage() {
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [filtered, setFiltered] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("");

  useEffect(() => {
    const fetchActions = async () => {
      const { data } = await supabase
        .from("admin_actions")
        .select("*, admin:profiles(full_name), prestataire:prestataires(nom, prenom)")
        .order("date_action", { ascending: false });
      setActions(data || []);
      setFiltered(data || []);
      setLoading(false);
    };

    fetchActions();
  }, []);

  useEffect(() => {
    let result = [...actions];
    if (filterAction) result = result.filter((a) => a.action === filterAction);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          (a.admin as any)?.full_name?.toLowerCase().includes(q) ||
          (a.prestataire as any)?.nom?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [filterAction, search, actions]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1">
        <Header title="Journal" subtitle="Historique des actions administrateur" />
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
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-500"
            >
              <option value="">Toutes les actions</option>
              <option value="valider_prestataire">Validation</option>
              <option value="suspendre_prestataire">Suspension</option>
              <option value="rejeter_prestataire">Rejet</option>
              <option value="reactiver_prestataire">Réactivation</option>
              <option value="modifier_prestataire">Modification</option>
              <option value="supprimer_prestataire">Suppression</option>
            </select>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-gray-400">
              <AlertCircle className="mb-2 h-8 w-8" />
              <p>Aucune action trouvée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((action) => {
                const cfg = actionConfig[action.action] || {
                  label: action.action,
                  icon: ScrollText,
                  color: "text-gray-600 bg-gray-50",
                };
                const Icon = cfg.icon;
                return (
                  <div
                    key={action.id}
                    className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary-200 hover:shadow-sm"
                  >
                    <div className={`rounded-xl p-3 ${cfg.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {cfg.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(action.date_action).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {action.description}
                      </p>
                      {action.motif && (
                        <p className="mt-1 text-sm text-red-600">
                          Motif: {action.motif}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                        <span>
                          Admin:{" "}
                          <span className="font-medium text-gray-600">
                            {(action.admin as any)?.full_name || "Système"}
                          </span>
                        </span>
                        <span>
                          Prestataire:{" "}
                          <span className="font-medium text-gray-600">
                            {(action.prestataire as any)
                              ? `${(action.prestataire as any).prenom} ${(action.prestataire as any).nom}`
                              : "-"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
