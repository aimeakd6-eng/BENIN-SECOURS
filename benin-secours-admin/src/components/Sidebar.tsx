"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  Car,
  CreditCard,
  Star,
  Wallet,
  ScrollText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prestataires", label: "Prestataires", icon: Wrench },
  { href: "/demandes", label: "Demandes", icon: ClipboardList },
  { href: "/interventions", label: "Interventions", icon: Car },
  { href: "/paiements", label: "Paiements", icon: CreditCard },
  { href: "/avis", label: "Avis", icon: Star },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/journal", label: "Journal", icon: ScrollText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-100 bg-white shadow-xl shadow-gray-200/50 transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex h-20 items-center border-b border-gray-50 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 shadow-lg shadow-primary-200">
          <Shield className="h-6 w-6 shrink-0 text-white" />
        </div>
        {!collapsed && (
          <div className="ml-3 overflow-hidden whitespace-nowrap">
            <span className="block text-lg font-bold tracking-tight text-gray-900">
              BENIN SECOURS
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-primary-500">
              Admin Portal
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary-600 text-white shadow-md shadow-primary-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-primary-600"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-gray-400 group-hover:text-primary-500"}`} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && (
                 <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/50" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-50 p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-2 flex w-full items-center justify-center rounded-xl bg-gray-50 p-2.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Réduire le menu</span>
            </div>
          )}
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
