"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PrestataireForm from "@/components/PrestataireForm";

export default function NouveauPrestatairePage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1">
        <Header
          title="Nouveau prestataire"
          subtitle="Créer un nouveau dépanneur"
        />
        <div className="p-6">
          <Link
            href="/prestataires"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Link>
          <div className="card">
            <PrestataireForm />
          </div>
        </div>
      </main>
    </div>
  );
}
