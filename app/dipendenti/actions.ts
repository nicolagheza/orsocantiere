"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDipendente(formData: FormData) {
  const supabase = await createClient();

  const costo_orario_value = formData.get("costo_orario") as string;

  const dipendente = {
    nome: formData.get("nome") as string,
    cognome: formData.get("cognome") as string,
    costo_orario: costo_orario_value ? parseFloat(costo_orario_value) : null,
  };

  const { error } = await supabase.from("dipendenti").insert([dipendente]);

  if (error) {
    console.error("Error inserting dipendente:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dipendenti");
  redirect("/dipendenti");
}

export async function updateDipendente(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const costo_orario_value = formData.get("costo_orario") as string;

  const dipendente = {
    nome: formData.get("nome") as string,
    cognome: formData.get("cognome") as string,
    costo_orario: costo_orario_value ? parseFloat(costo_orario_value) : null,
  };

  const { error } = await supabase
    .from("dipendenti")
    .update(dipendente)
    .eq("id", id);

  if (error) {
    console.error("Error updating dipendente:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dipendenti");
  redirect("/dipendenti");
}

export async function deleteDipendente(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("dipendenti").delete().eq("id", id);

  if (error) {
    console.error("Error deleting dipendente:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dipendenti");
  redirect("/dipendenti");
}
