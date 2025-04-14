"use client";

import { Button } from "@/components/ui/button";
import { createTecnico, updateTecnico } from "../actions";
import { useFormStatus } from "react-dom";
import { Tables } from "@/utils/supabase/database.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Tecnico = Tables<"tecnici">;

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? "Salvataggio..."
        : isUpdate
          ? "Aggiorna Tecnico"
          : "Salva Tecnico"}
    </Button>
  );
}

interface TecnicoFormProps {
  tecnico?: Tecnico;
  isEditing?: boolean;
}

export function TecnicoForm({ tecnico, isEditing = false }: TecnicoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isUpdate = !!tecnico || isEditing;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = isUpdate
        ? await updateTecnico(formData)
        : await createTecnico(formData);

      if (result.success) {
        if (isUpdate) {
          router.push(`/tecnici/${result.id}?success=true&action=update`);
        } else {
          router.push(`/tecnici?success=true&action=create`);
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
        {isUpdate ? "Modifica Tecnico" : "Nuovo Tecnico"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        {isUpdate && (
          <input type="hidden" name="id" value={tecnico?.id || ""} />
        )}

        {/* Anagrafica */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Anagrafica</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium">
                Nome
              </label>
              <input
                required
                type="text"
                name="nome"
                id="nome"
                defaultValue={tecnico?.nome || ""}
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
                defaultValue={tecnico?.cognome || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Contatti */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Contatti</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={tecnico?.email || ""}
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
                defaultValue={tecnico?.telefono || ""}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Indirizzo */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Indirizzo</h2>
          <div>
            <label htmlFor="via" className="block text-sm font-medium">
              Via
            </label>
            <input
              type="text"
              name="via"
              id="via"
              defaultValue={tecnico?.via || ""}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <SubmitButton isUpdate={isUpdate} />
      </form>
    </div>
  );
}
