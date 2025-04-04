"use server";

import { Database } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type CantiereInsert = Database["public"]["Tables"]["cantieri"]["Insert"];

export async function createCantiere(formData: FormData) {
  const supabase = await createClient();
  const rawData = Object.fromEntries(formData);

  const cantiere: CantiereInsert = {
    nome: rawData.nome as string,
    cliente_id: rawData.cliente_id as string,
    // Add any additional fields you might want to include
  };

  const { error } = await supabase.from("cantieri").insert(cantiere);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/cantieri");
}

// New action to add a dipendente to a cantiere
export async function addDipendenteToCantiere(
  cantiere_id: string,
  dipendente_id: string,
) {
  const supabase = await createClient();

  // Check if the relation already exists
  const { data: existingRelation } = await supabase
    .from("cantieri_dipendenti")
    .select()
    .match({
      cantiere_id,
      dipendenti_id: dipendente_id,
    })
    .single();

  if (existingRelation) {
    // Already exists, no need to add again
    return {
      success: true,
      message: "Dipendente already assigned to this cantiere",
    };
  }

  const { error } = await supabase.from("cantieri_dipendenti").insert({
    cantiere_id,
    dipendenti_id: dipendente_id,
  });

  if (error) {
    console.error("Error adding dipendente to cantiere:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/cantieri/${cantiere_id}`);
  return { success: true };
}

// New action to remove a dipendente from a cantiere
export async function removeDipendenteFromCantiere(
  cantiere_id: string,
  dipendente_id: string,
) {
  const supabase = await createClient();

  const { error } = await supabase.from("cantieri_dipendenti").delete().match({
    cantiere_id,
    dipendenti_id: dipendente_id,
  });

  if (error) {
    console.error("Error removing dipendente from cantiere:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/cantieri/${cantiere_id}`);
  return { success: true };
}

// New action to add a tecnico to a cantiere
export async function addTecnicoToCantiere(
  cantiere_id: string,
  tecnico_id: string,
) {
  const supabase = await createClient();

  // Check if the relation already exists
  const { data: existingRelation } = await supabase
    .from("cantieri_tecnici")
    .select()
    .match({
      cantiere_id,
      tecnici_id: tecnico_id,
    })
    .single();

  if (existingRelation) {
    // Already exists, no need to add again
    return {
      success: true,
      message: "Tecnico already assigned to this cantiere",
    };
  }

  const { error } = await supabase.from("cantieri_tecnici").insert({
    cantiere_id,
    tecnici_id: tecnico_id,
  });

  if (error) {
    console.error("Error adding tecnico to cantiere:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/cantieri/${cantiere_id}`);
  return { success: true };
}

// New action to remove a tecnico from a cantiere
export async function removeTecnicoFromCantiere(
  cantiere_id: string,
  tecnico_id: string,
) {
  const supabase = await createClient();

  const { error } = await supabase.from("cantieri_tecnici").delete().match({
    cantiere_id,
    tecnici_id: tecnico_id,
  });

  if (error) {
    console.error("Error removing tecnico from cantiere:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/cantieri/${cantiere_id}`);
  return { success: true };
}
