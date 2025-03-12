import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/utils/supabase/database.types";
import { User, Mail, Phone, MapPin } from "lucide-react";

type Tecnico = Tables<"tecnici">;

interface TecnicoDetailsProps {
  tecnico: Tecnico;
}

export function TecnicoDetails({ tecnico }: TecnicoDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {tecnico.nome} {tecnico.cognome}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dettagli Tecnico</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Informazioni Personali</p>
              <p className="text-sm text-gray-500">Nome: {tecnico.nome}</p>
              <p className="text-sm text-gray-500">
                Cognome: {tecnico.cognome}
              </p>
            </div>
          </div>

          {tecnico.email && (
            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Contatto Email</p>
                <p className="text-sm text-gray-500">
                  <a
                    href={`mailto:${tecnico.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {tecnico.email}
                  </a>
                </p>
              </div>
            </div>
          )}

          {tecnico.telefono && (
            <div className="flex items-center space-x-4">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Contatto Telefonico</p>
                <p className="text-sm text-gray-500">
                  <a
                    href={`tel:${tecnico.telefono}`}
                    className="text-blue-600 hover:underline"
                  >
                    {tecnico.telefono}
                  </a>
                </p>
              </div>
            </div>
          )}

          {tecnico.via && (
            <div className="flex items-center space-x-4">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Indirizzo</p>
                <p className="text-sm text-gray-500">{tecnico.via}</p>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm font-medium">ID: {tecnico.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
