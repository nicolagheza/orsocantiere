import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/utils/supabase/database.types";
import { User, DollarSign } from "lucide-react";

type Dipendente = Tables<"dipendenti">;

interface DipendenteDetailsProps {
  dipendente: Dipendente;
}

export function DipendenteDetails({ dipendente }: DipendenteDetailsProps) {
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
    </div>
  );
}
