import { supabase } from "@/config/supabase";
import type { Demande, Prestataire } from "@/types";

export async function getPrestatairesProches(
  lat: number,
  lon: number,
  rayon: number = 10,
  typeFilter?: string,
  categorieFilter?: string
): Promise<Prestataire[]> {
  const { data, error } = await supabase.rpc("get_prestataires_proches", {
    client_lat: lat,
    client_lon: lon,
    rayon_km: rayon,
    type_filter: typeFilter || null,
    categorie_filter: categorieFilter || null,
  });

  if (error) {
    console.error("Erreur getPrestatairesProches:", error);
    return [];
  }

  return (data || []).map((p: any) => ({
    ...p,
    distance_km: p.distance_km ? parseFloat(p.distance_km) : undefined,
  }));
}

export async function creerDemande(
  clientId: string,
  categorieVehicule: "Moto" | "Véhicule",
  typePanne: string,
  lat: number,
  lon: number,
  description?: string
): Promise<Demande | null> {
  const { data, error } = await supabase
    .from("demandes")
    .insert({
      client_id: clientId,
      categorie_vehicule: categorieVehicule,
      type_panne: typePanne,
      latitude: lat,
      longitude: lon,
      description: description || null,
      adresse_panne: null,
      prestataire_id: null,
      statut: "en_attente",
    })
    .select()
    .single();

  if (error) {
    console.error("Erreur creerDemande:", error);
    return null;
  }

  return data;
}

export async function getMesDemandes(clientId: string): Promise<Demande[]> {
  const { data, error } = await supabase
    .from("demandes")
    .select("*, prestataire:prestataires(*)")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur getMesDemandes:", error);
    return [];
  }

  return data || [];
}

export async function updateDemandePrestataire(
  demandeId: string,
  prestataireId: string
): Promise<boolean> {
  const { error } = await supabase
    .from("demandes")
    .update({
      prestataire_id: prestataireId,
      statut: "acceptée",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", demandeId);

  if (error) {
    console.error("Erreur updateDemandePrestataire:", error);
    return false;
  }

  return true;
}

export async function creerIntervention(
  demandeId: string,
  prestataireId: string,
  clientId: string
): Promise<boolean> {
  const { error } = await supabase.from("interventions").insert({
    demande_id: demandeId,
    prestataire_id: prestataireId,
    client_id: clientId,
    statut: "acceptée",
    date_acceptation: new Date().toISOString(),
  });

  if (error) {
    console.error("Erreur creerIntervention:", error);
    return false;
  }

  return true;
}

export async function creerAvis(data: {
  intervention_id: string;
  client_id: string;
  prestataire_id: string;
  note_globale: number;
  note_competence: number;
  note_ponctualite: number;
  note_tarif: number;
  commentaire?: string;
}): Promise<boolean> {
  const { error } = await supabase.from("avis").insert({
    ...data,
    note: data.note_globale,
  });

  if (error) {
    console.error("Erreur creerAvis:", error);
    return false;
  }

  return true;
}

export async function annulerDemande(demandeId: string): Promise<boolean> {
  const { error } = await supabase
    .from("demandes")
    .update({ statut: "annulée" })
    .eq("id", demandeId);

  if (error) {
    console.error("Erreur annulerDemande:", error);
    return false;
  }

  return true;
}
