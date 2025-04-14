"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tables } from "@/utils/supabase/database.types";
import {
  User,
  DollarSign,
  Briefcase,
  Building2,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { removeDipendenteFromCantiere, deleteDipendente } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleEdit = () => {
    router.push(`/dipendenti/${dipendente.id}/edit`);
  };

  const handleDelete = async (formData: FormData) => {
    setIsDeleting(true);
    try {
      const result = await deleteDipendente(formData);
      if (result.success) {
        router.push("/dipendenti?success=true&action=delete");
      }
    } catch (error) {
      console.error("Error deleting dipendente:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {dipendente.nome} {dipendente.cognome}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Modifica
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Elimina
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione non può essere annullata. Questo eliminerà
                  permanentemente il dipendente "{dipendente.nome}{" "}
                  {dipendente.cognome}" e tutti i dati associati.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={dipendente.id} />
                  <AlertDialogAction asChild>
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Eliminazione..." : "Elimina"}
                    </Button>
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

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

      {/* File Management Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <FileUploader
          entityType="dipendente"
          entityId={dipendente.id}
          entityName={`${dipendente.nome} ${dipendente.cognome}`}
        />
        <FileList
          entityType="dipendente"
          entityId={dipendente.id}
          title="Documenti del Dipendente"
        />
      </div>
    </div>
  );
}
