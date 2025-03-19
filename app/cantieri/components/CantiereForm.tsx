"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { createCantiere } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvataggio..." : "Salva Cantiere"}
    </Button>
  );
}

export function CantiereForm() {
  return (
    <div>
      <h1 className="text-2xl mb-6">Nuovo Cantiere</h1>
      <form action={createCantiere} className="space-y-6">
        {/* Dati Cantiere */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Dati Cantiere</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium">
                Nome Cantiere
              </label>
              <input
                required
                type="text"
                name="nome"
                id="nome"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Es. Ristrutturazione Appartamento Via Roma"
              />
            </div>
          </div>
        </div>

        {/* Qui potresti aggiungere altre sezioni come:
        - Indirizzo del cantiere
        - Contatti sul posto
        - Date previste (inizio/fine)
        - Budget previsto
        */}

        <SubmitButton />
      </form>
    </div>
  );
}
