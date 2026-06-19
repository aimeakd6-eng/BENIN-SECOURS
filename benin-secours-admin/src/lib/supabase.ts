import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  telephone: string;
  role: "client" | "admin";
  push_token: string | null;
  created_at: string;
  updated_at: string;
};

export type Prestataire = {
  id: string;
  nom: string;
  prenom: string;
  nom_atelier: string;
  telephone: string;
  whatsapp: string | null;
  type_service: string;
  categorie: "Moto" | "Véhicule" | "Les deux";
  latitude: number | null;
  longitude: number | null;
  adresse: string | null;
  photo_cip: string | null;
  photo_cnib: string | null;
  photo_ifu: string | null;
  photo_atelier: string | null;
  statut: "en_attente" | "validé" | "suspendu" | "rejeté";
  motif_rejet: string | null;
  est_disponible: boolean;
  note_moyenne: number;
  nombre_avis: number;
  wallet_solde: number;
  validated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Demande = {
  id: string;
  client_id: string;
  categorie_vehicule: "Moto" | "Véhicule";
  type_panne: string;
  description: string | null;
  latitude: number;
  longitude: number;
  adresse_panne: string | null;
  prestataire_id: string | null;
  statut: "en_attente" | "acceptée" | "en_cours" | "complétée" | "annulée";
  created_at: string;
  updated_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  client?: Profile;
  prestataire?: Prestataire;
};

export type Intervention = {
  id: string;
  demande_id: string;
  prestataire_id: string;
  client_id: string;
  statut: "en_attente" | "acceptée" | "en_cours" | "complétée" | "annulée";
  montant: number | null;
  montant_commission: number | null;
  montant_prestataire: number | null;
  date_acceptation: string | null;
  date_debut: string | null;
  date_cloture: string | null;
  created_at: string;
  updated_at: string;
  demande?: Demande;
  prestataire?: Prestataire;
  client?: Profile;
};

export type Paiement = {
  id: string;
  intervention_id: string;
  montant: number;
  montant_commission: number | null;
  montant_prestataire: number | null;
  methode: "mtn" | "moov" | "celtis" | "carte";
  statut: "en_attente" | "payé" | "remboursé" | "échoué";
  reference: string | null;
  kkiapay_transaction_id: string | null;
  created_at: string;
  paid_at: string | null;
  intervention?: Intervention;
};

export type Avis = {
  id: string;
  intervention_id: string;
  client_id: string;
  prestataire_id: string;
  note: number;
  note_globale: number;
  note_competence: number;
  note_ponctualite: number;
  note_tarif: number;
  commentaire: string | null;
  created_at: string;
  client?: Profile;
  prestataire?: Prestataire;
};

export type AdminAction = {
  id: string;
  admin_id: string;
  action: string;
  prestataire_id: string | null;
  description: string | null;
  motif: string | null;
  date_action: string;
  admin?: Profile;
  prestataire?: Prestataire;
};

export type RetraitWallet = {
  id: string;
  prestataire_id: string;
  montant: number;
  methode: "mtn" | "moov" | "celtis";
  numero_mobile_money: string;
  statut: "en_attente" | "traité" | "rejeté";
  created_at: string;
  processed_at: string | null;
  prestataire?: Prestataire;
};
