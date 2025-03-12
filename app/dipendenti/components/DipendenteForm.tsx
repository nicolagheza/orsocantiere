"use client";

import { Button } from "@/components/ui/button";
import { createDipendente } from "../actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvataggio..." : "Salva Dipendente"}
    </Button>
  );
}

export function DipendenteForm() {
  return (
    <div>
      <h1 className="text-2xl mb-6">Nuovo Dipendente</h1>
      <form action={createDipendente} className="space-y-6">
        {/* Anagrafica */}
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
