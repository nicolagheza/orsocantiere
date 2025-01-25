'use server'

import { Database } from '@/utils/supabase/database.types'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type ClienteInsert = Database['public']['Tables']['clienti']['Insert']

export async function createCliente(formData: FormData) {
  const supabase = await createClient()

  const rawData = Object.fromEntries(formData)

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
    codice_fiscale: (rawData.codice_fiscale as string) || null,
    sconto_predefinito: Number(rawData.sconto_predefinito) || null,
    metodo_di_pagamento_predefinito: rawData.metodo_di_pagamento_predefinito as string || null,
  }

  const { error } = await supabase
    .from('clienti')
    .insert(cliente)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/clienti')
  redirect('/clienti')
}
