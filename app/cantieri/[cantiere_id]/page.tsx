import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { CantiereDetails } from "../components/CantiereDetails";
import { CantiereForm } from "../components/CantiereForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ cantiere_id: string }>;
}) {
  const cantiere_id = (await params).cantiere_id;
  const supabase = await createClient();

  // Fetch all dipendenti and tecnici for the form
  const { data: dipendenti, error: dipendentiError } = await supabase
    .from("dipendenti")
    .select("*")
    .order("cognome", { ascending: true });

  if (dipendentiError) {
    console.error("Error fetching dipendenti:", dipendentiError);
  }

  const { data: tecnici, error: tecniciError } = await supabase
    .from("tecnici")
    .select("*")
    .order("cognome", { ascending: true });

  if (tecniciError) {
    console.error("Error fetching tecnici:", tecniciError);
  }

  // For new cantiere, show the form
  if (cantiere_id === "new") {
    return (
      <div className="flex-1 w-full flex flex-col gap-6">
        <Link
          href="/cantieri"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Indietro
        </Link>
        <CantiereForm dipendenti={dipendenti || []} tecnici={tecnici || []} />
      </div>
    );
  }

  // For existing cantiere, show details

  // Fetch the cantiere with related cliente info
  const { data: cantiere, error: cantiereError } = await supabase
    .from("cantieri")
    .select(
      `
      *,
      cliente:clienti(id, denominazione)
      `,
    )
    .eq("id", cantiere_id)
    .single();

  if (cantiereError || !cantiere) {
    console.error("Error fetching cantiere:", cantiereError);
    notFound();
  }

  // Fetch assigned dipendenti for this cantiere
  const { data: cantiereDipendenti, error: cantiereDipendentiError } =
    await supabase
      .from("cantieri_dipendenti")
      .select("dipendenti_id")
      .eq("cantieri_id", cantiere_id);

  if (cantiereDipendentiError) {
    console.error(
      "Error fetching cantiere dipendenti:",
      cantiereDipendentiError,
    );
  }

  // Fetch assigned tecnici for this cantiere
  const { data: cantiereTecnici, error: cantiereTecniciError } = await supabase
    .from("cantieri_tecnici")
    .select("tecnici_id")
    .eq("cantieri_id", cantiere_id);

  if (cantiereTecniciError) {
    console.error("Error fetching cantiere tecnici:", cantiereTecniciError);
  }

  // Filter dipendenti and tecnici to get only those assigned to this cantiere
  const assignedDipendentiIds =
    cantiereDipendenti?.map((d) => d.dipendenti_id) || [];
  const assignedDipendenti =
    dipendenti?.filter((d) => assignedDipendentiIds.includes(d.id)) || [];

  const assignedTecniciIds = cantiereTecnici?.map((t) => t.tecnici_id) || [];
  const assignedTecnici =
    tecnici?.filter((t) => assignedTecniciIds.includes(t.id)) || [];

  return (
    <div className="container mx-auto py-10">
      <Link
        href="/cantieri"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Indietro
      </Link>
      <h1 className="text-2xl font-bold mb-6">Dettagli Cantiere</h1>
      <CantiereDetails
        cantiere={cantiere}
        dipendenti={assignedDipendenti}
        tecnici={assignedTecnici}
      />
    </div>
  );
}
