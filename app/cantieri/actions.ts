"use server";

//import { Database } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

//type CantiereInsert = Database["public"]["Tables"]["cantieri"]["Insert"];
//type CantiereUpdate = Database["public"]["Tables"]["cantieri"]["Update"];
//
//export async function createCantiere(formData: FormData) {
//  const supabase = await createClient();
//  const rawData = Object.fromEntries(formData);
//
//  const cantiere: CantiereInsert = {
//    nome: rawData.nome as string,
//    cliente_id: rawData.cliente_id as string,
//    // Add any additional fields you might want to include
//  };
//
//  const { error, data } = await supabase
//    .from("cantieri")
//    .insert(cantiere)
//    .select();
//
//  if (error) {
//    throw new Error(error.message);
//  }
//
//  revalidatePath("/cantieri");
//
//  // Return success with the new cantiere ID
//  return { success: true, action: "create", id: data?.[0]?.id };
//}
//
//export async function updateCantiere(formData: FormData) {
//  const supabase = await createClient();
//  const rawData = Object.fromEntries(formData);
//  const cantiereId = rawData.id as string;
//
//  const cantiere: CantiereUpdate = {
//    nome: rawData.nome as string,
//    cliente_id: rawData.cliente_id as string,
//    // Add any additional fields you might want to include
//  };
//
//  const { data, error } = await supabase
//    .from("cantieri")
//    .update(cantiere)
//    .eq("id", cantiereId)
//    .select();
//
//  console.log("updated data", data);
//
//  if (error) {
//    throw new Error(error.message);
//  }
//
//  revalidatePath("/cantieri");
//  revalidatePath(`/cantieri/${cantiereId}`);
//
//  // Redirect to the detail page with a success message
//  return { success: true, action: "update", id: cantiereId };
//}

export async function deleteCantiere(formData: FormData) {
  const supabase = await createClient();
  const cantiereId = formData.get("id") as string;

  // First, delete related records in junction tables
  const { error: relationError1 } = await supabase
    .from("cantieri_dipendenti")
    .delete()
    .eq("cantieri_id", cantiereId);

  if (relationError1) {
    console.error(
      "Error deleting cantiere_dipendenti relations:",
      relationError1,
    );
  }

  const { error: relationError2 } = await supabase
    .from("cantieri_tecnici")
    .delete()
    .eq("cantieri_id", cantiereId);

  if (relationError2) {
    console.error("Error deleting cantiere_tecnici relations:", relationError2);
  }

  // Then delete the cantiere
  const { error } = await supabase
    .from("cantieri")
    .delete()
    .eq("id", cantiereId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/cantieri");

  // Redirect to the list with a success message
  return { success: true, action: "delete" };
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
      cantieri_id: cantiere_id,
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
    cantieri_id: cantiere_id,
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
    cantieri_id: cantiere_id,
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
      cantieri_id: cantiere_id,
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
    cantieri_id: cantiere_id,
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
    cantieri_id: cantiere_id,
    tecnici_id: tecnico_id,
  });

  if (error) {
    console.error("Error removing tecnico from cantiere:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/cantieri/${cantiere_id}`);
  return { success: true };
}
