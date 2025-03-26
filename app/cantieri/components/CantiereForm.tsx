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

interface CantiereFormProps {
  dipendenti: Dipendente[];
  tecnici?: Tecnico[];
}

export function CantiereForm({ dipendenti, tecnici = [] }: CantiereFormProps) {
  const [nome, setNome] = useState("");
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [clienti, setClienti] = useState<Tables<"clienti">[]>([]);
  const [selectedDipendenti, setSelectedDipendenti] = useState<string[]>([]);
  const [selectedTecnici, setSelectedTecnici] = useState<string[]>([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        const dipendentiRelations = selectedDipendenti.map((dipendenti_id) => ({
          cantieri_id: cantiereId,
          dipendenti_id,
        }));

        const { error: relationError } = await supabase
          .from("cantieri_dipendenti")
          .insert(dipendentiRelations);

        if (relationError) {
          console.error("Error inserting dipendenti relations:", relationError);
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

      router.push("/cantieri");
      router.refresh();
    } catch (error) {
      console.error("Error creating cantiere:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Cantiere</Label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cliente">Cliente</Label>
        <Select value={clienteId || ""} onValueChange={setClienteId}>
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
        {loading ? "Salvataggio..." : "Salva Cantiere"}
      </Button>
    </form>
  );
}
