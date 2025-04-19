"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/utils/supabase/database.types";
import { Building2, Calendar, X, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  addDipendenteToCantiere,
  removeDipendenteFromCantiere,
  addTecnicoToCantiere,
  removeTecnicoFromCantiere,
  deleteCantiere,
} from "../actions";
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
import { useRouter } from "next/navigation";

type Cliente = Tables<"clienti">;
type Cantiere = Tables<"cantieri">;
type Tecnico = Tables<"tecnici">;
type Dipendente = Tables<"dipendenti">;

interface CantiereDetailsProps {
  cantiere: Cantiere & {
    cliente?: Pick<Cliente, "id" | "denominazione"> | null;
  };
  assignedTecnici?: Tecnico[];
  unassignedTecnici?: Tecnico[];
  assignedDipendenti?: Dipendente[];
  unassignedDipendenti?: Dipendente[];
}

export function CantiereDetails({
  cantiere,
  assignedTecnici = [],
  unassignedTecnici = [],
  assignedDipendenti = [],
  unassignedDipendenti = [],
}: CantiereDetailsProps) {
  const router = useRouter();
  const [selectedDipendente, setSelectedDipendente] = useState<string>("");
  const [selectedTecnico, setSelectedTecnico] = useState<string>("");
  const [isAddingDipendente, setIsAddingDipendente] = useState(false);
  const [isAddingTecnico, setIsAddingTecnico] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingDipendenti, setLoadingDipendenti] = useState<{
    [key: string]: boolean;
  }>({});
  const [loadingTecnici, setLoadingTecnici] = useState<{
    [key: string]: boolean;
  }>({});

  // Format the creation date
  const formattedDate = cantiere.created_at
    ? format(new Date(cantiere.created_at), "d MMMM yyyy", { locale: it })
    : "Data non disponibile";

  const handleEdit = () => {
    router.push(`/cantieri/${cantiere.id}/edit`);
  };

  const handleDelete = async (formData: FormData) => {
    setIsDeleting(true);
    try {
      const result = await deleteCantiere(formData);
      if (result.success) {
        router.push("/cantieri?success=true&action=delete");
      }
    } catch (error) {
      console.error("Error deleting cantiere:", error);
      setIsDeleting(false);
    }
  };

  const handleAddDipendente = async () => {
    if (!selectedDipendente) return;

    try {
      setIsAddingDipendente(true);
      await addDipendenteToCantiere(cantiere.id, selectedDipendente);
      setSelectedDipendente("");
      router.refresh();
    } catch (error) {
      console.error("Error adding dipendente:", error);
      alert("Si è verificato un errore durante l'aggiunta del dipendente.");
    } finally {
      setIsAddingDipendente(false);
    }
  };

  const handleRemoveDipendente = async (dipendenteId: string) => {
    try {
      setLoadingDipendenti((prev) => ({ ...prev, [dipendenteId]: true }));
      await removeDipendenteFromCantiere(cantiere.id, dipendenteId);
      router.refresh();
    } catch (error) {
      console.error("Error removing dipendente:", error);
      alert("Si è verificato un errore durante la rimozione del dipendente.");
    } finally {
      setLoadingDipendenti((prev) => ({ ...prev, [dipendenteId]: false }));
    }
  };

  const handleAddTecnico = async () => {
    if (!selectedTecnico) return;

    try {
      setIsAddingTecnico(true);
      await addTecnicoToCantiere(cantiere.id, selectedTecnico);
      setSelectedTecnico("");
      router.refresh();
    } catch (error) {
      console.error("Error adding tecnico:", error);
      alert("Si è verificato un errore durante l'aggiunta del tecnico.");
    } finally {
      setIsAddingTecnico(false);
    }
  };

  const handleRemoveTecnico = async (tecnicoId: string) => {
    try {
      setLoadingTecnici((prev) => ({ ...prev, [tecnicoId]: true }));
      await removeTecnicoFromCantiere(cantiere.id, tecnicoId);
      router.refresh();
    } catch (error) {
      console.error("Error removing tecnico:", error);
      alert("Si è verificato un errore durante la rimozione del tecnico.");
    } finally {
      setLoadingTecnici((prev) => ({ ...prev, [tecnicoId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{cantiere.nome || "Cantiere senza nome"}</h1>
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
                  permanentemente il cantiere "{cantiere.nome}" e tutti i
                  dati associati.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={cantiere.id} />
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
        </CardContent>
      </Card>

      {/* Tecnici Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Tecnici Assegnati</CardTitle>
            <Badge>{assignedTecnici.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Tecnico Section */}
          {unassignedTecnici.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Select
                value={selectedTecnico}
                onValueChange={setSelectedTecnico}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Seleziona tecnico da aggiungere" />
                </SelectTrigger>
                <SelectContent>
                  {unassignedTecnici.map((tecnico) => (
                    <SelectItem key={tecnico.id} value={tecnico.id}>
                      {tecnico.nome} {tecnico.cognome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddTecnico}
                disabled={!selectedTecnico || isAddingTecnico}
                size="sm"
              >
                {isAddingTecnico ? "Aggiunta..." : "Aggiungi Tecnico"}
              </Button>
            </div>
          )}

          {/* Assigned Tecnici List */}
          {assignedTecnici.length > 0 ? (
            <div className="space-y-2">
              {assignedTecnici.map((tecnico) => (
                <div
                  key={tecnico.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium">
                      {tecnico.nome} {tecnico.cognome}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tecnico.telefono && <span>{tecnico.telefono}</span>}
                      {tecnico.email && <span> • {tecnico.email}</span>}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveTecnico(tecnico.id)}
                    disabled={loadingTecnici[tecnico.id]}
                  >
                    {loadingTecnici[tecnico.id] ? (
                      "Rimozione..."
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>Nessun tecnico assegnato a questo cantiere</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dipendenti Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Dipendenti Assegnati</CardTitle>
            <Badge>{assignedDipendenti.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Dipendente Section */}
          {unassignedDipendenti.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Select
                value={selectedDipendente}
                onValueChange={setSelectedDipendente}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Seleziona dipendente da aggiungere" />
                </SelectTrigger>
                <SelectContent>
                  {unassignedDipendenti.map((dipendente) => (
                    <SelectItem key={dipendente.id} value={dipendente.id}>
                      {dipendente.nome} {dipendente.cognome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddDipendente}
                disabled={!selectedDipendente || isAddingDipendente}
                size="sm"
              >
                {isAddingDipendente ? "Aggiunta..." : "Aggiungi Dipendente"}
              </Button>
            </div>
          )}

          {/* Assigned Dipendenti List */}
          {assignedDipendenti.length > 0 ? (
            <div className="space-y-2">
              {assignedDipendenti.map((dipendente) => (
                <div
                  key={dipendente.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium">
                      {dipendente.nome} {dipendente.cognome}
                    </p>
                    {dipendente.costo_orario && (
                      <p className="text-sm text-gray-500">
                        Costo orario: €{dipendente.costo_orario}/h
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveDipendente(dipendente.id)}
                    disabled={loadingDipendenti[dipendente.id]}
                  >
                    {loadingDipendenti[dipendente.id] ? (
                      "Rimozione..."
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>Nessun dipendente assegnato a questo cantiere</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Management Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <FileUploader
          entityType="cantiere"
          entityId={cantiere.id}
          entityName={cantiere.nome || "Cantiere"}
        />
        <FileList
          entityType="cantiere"
          entityId={cantiere.id}
          title="Documenti del Cantiere"
        />
      </div>
    </div>
  );
}
