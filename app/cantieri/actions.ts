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
