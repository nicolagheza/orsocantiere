import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CantiereForm } from "../../components/CantiereForm";
import { notFound } from "next/navigation";

export default async function EditCantierePage({
  params,
}: {
  params: Promise<{ cantiere_id: string }>;
}) {
  const cantiere_id = (await params).cantiere_id;
  const supabase = await createClient();

  // Fetch the cantiere data
  const { data: cantiere, error: cantiereError } = await supabase
    .from("cantieri")
    .select()
    .eq("id", cantiere_id)
    .single();

  if (cantiereError || !cantiere) {
    return notFound();
  }

  // Fetch all dipendenti and tecnici
  const { data: allDipendenti, error: dipendentiError } = await supabase
    .from("dipendenti")
    .select("*")
    .order("cognome", { ascending: true });

  if (dipendentiError) {
    console.error("Error fetching dipendenti:", dipendentiError);
  }

  const { data: allTecnici, error: tecniciError } = await supabase
    .from("tecnici")
    .select("*")
    .order("cognome", { ascending: true });

  if (tecniciError) {
    console.error("Error fetching tecnici:", tecniciError);
  }

  // Fetch assigned dipendenti for this cantiere
  const { data: cantiereDipendenti, error: cantiereDipendentiError } =
    await supabase
      .from("cantieri_dipendenti")
      .select("dipendenti_id")
      .eq("cantieri_id", cantiere_id);

  if (cantiereDipendentiError) {
    console.error("Error fetching cantiere dipendenti:", cantiereDipendentiError);
  }

  // Fetch assigned tecnici for this cantiere
  const { data: cantiereTecnici, error: cantiereTecniciError } = await supabase
    .from("cantieri_tecnici")
    .select("tecnici_id")
    .eq("cantieri_id", cantiere_id);

  if (cantiereTecniciError) {
    console.error("Error fetching cantiere tecnici:", cantiereTecniciError);
  }

  const assignedDipendentiIds = cantiereDipendenti?.map((d) => d.dipendenti_id) || [];
  const assignedTecniciIds = cantiereTecnici?.map((t) => t.tecnici_id) || [];

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <Link
        href={`/cantieri/${cantiere_id}`}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Indietro
      </Link>
      <h1 className="text-2xl font-bold">Modifica Cantiere</h1>
      <CantiereForm 
        cantiere={cantiere} 
        dipendenti={allDipendenti || []} 
        tecnici={allTecnici || []}
        assignedDipendentiIds={assignedDipendentiIds}
        assignedTecniciIds={assignedTecniciIds}
      />
    </div>
  );
}