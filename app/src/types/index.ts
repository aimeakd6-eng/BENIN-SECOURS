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
  distance_km?: number;
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
  prestataire?: Prestataire;
};

export type TypePanne =
  | "Panne moteur"
  | "Pneu crevé"
  | "Batterie déchargée"
  | "Panne électrique"
  | "Remorquage"
  | "Autre";

export const TYPES_PANNE: { type: TypePanne; icon: string }[] = [
  { type: "Panne moteur", icon: "🔧" },
  { type: "Pneu crevé", icon: "🛞" },
  { type: "Batterie déchargée", icon: "🔋" },
  { type: "Panne électrique", icon: "⚡" },
  { type: "Remorquage", icon: "🚛" },
  { type: "Autre", icon: "❓" },
];
