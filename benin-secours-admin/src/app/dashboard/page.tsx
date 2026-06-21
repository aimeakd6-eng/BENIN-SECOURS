"use client";

import { useEffect, useState } from "react";
import {
  Wrench,
  ClipboardList,
  Car,
  CreditCard,
  Star,
  Users,
  TrendingUp,
  MapPin,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import MainLayout from "@/components/MainLayout";
import StatCard from "@/components/StatCard";
import { supabase } from "@/lib/supabase";

const COLORS = ["#FFFF00", "#10B981", "#3B82F6", "#F59E0B", "#EF4444"];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPrestataires: 0,
    prestatairesEnAttente: 0,
    totalDemandes: 0,
    demandesAujourdhui: 0,
    totalInterventions: 0,
    totalPaiements: 0,
    revenusMois: 0,
    totalClients: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: totalPrestataires } = await supabase
        .from("prestataires")
        .select("*", { count: "exact", head: true });

      const { count: prestatairesEnAttente } = await supabase
        .from("prestataires")
        .select("*", { count: "exact", head: true })
        .eq("statut", "en_attente");

      const { count: totalDemandes } = await supabase
        .from("demandes")
        .select("*", { count: "exact", head: true });

      const today = new Date().toISOString().split("T")[0];
      const { count: demandesAujourdhui } = await supabase
        .from("demandes")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today);

      const { count: totalInterventions } = await supabase
        .from("interventions")
        .select("*", { count: "exact", head: true });

      const { count: totalPaiements } = await supabase
        .from("paiements")
        .select("*", { count: "exact", head: true })
        .eq("statut", "payé");

      const { data: revenus } = await supabase
        .from("paiements")
        .select("montant_commission")
        .eq("statut", "payé");

      const revenusMois =
        revenus?.reduce((sum, p) => sum + (p.montant_commission || 0), 0) || 0;

      const { count: totalClients } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "client");

      setStats({
        totalPrestataires: totalPrestataires || 0,
        prestatairesEnAttente: prestatairesEnAttente || 0,
        totalDemandes: totalDemandes || 0,
        demandesAujourdhui: demandesAujourdhui || 0,
        totalInterventions: totalInterventions || 0,
        totalPaiements: totalPaiements || 0,
        revenusMois,
        totalClients: totalClients || 0,
      });
    };

    const fetchChartData = async () => {
      const { data: demandes } = await supabase
        .from("demandes")
        .select("created_at")
        .order("created_at", { ascending: true })
        .limit(30);

      const grouped = (demandes || []).reduce((acc: any, d) => {
        const date = new Date(d.created_at).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
        });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      setChartData(
        Object.entries(grouped).map(([date, count]) => ({ date, count }))
      );
    };

    const fetchServiceData = async () => {
      const { data } = await supabase
        .from("prestataires")
        .select("type_service");

      const grouped = (data || []).reduce((acc: any, p) => {
        acc[p.type_service] = (acc[p.type_service] || 0) + 1;
        return acc;
      }, {});

      setServiceData(
        Object.entries(grouped).map(([name, value]) => ({ name, value }))
      );
    };

    fetchStats();
    fetchChartData();
    fetchServiceData();
  }, []);

  return (
    <MainLayout title="Dashboard" subtitle="Vue d'ensemble de la plateforme">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Prestataires"
          value={stats.totalPrestataires}
          subtitle={`${stats.prestatairesEnAttente} en attente de validation`}
          icon={Wrench}
          color="blue"
        />
        <StatCard
          title="Demandes"
          value={stats.totalDemandes}
          subtitle={`${stats.demandesAujourdhui} nouvelles aujourd'hui`}
          icon={ClipboardList}
          color="amber"
        />
        <StatCard
          title="Interventions"
          value={stats.totalInterventions}
          subtitle="Interventions réussies"
          icon={Car}
          color="green"
        />
        <StatCard
          title="Revenus (FCFA)"
          value={stats.revenusMois.toLocaleString("fr-FR")}
          subtitle="Commissions du mois"
          icon={CreditCard}
          color="purple"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="section-title text-xl">Activité des demandes</h3>
            <span className="rounded-full bg-primary-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-500">
              Derniers 30 jours
            </span>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFF00" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FFFF00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D2D2A" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1C1A',
                    borderRadius: '12px',
                    border: '1px solid #2D2D2A',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'
                  }}
                  itemStyle={{ color: '#FFFF00' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#FFFF00"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#FFFF00", strokeWidth: 2, stroke: "#1C1C1A" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card flex flex-col">
          <h3 className="section-title mb-6 text-xl">Répartition des services</h3>
          <div className="relative flex-1">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {serviceData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1C1A',
                    borderRadius: '12px',
                    border: '1px solid #2D2D2A',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-3xl font-black text-white">{stats.totalPrestataires}</p>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Total</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {serviceData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3 text-sm">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="flex-1 text-gray-500 font-bold uppercase text-[10px] tracking-wider">{s.name}</span>
                <span className="font-black text-white">
                  {Math.round((s.value / stats.totalPrestataires) * 100) || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="card flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{stats.totalClients}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Clients inscrits</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{stats.totalPaiements}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Paiements effectués</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">
              {stats.totalPrestataires > 0
                ? "4.2"
                : "0"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Note moyenne</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 border-l-4 border-l-purple-500">
          <div className="rounded-xl bg-purple-500/10 p-3 text-purple-500">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">Cotonou</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Zone principale</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
