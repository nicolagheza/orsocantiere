"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tables } from "@/utils/supabase/database.types";
import { User, DollarSign, Briefcase, Building2 } from "lucide-react";
import { useState } from "react";
import { removeDipendenteFromCantiere } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Dipendente = Tables<"dipendenti">;
type Cantiere = Tables<"cantieri"> & {
  cliente?: {
    id: string;
    denominazione: string;
  } | null;
};

interface DipendenteDetailsProps {
  dipendente: Dipendente;
  cantieri?: Cantiere[];
}

export function DipendenteDetails({
  dipendente,
  cantieri = [],
}: DipendenteDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handleRemoveFromCantiere = async (cantiereId: string) => {
    try {
      setLoading((prev) => ({ ...prev, [cantiereId]: true }));
      await removeDipendenteFromCantiere(dipendente.id, cantiereId);
      router.refresh();
    } catch (error) {
      console.error("Failed to remove dipendente from cantiere:", error);
      alert(
        "Si è verificato un errore durante la rimozione del dipendente dal cantiere.",
      );
    } finally {
      setLoading((prev) => ({ ...prev, [cantiereId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {dipendente.nome} {dipendente.cognome}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Dettagli Personali</p>
              <p className="text-sm text-gray-500">Nome: {dipendente.nome}</p>
              <p className="text-sm text-gray-500">
                Cognome: {dipendente.cognome}
              </p>
            </div>
          </div>

          {dipendente.costo_orario && (
            <div className="flex items-center space-x-4">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Dettagli Economici</p>
                <p className="text-sm text-gray-500">
                  Costo Orario: {dipendente.costo_orario}€
                </p>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm font-medium">ID: {dipendente.id}</p>
            <p className="text-sm text-gray-500">
              Creato il:{" "}
              {new Date(dipendente.created_at).toLocaleDateString("it-IT")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Cantieri Assegnati</CardTitle>
        </CardHeader>
        <CardContent>
          {cantieri.length > 0 ? (
            <div className="space-y-4">
              {cantieri.map((cantiere) => (
                <div key={cantiere.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-gray-500" />
                      <Link
                        href={`/cantieri/${cantiere.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {cantiere.nome || "Cantiere senza nome"}
                      </Link>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveFromCantiere(cantiere.id)}
                      disabled={loading[cantiere.id]}
                    >
                      {loading[cantiere.id] ? "Rimozione..." : "Rimuovi"}
                    </Button>
                  </div>
                  <div className="ml-7 text-sm text-gray-500">
                    <p>
                      Cliente:{" "}
                      {cantiere.cliente?.denominazione ||
                        "Cliente non assegnato"}
                    </p>
                    <p>
                      Data creazione:{" "}
                      {new Date(cantiere.created_at).toLocaleDateString(
                        "it-IT",
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>Questo dipendente non è assegnato a nessun cantiere.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
