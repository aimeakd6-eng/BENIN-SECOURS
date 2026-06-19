import { supabase } from "@/config/supabase";
import type { Profile } from "@/types";

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  telephone: string
) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        telephone: telephone,
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
      telephone,
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
