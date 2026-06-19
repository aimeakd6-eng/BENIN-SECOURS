"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase, type Prestataire, type RetraitWallet } from "@/lib/supabase";

export default function WalletPage() {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [retraits, setRetraits] = useState<RetraitWallet[]>([]);
  const [activeTab, setActiveTab] = useState<"solde" | "retraits">("solde");
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: prestas } = await supabase
        .from("prestataires")
        .select("*")
        .order("wallet_solde", { ascending: false });
      setPrestataires(prestas || []);

      const { data: rets } = await supabase
        .from("retraits_wallet")
        .select("*, prestataire:prestataires(nom, prenom, telephone)")
        .order("created_at", { ascending: false });
      setRetraits(rets || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const totalSolde =
    prestataires.reduce((sum, p) => sum + (p.wallet_solde || 0), 0);

  const filteredRetraits = retraits.filter((r) => {
    if (filterStatut && r.statut !== filterStatut) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (r.prestataire as any)?.nom?.toLowerCase().includes(q) ||
        r.numero_mobile_money?.includes(q)
      );
    }
    return true;
  });

  const filteredPrestataires = prestataires.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        p.nom.toLowerCase().includes(q) ||
        p.prenom.toLowerCase().includes(q) ||
        p.telephone.includes(q)
      );
    }
    return true;
  });

  const handleTraiterRetrait = async (id: string, statut: "traité" | "rejeté") => {
    const { error } = await supabase
      .from("retraits_wallet")
      .update({
        statut,
        processed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert("Erreur: " + error.message);
      return;
    }

    setRetraits((prev) =>
      prev.map((r) => (r.id === id ? { ...r, statut, processed_at: new Date().toISOString() } : r))
    );
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1">
        <Header title="Wallet" subtitle="Gestion financière des prestataires" />
        <div className="p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="card flex items-center gap-4">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {totalSolde.toLocaleString("fr-FR")} FCFA
                </p>
                <p className="text-sm text-gray-500">Solde total wallet</p>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <ArrowDownLeft className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {prestataires.filter((p) => (p.wallet_solde || 0) > 0).length}
                </p>
                <p className="text-sm text-gray-500">Prestataires actifs</p>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <ArrowUpRight className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {retraits.filter((r) => r.statut === "en_attente").length}
                </p>
                <p className="text-sm text-gray-500">Retraits en attente</p>
              </div>
            </div>
          </div>

          <div className="mb-4 flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("solde")}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "solde"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Soldes des prestataires
            </button>
            <button
              onClick={() => setActiveTab("retraits")}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "retraits"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Demandes de retrait
            </button>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
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
            {activeTab === "retraits" && (
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-500"
              >
                <option value="">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="traité">Traités</option>
                <option value="rejeté">Rejetés</option>
              </select>
            )}
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
          ) : (
            <>
              {activeTab === "solde" && (
                <>
                  {filteredPrestataires.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center text-gray-400">
                      <AlertCircle className="mb-2 h-8 w-8" />
                      <p>Aucun prestataire trouvé</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500">
                          <tr>
                            <th className="px-4 py-3">Prestataire</th>
                            <th className="px-4 py-3">Atelier</th>
                            <th className="px-4 py-3">Téléphone</th>
                            <th className="px-4 py-3">Solde</th>
                            <th className="px-4 py-3">Disponible</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredPrestataires.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium">
                                {p.prenom} {p.nom}
                              </td>
                              <td className="px-4 py-3">{p.nom_atelier}</td>
                              <td className="px-4 py-3">{p.telephone}</td>
                              <td className="px-4 py-3 font-bold text-primary-600">
                                {p.wallet_solde.toLocaleString("fr-FR")} FCFA
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                    p.est_disponible
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-red-50 text-red-700"
                                  }`}
                                >
                                  {p.est_disponible ? "Oui" : "Non"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {activeTab === "retraits" && (
                <>
                  {filteredRetraits.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center text-gray-400">
                      <AlertCircle className="mb-2 h-8 w-8" />
                      <p>Aucune demande de retrait trouvée</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-500">
                          <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Prestataire</th>
                            <th className="px-4 py-3">Montant</th>
                            <th className="px-4 py-3">Méthode</th>
                            <th className="px-4 py-3">Numéro</th>
                            <th className="px-4 py-3">Statut</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredRetraits.map((r) => {
                            const statutClass =
                              r.statut === "en_attente"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : r.statut === "traité"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-700 border-red-200";
                            return (
                              <tr key={r.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono text-xs text-gray-400">
                                  {r.id.slice(0, 8)}
                                </td>
                                <td className="px-4 py-3">
                                  {(r.prestataire as any)
                                    ? `${(r.prestataire as any).prenom} ${(r.prestataire as any).nom}`
                                    : "-"}
                                </td>
                                <td className="px-4 py-3 font-medium">
                                  {r.montant.toLocaleString("fr-FR")} FCFA
                                </td>
                                <td className="px-4 py-3 uppercase">
                                  {r.methode}
                                </td>
                                <td className="px-4 py-3">
                                  {r.numero_mobile_money}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`badge border ${statutClass}`}
                                  >
                                    {r.statut === "en_attente" && (
                                      <Clock className="mr-1 inline h-3 w-3" />
                                    )}
                                    {r.statut === "traité" && (
                                      <CheckCircle2 className="mr-1 inline h-3 w-3" />
                                    )}
                                    {r.statut === "rejeté" && (
                                      <XCircle className="mr-1 inline h-3 w-3" />
                                    )}
                                    {r.statut}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-400">
                                  {new Date(r.created_at).toLocaleDateString(
                                    "fr-FR"
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {r.statut === "en_attente" && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleTraiterRetrait(r.id, "traité")
                                        }
                                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
                                      >
                                        Traiter
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleTraiterRetrait(r.id, "rejeté")
                                        }
                                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                                      >
                                        Rejeter
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
