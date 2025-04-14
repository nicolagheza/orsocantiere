"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTecnico(formData: FormData) {
  const supabase = await createClient();

  const tecnico = {
    nome: formData.get("nome") as string,
    cognome: formData.get("cognome") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    via: formData.get("via") as string,
  };

  const { error, data } = await supabase
    .from("tecnici")
    .insert([tecnico])
    .select();

  if (error) {
    console.error("Error inserting tecnico:", error);
    throw new Error(error.message);
  }

  revalidatePath("/tecnici");

  // Return success information
  return { success: true, action: "create", id: data?.[0]?.id };
}

export async function updateTecnico(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const tecnico = {
    nome: formData.get("nome") as string,
    cognome: formData.get("cognome") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    via: formData.get("via") as string,
  };

  const { error } = await supabase.from("tecnici").update(tecnico).eq("id", id);

  if (error) {
    console.error("Error updating tecnico:", error);
    throw new Error(error.message);
  }

  revalidatePath("/tecnici");
  revalidatePath(`/tecnici/${id}`);

  // Return success information
  return { success: true, action: "update", id };
}

export async function deleteTecnico(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;

  const { error } = await supabase.from("tecnici").delete().eq("id", id);

  if (error) {
    console.error("Error deleting tecnico:", error);
    throw new Error(error.message);
  }

  revalidatePath("/tecnici");

  // Return success information
  return { success: true, action: "delete" };
}

export async function removeTecnicoFromCantiere(
  tecnico_id: string,
  cantiere_id: string,
) {
  const supabase = await createClient();

  const { error } = await supabase.from("cantieri_tecnici").delete().match({
    tecnici_id: tecnico_id,
    cantieri_id: cantiere_id,
  });

  if (error) {
    console.error("Error removing tecnico from cantiere:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/tecnici/${tecnico_id}`);
  revalidatePath(`/cantieri/${cantiere_id}`);
  return { success: true };
}
