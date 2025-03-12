"use client";

import { Button } from "@/components/ui/button";
import { createTecnico } from "../actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvataggio..." : "Salva Tecnico"}
    </Button>
  );
}

export function TecnicoForm() {
  return (
    <div>
      <h1 className="text-2xl mb-6">Nuovo Tecnico</h1>
      <form action={createTecnico} className="space-y-6">
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
