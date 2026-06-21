"use client";

import { Bell, Search, User } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md">
      <div className="flex h-20 items-center justify-between px-8">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-xl border border-dark-border bg-zinc-900 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5"
            />
          </div>

          <button className="relative rounded-xl p-2.5 text-gray-500 transition-all hover:bg-zinc-800 hover:text-white border border-dark-border">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-dark-bg" />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 border border-dark-border text-primary-500">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
