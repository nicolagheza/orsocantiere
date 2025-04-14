"use client";

import { Button } from "@/components/ui/button";
import { createCliente, updateCliente } from "../actions";
import { useFormStatus } from "react-dom";
import { Tables } from "@/utils/supabase/database.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Cliente = Tables<"clienti">;

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? "Salvataggio..."
        : isUpdate
          ? "Aggiorna Cliente"
          : "Salva Cliente"}
    </Button>
  );
}

interface ClienteFormProps {
  cliente?: Cliente;
}

export function ClienteForm({ cliente }: ClienteFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isUpdate = !!cliente;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = isUpdate
        ? await updateCliente(formData)
        : await createCliente(formData);

      if (result.success) {
        if (isUpdate) {
          router.push(`/clienti/${result.id}?success=true&action=update`);
        } else {
          router.push(`/clienti?success=true&action=create`);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">
        {isUpdate ? "Modifica Cliente" : "Nuovo Cliente"}
      </h1>
      <form action={handleSubmit} className="space-y-6">
        {isUpdate && <input type="hidden" name="id" value={cliente.id} />}

        {/* Anagrafica */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Anagrafica</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="denominazione"
                className="block text-sm font-medium"
              >
                Denominazione
              </label>
              <input
                required
                type="text"
                name="denominazione"
                id="denominazione"
                defaultValue={cliente?.denominazione || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="tipologia" className="block text-sm font-medium">
                Tipologia
              </label>
              <select
                required
                name="tipologia"
                id="tipologia"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                defaultValue={cliente?.tipologia || "Azienda"}
              >
                <option value="Azienda">Azienda</option>
                <option value="Privato">Privato</option>
                <option value="Pubblica Amministrazione">
                  Pubblica Amministrazione
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="data_di_nascita"
                className="block text-sm font-medium"
              >
                Data di Nascita
              </label>
              <input
                type="date"
                name="data_di_nascita"
                id="data_di_nascita"
                defaultValue={cliente?.data_di_nascita || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Opzionale, per persone fisiche
              </p>
            </div>

            <div>
              <label
                htmlFor="partita_iva"
                className="block text-sm font-medium"
              >
                Partita IVA
              </label>
              <input
                required
                type="text"
                name="partita_iva"
                id="partita_iva"
                defaultValue={cliente?.partita_iva || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Contatti */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Contatti</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                id="email"
                defaultValue={cliente?.email || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="pec" className="block text-sm font-medium">
                PEC
              </label>
              <input
                type="email"
                name="pec"
                id="pec"
                defaultValue={cliente?.pec || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium">
                Telefono
              </label>
              <input
                type="tel"
                name="telefono"
                id="telefono"
                defaultValue={cliente?.telefono || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Fatturazione */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Fatturazione</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="codice_destinatario_sdi"
                className="block text-sm font-medium"
              >
                Codice SDI
              </label>
              <input
                required
                type="text"
                name="codice_destinatario_sdi"
                id="codice_destinatario_sdi"
                defaultValue={cliente?.codice_destinatario_sdi || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="aliquote_iva"
                className="block text-sm font-medium"
              >
                Aliquota IVA (%)
              </label>
              <input
                required
                type="number"
                name="aliquote_iva"
                id="aliquote_iva"
                defaultValue={cliente?.aliquote_iva || 22}
                min={0}
                max={100}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="sconto_predefinito"
                className="block text-sm font-medium"
              >
                Sconto predefinito (%)
              </label>
              <input
                type="number"
                name="sconto_predefinito"
                id="sconto_predefinito"
                defaultValue={cliente?.sconto_predefinito || 0}
                min={0}
                max={100}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="metodo_di_pagamento_predefinito"
                className="block text-sm font-medium"
              >
                Metodo di pagamento predefinito
              </label>
              <select
                name="metodo_di_pagamento_predefinito"
                id="metodo_di_pagamento_predefinito"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                defaultValue={cliente?.metodo_di_pagamento_predefinito || ""}
              >
                <option value="">Seleziona un metodo</option>
                <option value="bonifico">Bonifico bancario</option>
                <option value="contanti">Contanti</option>
                <option value="carta">Carta di credito</option>
              </select>
            </div>
          </div>
        </div>

        {/* Indirizzo */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Indirizzo</h2>
          <div>
            <label htmlFor="indirizzo" className="block text-sm font-medium">
              Indirizzo
            </label>
            <input
              required
              type="text"
              name="indirizzo"
              id="indirizzo"
              defaultValue={cliente?.indirizzo || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <label htmlFor="cap" className="block text-sm font-medium">
                CAP
              </label>
              <input
                required
                type="text"
                name="cap"
                id="cap"
                defaultValue={cliente?.cap || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="comune" className="block text-sm font-medium">
                Comune
              </label>
              <input
                required
                type="text"
                name="comune"
                id="comune"
                defaultValue={cliente?.comune || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="provincia" className="block text-sm font-medium">
                Provincia
              </label>
              <input
                required
                type="text"
                name="provincia"
                id="provincia"
                defaultValue={cliente?.provincia || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="paese" className="block text-sm font-medium">
                Paese
              </label>
              <input
                required
                type="text"
                name="paese"
                id="paese"
                defaultValue={cliente?.paese || "Italia"}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium">
            Note
          </label>
          <textarea
            name="note"
            id="note"
            rows={3}
            defaultValue={cliente?.note || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <SubmitButton isUpdate={isUpdate} />
      </form>
    </div>
  );
}
