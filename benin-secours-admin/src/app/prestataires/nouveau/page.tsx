"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import PrestataireForm from "@/components/PrestataireForm";

export default function NouveauPrestatairePage() {
  return (
    <MainLayout title="Nouveau prestataire" subtitle="Créer un nouveau dépanneur">
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
    </MainLayout>
  );
}
