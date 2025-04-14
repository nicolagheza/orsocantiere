"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/utils/supabase/database.types";
import {
  Building2,
  Edit,
  Mail,
  MapPin,
  Phone,
  Tag,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCliente } from "../actions";
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

type Cliente = Tables<"clienti">;

interface ClienteDetailsProps {
  cliente: Cliente;
}

export function ClienteDetails({ cliente }: ClienteDetailsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date if available
  const formattedBirthDate = cliente.data_di_nascita
    ? format(new Date(cliente.data_di_nascita), "d MMMM yyyy", { locale: it })
    : null;

  const handleEdit = () => {
    router.push(`/clienti/${cliente.id}/edit`);
  };

  const handleDelete = async (formData: FormData) => {
    setIsDeleting(true);
    try {
      const result = await deleteCliente(formData);
      if (result.success) {
        router.push("/clienti?success=true&action=delete");
      }
    } catch (error) {
      console.error("Error deleting cliente:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{cliente.denominazione}</h1>
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
                  permanentemente il cliente "{cliente.denominazione}" e tutti i
                  dati associati.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={cliente.id} />
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
            <CardTitle>{cliente.denominazione}</CardTitle>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="text-sm font-normal">{cliente.tipologia}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center space-x-4">
            <Building2 className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Dettagli Aziendali</p>
              <p className="text-sm text-gray-500">
                P.IVA: {cliente.partita_iva}
              </p>
              <p className="text-sm text-gray-500">
                SDI: {cliente.codice_destinatario_sdi}
              </p>
              <p className="text-sm text-gray-500">
                IVA: {cliente.aliquote_iva}%
              </p>
              {formattedBirthDate && (
                <p className="text-sm text-gray-500">
                  Data di nascita: {formattedBirthDate}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Indirizzo</p>
              <p className="text-sm text-gray-500">{cliente.indirizzo}</p>
              <p className="text-sm text-gray-500">
                {cliente.cap} {cliente.comune} ({cliente.provincia})
              </p>
              <p className="text-sm text-gray-500">{cliente.paese}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Contatti Email</p>
              <p className="text-sm text-gray-500">{cliente.email}</p>
              <p className="text-sm text-gray-500">PEC: {cliente.pec}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Phone className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Telefono</p>
              <p className="text-sm text-gray-500">{cliente.telefono}</p>
            </div>
          </div>

          {cliente.note && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium">Note</p>
              <p className="text-sm text-gray-500">{cliente.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Management Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <FileUploader
          entityType="cliente"
          entityId={cliente.id}
          entityName={cliente.denominazione}
        />
        <FileList
          entityType="cliente"
          entityId={cliente.id}
          title="Documenti del Cliente"
        />
      </div>
    </div>
  );
}
