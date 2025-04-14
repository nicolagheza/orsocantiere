"use server";

import { Database } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type ClienteInsert = Database["public"]["Tables"]["clienti"]["Insert"];
type ClienteUpdate = Database["public"]["Tables"]["clienti"]["Update"];

export async function createCliente(formData: FormData) {
  const supabase = await createClient();

  const rawData = Object.fromEntries(formData);

  const cliente: ClienteInsert = {
    denominazione: rawData.denominazione as string,
    codice_destinatario_sdi: rawData.codice_destinatario_sdi as string,
    tipologia: rawData.tipologia as string,
    partita_iva: rawData.partita_iva as string,
    email: rawData.email as string,
    pec: rawData.pec as string,
    telefono: rawData.telefono as string,
    indirizzo: rawData.indirizzo as string,
    comune: rawData.comune as string,
    cap: rawData.cap as string,
    provincia: rawData.provincia as string,
    paese: rawData.paese as string,
    note: (rawData.note as string) || null,
    aliquote_iva: Number(rawData.aliquote_iva) || null,
    referente: (rawData.referente as string) || null,
    sconto_predefinito: Number(rawData.sconto_predefinito) || null,
    metodo_di_pagamento_predefinito:
      (rawData.metodo_di_pagamento_predefinito as string) || null,
    data_di_nascita: (rawData.data_di_nascita as string) || null,
  };

  const { error, data } = await supabase
    .from("clienti")
    .insert(cliente)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/clienti");

  // Redirect to the list with a success message
  return { success: true, action: "create", id: data?.[0]?.id };
}

export async function updateCliente(formData: FormData) {
  const supabase = await createClient();

  const rawData = Object.fromEntries(formData);
  const clienteId = rawData.id as string;

  const cliente: ClienteUpdate = {
    denominazione: rawData.denominazione as string,
    codice_destinatario_sdi: rawData.codice_destinatario_sdi as string,
    tipologia: rawData.tipologia as string,
    partita_iva: rawData.partita_iva as string,
    email: rawData.email as string,
    pec: rawData.pec as string,
    telefono: rawData.telefono as string,
    indirizzo: rawData.indirizzo as string,
    comune: rawData.comune as string,
    cap: rawData.cap as string,
    provincia: rawData.provincia as string,
    paese: rawData.paese as string,
    note: (rawData.note as string) || null,
    aliquote_iva: Number(rawData.aliquote_iva) || null,
    referente: (rawData.referente as string) || null,
    sconto_predefinito: Number(rawData.sconto_predefinito) || null,
    metodo_di_pagamento_predefinito:
      (rawData.metodo_di_pagamento_predefinito as string) || null,
    data_di_nascita: (rawData.data_di_nascita as string) || null,
  };

  const { error } = await supabase
    .from("clienti")
    .update(cliente)
    .eq("id", clienteId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/clienti");
  revalidatePath(`/clienti/${clienteId}`);

  // Redirect to the detail page with a success message
  return { success: true, action: "update", id: clienteId };
}

export async function deleteCliente(formData: FormData) {
  const supabase = await createClient();

  const clienteId = formData.get("id") as string;

  const { error } = await supabase.from("clienti").delete().eq("id", clienteId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/clienti");

  // Redirect to the list with a success message
  return { success: true, action: "delete" };
}
