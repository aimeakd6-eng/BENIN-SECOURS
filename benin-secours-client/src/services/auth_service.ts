import { supabase } from "@/config/supabase";
import type { Profile } from "@/types";

// Fonction pour transformer un numéro en faux email pour Supabase
const phoneToEmail = (phone: string) => {
  const cleanPhone = phone.replace(/\s/g, "").replace(/\+/g, "");
  return `${cleanPhone}@benin.bj`;
};

export async function signIn(phone: string, password: string) {
  // On utilise l'email généré à partir du téléphone
  const email = phone.includes("@") ? phone : phoneToEmail(phone);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUp(
  phone: string,
  password: string,
  fullName: string,
) {
  const email = phoneToEmail(phone);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        telephone: phone,
        role: "client",
      },
    },
  });

  if (authError) throw authError;

  if (authData.user) {
    await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      telephone: phone,
      role: "client",
    });
  }

  return authData;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  return data;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
