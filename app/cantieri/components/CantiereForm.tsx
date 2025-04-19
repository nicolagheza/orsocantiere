"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/database.types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type Dipendente = Tables<"dipendenti">;
type Tecnico = Tables<"tecnici">;
type Cantiere = Tables<"cantieri">;

interface CantiereFormProps {
  dipendenti: Dipendente[];
  tecnici?: Tecnico[];
  cantiere?: Cantiere;
  assignedDipendentiIds?: string[];
  assignedTecniciIds?: string[];
}

export function CantiereForm({
  dipendenti,
  tecnici = [],
  cantiere,
  assignedDipendentiIds = [],
  assignedTecniciIds = [],
}: CantiereFormProps) {
  const isUpdate = !!cantiere;
  const [nome, setNome] = useState(cantiere?.nome || "");
  const [clienteId, setClienteId] = useState<string | null>(
    cantiere?.cliente_id || null,
  );
  const [clienti, setClienti] = useState<Tables<"clienti">[]>([]);
  const [selectedDipendenti, setSelectedDipendenti] = useState<string[]>(
    assignedDipendentiIds,
  );
  const [selectedTecnici, setSelectedTecnici] =
    useState<string[]>(assignedTecniciIds);
  const [loading, setLoading] = useState(false);
  const [loadingClienti, setLoadingClienti] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Fetch clienti on component mount
  useEffect(() => {
    const fetchClienti = async () => {
      const { data, error } = await supabase
        .from("clienti")
        .select("*")
        .order("denominazione", { ascending: true });

      if (error) {
        console.error("Error fetching clienti:", error);
      } else {
        setClienti(data || []);
      }
      setLoadingClienti(false);
    };

    fetchClienti();
  }, []);

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isUpdate) {
        // Update existing cantiere
        const { data, error: updateError } = await supabase
          .from("cantieri")
          .upsert({
            id: cantiere.id,
            nome: nome,
            cliente_id: clienteId,
          })
          .select();

        console.log("data", data);
        if (updateError) {
          throw updateError;
        }

        console.log("Cantiere updated successfully:", {
          nome,
          cliente_id: clienteId,
        });

        // Handle dipendenti relationships
        // First, get current assignments
        const { data: currentDipendentiRelations } = await supabase
          .from("cantieri_dipendenti")
          .select("dipendenti_id")
          .eq("cantieri_id", cantiere.id);

        const currentDipendentiIds =
          currentDipendentiRelations?.map((r) => r.dipendenti_id) || [];

        // Find which to add and which to remove
        const toAdd = selectedDipendenti.filter(
          (id) => !currentDipendentiIds.includes(id),
        );
        const toRemove = currentDipendentiIds.filter(
          (id) => !selectedDipendenti.includes(id),
        );

        // Add new relationships
        if (toAdd.length > 0) {
          const newRelations = toAdd.map((dipendenti_id) => ({
            cantieri_id: cantiere.id,
            dipendenti_id,
          }));

          const { error: addError } = await supabase
            .from("cantieri_dipendenti")
            .insert(newRelations);

          if (addError) {
            console.error("Error adding dipendenti relations:", addError);
          }
        }

        // Remove relationships
        for (const dipendenti_id of toRemove) {
          const { error: removeError } = await supabase
            .from("cantieri_dipendenti")
            .delete()
            .match({
              cantieri_id: cantiere.id,
              dipendenti_id,
            });

          if (removeError) {
            console.error("Error removing dipendenti relation:", removeError);
          }
        }

        // Handle tecnici relationships
        // First, get current assignments
        const { data: currentTecniciRelations } = await supabase
          .from("cantieri_tecnici")
          .select("tecnici_id")
          .eq("cantieri_id", cantiere.id);

        const currentTecniciIds =
          currentTecniciRelations?.map((r) => r.tecnici_id) || [];

        // Find which to add and which to remove
        const tecniciToAdd = selectedTecnici.filter(
          (id) => !currentTecniciIds.includes(id),
        );
        const tecniciToRemove = currentTecniciIds.filter(
          (id) => !selectedTecnici.includes(id),
        );

        // Add new relationships
        if (tecniciToAdd.length > 0) {
          const newRelations = tecniciToAdd.map((tecnici_id) => ({
            cantieri_id: cantiere.id,
            tecnici_id,
          }));

          const { error: addError } = await supabase
            .from("cantieri_tecnici")
            .insert(newRelations);

          if (addError) {
            console.error("Error adding tecnici relations:", addError);
          }
        }

        // Remove relationships
        for (const tecnici_id of tecniciToRemove) {
          const { error: removeError } = await supabase
            .from("cantieri_tecnici")
            .delete()
            .match({
              cantieri_id: cantiere.id,
              tecnici_id,
            });

          if (removeError) {
            console.error("Error removing tecnici relation:", removeError);
          }
        }

        // Call refresh before navigating
        router.refresh();

        // Wait a moment to ensure data is updated
        setTimeout(() => {
          router.push(`/cantieri/${cantiere.id}`);
        }, 500);
      } else {
        // Insert new cantiere
        const { data: cantiereData, error: cantiereError } = await supabase
          .from("cantieri")
          .insert([
            {
              nome,
              cliente_id: clienteId,
            },
          ])
          .select()
          .single();

        if (cantiereError) {
          throw cantiereError;
        }

        // Insert cantiere-dipendenti relationships
        if (selectedDipendenti.length > 0) {
          const cantiereId = cantiereData.id;
          const dipendentiRelations = selectedDipendenti.map(
            (dipendenti_id) => ({
              cantieri_id: cantiereId,
              dipendenti_id,
            }),
          );

          const { error: relationError } = await supabase
            .from("cantieri_dipendenti")
            .insert(dipendentiRelations);

          if (relationError) {
            console.error(
              "Error inserting dipendenti relations:",
              relationError,
            );
          }
        }

        // Insert cantiere-tecnici relationships
        if (selectedTecnici.length > 0) {
          const cantiereId = cantiereData.id;
          const tecniciRelations = selectedTecnici.map((tecnici_id) => ({
            cantieri_id: cantiereId,
            tecnici_id,
          }));

          const { error: tecniciError } = await supabase
            .from("cantieri_tecnici")
            .insert(tecniciRelations);

          if (tecniciError) {
            console.error("Error inserting tecnici relations:", tecniciError);
          }
        }

        router.refresh();

        // Wait a moment to ensure data is updated
        setTimeout(() => {
          router.push("/cantieri");
        }, 500);
      }
    } catch (error) {
      console.error(
        `Error ${isUpdate ? "updating" : "creating"} cantiere:`,
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDirectSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Cantiere</Label>
        <Input
          id="nome"
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cliente">Cliente</Label>
        <Select
          name="cliente_id"
          value={clienteId || ""}
          onValueChange={setClienteId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleziona cliente" />
          </SelectTrigger>
          <SelectContent>
            {loadingClienti ? (
              <SelectItem value="loading" disabled>
                Caricamento...
              </SelectItem>
            ) : (
              clienti.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.denominazione}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Dipendenti Assegnati</Label>
        <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
          {dipendenti.map((dipendente) => (
            <div key={dipendente.id} className="flex items-center space-x-2">
              <Checkbox
                id={`dipendente-${dipendente.id}`}
                checked={selectedDipendenti.includes(dipendente.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedDipendenti([
                      ...selectedDipendenti,
                      dipendente.id,
                    ]);
                  } else {
                    setSelectedDipendenti(
                      selectedDipendenti.filter((id) => id !== dipendente.id),
                    );
                  }
                }}
              />
              <Label
                htmlFor={`dipendente-${dipendente.id}`}
                className="cursor-pointer"
              >
                {dipendente.nome} {dipendente.cognome}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tecnici Assegnati</Label>
        <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
          {tecnici.map((tecnico) => (
            <div key={tecnico.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tecnico-${tecnico.id}`}
                checked={selectedTecnici.includes(tecnico.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTecnici([...selectedTecnici, tecnico.id]);
                  } else {
                    setSelectedTecnici(
                      selectedTecnici.filter((id) => id !== tecnico.id),
                    );
                  }
                }}
              />
              <Label
                htmlFor={`tecnico-${tecnico.id}`}
                className="cursor-pointer"
              >
                {tecnico.nome} {tecnico.cognome}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading
          ? "Salvataggio..."
          : isUpdate
            ? "Aggiorna Cantiere"
            : "Salva Cantiere"}
      </Button>
    </form>
  );
}
