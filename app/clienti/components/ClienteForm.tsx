'use client'

import { Button } from '@/components/ui/button'
import { createCliente } from '../actions'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Salvataggio...' : 'Salva Cliente'}
    </Button>
  )
}

export function ClienteForm() {
  return (
    <div>
      <h1 className='text-2xl mb-6'>Nuovo Cliente</h1>
      <form action={createCliente} className="space-y-6">
        {/* Anagrafica */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Anagrafica</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="denominazione" className="block text-sm font-medium">
                Denominazione
              </label>
              <input
                required
                type="text"
                name="denominazione"
                id="denominazione"
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
                defaultValue="Azienda"
              >
                <option value="Azienda">Azienda</option>
                <option value="Privato">Privato</option>
              </select>
            </div>

            <div>
              <label htmlFor="partita_iva" className="block text-sm font-medium">
                Partita IVA
              </label>
              <input
                required
                type="text"
                name="partita_iva"
                id="partita_iva"
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

        {/* Fatturazione */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Fatturazione</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="codice_destinatario_sdi" className="block text-sm font-medium">
                Codice SDI
              </label>
              <input
                required
                type="text"
                name="codice_destinatario_sdi"
                id="codice_destinatario_sdi"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="aliquote_iva" className="block text-sm font-medium">
                Aliquota IVA (%)
              </label>
              <input
                required
                type="number"
                name="aliquote_iva"
                id="aliquote_iva"
                defaultValue={22}
                min={0}
                max={100}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="sconto_predefinito" className="block text-sm font-medium">
                Sconto predefinito (%)
              </label>
              <input
                type="number"
                name="sconto_predefinito"
                id="sconto_predefinito"
                defaultValue={0}
                min={0}
                max={100}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="metodo_di_pagamento_predefinito" className="block text-sm font-medium">
                Metodo di pagamento predefinito
              </label>
              <select
                name="metodo_di_pagamento_predefinito"
                id="metodo_di_pagamento_predefinito"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                defaultValue=""
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
                defaultValue="Italia"
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}
