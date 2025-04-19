import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DipendenteDetails } from "../components/DipendenteDetails";
import { DipendenteForm } from "../components/DipendenteForm";
import { Tables } from "@/utils/supabase/database.types";

type Cantiere = Tables<"cantieri">;

export default async function Page({
  params,
}: {
  params: Promise<{ dipendente_id: string }>;
}) {
  const dipendente_id = (await params).dipendente_id;
  const supabase = await createClient();

  if (dipendente_id === "new") {
    return (
      <div className="flex-1 w-full flex flex-col gap-6">
        <Link
          href="/dipendenti"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Indietro
        </Link>
        <DipendenteForm />
      </div>
    );
  }

  // Fetch basic dipendente data
  const { data } = await supabase
    .from("dipendenti")
    .select()
    .eq("id", dipendente_id);
  const dipendente = data?.[0];

  if (!dipendente) {
    return <div>Dipendente non trovato</div>;
  }

  // Fetch cantieri associated with this dipendente
  const { data: cantiereDipendenti, error: cantiereDipendentiError } =
    await supabase
      .from("cantieri_dipendenti")
      .select("cantiere_id")
      .eq("dipendenti_id", dipendente_id);

  if (cantiereDipendentiError) {
    console.error(
      "Error fetching cantieri for dipendente:",
      cantiereDipendentiError,
    );
  }

  // Get the list of cantiere IDs
  const cantiereIds = cantiereDipendenti?.map((cd) => cd.cantieri_id) || [];

  // Fetch the cantieri details if there are any IDs
  let cantieri: Cantiere[] = [];
  if (cantiereIds.length > 0) {
    const { data: cantieriData, error: cantieriError } = await supabase
      .from("cantieri")
      .select(
        `
        *,
        cliente:clienti(id, denominazione)
      `,
      )
      .in("id", cantiereIds);

    if (cantieriError) {
      console.error("Error fetching cantieri details:", cantieriError);
    } else {
      cantieri = cantieriData || [];
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <Link
        href="/dipendenti"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Indietro
      </Link>
      <DipendenteDetails dipendente={dipendente} cantieri={cantieri} />
    </div>
  );
}
