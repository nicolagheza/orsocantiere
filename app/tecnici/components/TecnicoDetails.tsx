"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tables } from "@/utils/supabase/database.types";
import { User, Mail, Phone, MapPin, Building2, Briefcase } from "lucide-react";
import { useState } from "react";
import { removeTecnicoFromCantiere } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";

type Tecnico = Tables<"tecnici">;
type Cantiere = Tables<"cantieri"> & {
  cliente?: {
    id: string;
    denominazione: string;
  } | null;
};

interface TecnicoDetailsProps {
  tecnico: Tecnico;
  cantieri?: Cantiere[];
}

export function TecnicoDetails({
  tecnico,
  cantieri = [],
}: TecnicoDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handleRemoveFromCantiere = async (cantiereId: string) => {
    try {
      setLoading((prev) => ({ ...prev, [cantiereId]: true }));
      await removeTecnicoFromCantiere(tecnico.id, cantiereId);
      router.refresh();
    } catch (error) {
      console.error("Failed to remove tecnico from cantiere:", error);
      alert(
        "Si è verificato un errore durante la rimozione del tecnico dal cantiere.",
      );
    } finally {
      setLoading((prev) => ({ ...prev, [cantiereId]: false }));
    }
  };

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
              <p>Questo tecnico non è assegnato a nessun cantiere.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Management Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <FileUploader
          entityType="tecnico"
          entityId={tecnico.id}
          entityName={`${tecnico.nome} ${tecnico.cognome}`}
        />
        <FileList
          entityType="tecnico"
          entityId={tecnico.id}
          title="Documenti del Tecnico"
        />
      </div>
    </div>
  );
}
