"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTecnico(formData: FormData) {
  const supabase = await createClient();

  const tecnico = {
    nome: formData.get("nome") as string,
    cognome: formData.get("cognome") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    via: formData.get("via") as string,
  };

  const { error } = await supabase.from("tecnici").insert([tecnico]);

  if (error) {
    console.error("Error inserting tecnico:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/tecnici");
  redirect("/tecnici");
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
    return { success: false, error: error.message };
  }

  revalidatePath("/tecnici");
  redirect("/tecnici");
}

export async function deleteTecnico(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("tecnici").delete().eq("id", id);

  if (error) {
    console.error("Error deleting tecnico:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/tecnici");
  redirect("/tecnici");
}
