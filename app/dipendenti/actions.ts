"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDipendente(formData: FormData) {
  const supabase = await createClient();

  const costo_orario_value = formData.get("costo_orario") as string;

  const dipendente = {
    nome: formData.get("nome") as string,
    cognome: formData.get("cognome") as string,
    costo_orario: costo_orario_value ? parseFloat(costo_orario_value) : null,
  };

  const { error, data } = await supabase
    .from("dipendenti")
    .insert([dipendente])
    .select();

  if (error) {
    console.error("Error inserting dipendente:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dipendenti");

  return { success: true, action: "create", id: data?.[0]?.id };
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
    throw new Error(error.message);
  }

  revalidatePath("/dipendenti");
  revalidatePath(`/dipendenti/${id}`);

  // Return success information
  return { success: true, action: "update", id };
}

export async function deleteDipendente(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;

  const { error } = await supabase.from("dipendenti").delete().eq("id", id);

  if (error) {
    console.error("Error deleting dipendente:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dipendenti");

  // Return success information
  return { success: true, action: "delete" };
}

export async function removeDipendenteFromCantiere(
  dipendente_id: string,
  cantiere_id: string,
) {
  const supabase = await createClient();

  const { error } = await supabase.from("cantieri_dipendenti").delete().match({
    dipendenti_id: dipendente_id,
    cantieri_id: cantiere_id,
  });

  if (error) {
    console.error("Error removing dipendente from cantiere:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/dipendenti/${dipendente_id}`);
  revalidatePath(`/cantieri/${cantiere_id}`);
  return { success: true };
}
