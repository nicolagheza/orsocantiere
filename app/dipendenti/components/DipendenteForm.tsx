"use client";

import { Button } from "@/components/ui/button";
import { createDipendente, updateDipendente } from "../actions";
import { useFormStatus } from "react-dom";
import { Tables } from "@/utils/supabase/database.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Dipendente = Tables<"dipendenti">;

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? "Salvataggio..."
        : isUpdate
          ? "Aggiorna Dipendente"
          : "Salva Dipendente"}
    </Button>
  );
}

interface DipendenteFormProps {
  dipendente?: Dipendente;
}

export function DipendenteForm({ dipendente }: DipendenteFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isUpdate = !!dipendente;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = isUpdate
        ? await updateDipendente(formData)
        : await createDipendente(formData);

      if (result.success) {
        if (isUpdate) {
          router.push(`/dipendenti/${result.id}?success=true&action=update`);
        } else {
          router.push(`/dipendenti?success=true&action=create`);
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        err instanceof Error ? err.message : "Si è verificato un errore",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">
        {isUpdate ? "Modifica Dipendente" : "Nuovo Dipendente"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        {isUpdate && <input type="hidden" name="id" value={dipendente.id} />}

        <div className="space-y-2">
          <h2 className="text-lg font-medium">Anagrafica</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium">
                Nome
              </label>
              <input
                required
                type="text"
                name="nome"
                id="nome"
                defaultValue={dipendente?.nome || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="cognome" className="block text-sm font-medium">
                Cognome
              </label>
              <input
                required
                type="text"
                name="cognome"
                id="cognome"
                defaultValue={dipendente?.cognome || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="costo_orario"
                className="block text-sm font-medium"
              >
                Costo Orario (€)
              </label>
              <input
                type="number"
                name="costo_orario"
                id="costo_orario"
                min={0}
                step={0.01}
                defaultValue={dipendente?.costo_orario || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        <SubmitButton isUpdate={isUpdate} />
      </form>
    </div>
  );
}
