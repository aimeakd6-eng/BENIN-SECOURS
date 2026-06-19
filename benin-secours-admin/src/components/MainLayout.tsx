"use client";

import { useSidebar } from "@/lib/SidebarContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          collapsed ? "ml-20" : "ml-72"
        }`}
      >
        <Header title={title} subtitle={subtitle} />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
