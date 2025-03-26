"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/utils/supabase/database.types";
import { Building2, Briefcase, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";

type Cliente = Tables<"clienti">;
type Cantiere = Tables<"cantieri">;
type Tecnico = Tables<"tecnici">;
type Dipendente = Tables<"dipendenti">;

interface CantiereDetailsProps {
  cantiere: Cantiere & {
    cliente?: Pick<Cliente, "id" | "denominazione"> | null;
  };
  tecnici?: Tecnico[];
  dipendenti?: Dipendente[];
  // You can add more related entities as needed
}

export function CantiereDetails({
  cantiere,
  tecnici = [],
  dipendenti = [],
}: CantiereDetailsProps) {
  // Format the creation date
  const formattedDate = cantiere.created_at
    ? format(new Date(cantiere.created_at), "d MMMM yyyy", { locale: it })
    : "Data non disponibile";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{cantiere.nome || "Cantiere senza nome"}</CardTitle>
            <Badge variant="outline">ID: {cantiere.id}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center space-x-4">
            <Building2 className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Cliente</p>
              <p className="text-sm text-gray-500">
                {cantiere.cliente?.denominazione || "Cliente non assegnato"}
              </p>
              {cantiere.cliente_id && (
                <p className="text-sm text-gray-500">
                  ID Cliente: {cantiere.cliente_id}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Data Creazione</p>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Users className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Tecnici Assegnati</p>
              {tecnici.length > 0 ? (
                <div className="space-y-2">
                  {tecnici.map((tecnico) => (
                    <div key={tecnico.id} className="text-sm text-gray-500">
                      {tecnico.nome} {tecnico.cognome}
                      {tecnico.telefono && <span> • {tecnico.telefono}</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Nessun tecnico assegnato
                </p>
              )}
              <p className="text-sm font-medium mt-2">
                Totale: {tecnici.length}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Briefcase className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Dipendenti Assegnati</p>
              {dipendenti.length > 0 ? (
                <div className="space-y-2">
                  {dipendenti.map((dipendente) => (
                    <div key={dipendente.id} className="text-sm text-gray-500">
                      {dipendente.nome} {dipendente.cognome}
                      {dipendente.costo_orario && (
                        <span> • €{dipendente.costo_orario}/h</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Nessun dipendente assegnato
                </p>
              )}
              <p className="text-sm font-medium mt-2">
                Totale: {dipendenti.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <FileUploader />
      <FileList />
    </div>
  );
}
