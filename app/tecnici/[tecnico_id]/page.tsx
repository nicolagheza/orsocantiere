import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TecnicoDetails } from "../components/TecnicoDetails";
import { TecnicoForm } from "../components/TecnicoForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Tables } from "@/utils/supabase/database.types";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ tecnico_id: string }>;
  searchParams: Promise<{ success?: string; action?: string }>;
}) {
  const tecnico_id = (await params).tecnico_id;
  const supabase = await createClient();

  if (tecnico_id === "new") {
    return (
      <div className="flex-1 w-full flex flex-col gap-6">
        <Link
          href="/tecnici"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Indietro
        </Link>
        <TecnicoForm />
      </div>
    );
  }

  // Fetch tecnico data
  const { data } = await supabase.from("tecnici").select().eq("id", tecnico_id);
  const tecnico = data?.[0];

  if (!tecnico) {
    return notFound();
  }

  // Define the type for cantieri
  type Cantiere = Tables<"cantieri"> & {
    cliente?: {
      id: string;
      denominazione: string;
    } | null;
  };

  // Fetch cantieri associated with this tecnico
  let cantieri: Cantiere[] = [];

  // First get the cantieri IDs associated with this tecnico
  const { data: cantieriTecnici, error: cantieriTecniciError } = await supabase
    .from("cantieri_tecnici")
    .select("cantieri_id")
    .eq("tecnici_id", tecnico_id);

  if (cantieriTecniciError) {
    console.error("Error fetching cantieri for tecnico:", cantieriTecniciError);
  } else if (cantieriTecnici.length > 0) {
    // Extract the cantiere IDs
    const cantiereIds = cantieriTecnici.map((item) => item.cantieri_id);

    // Fetch the cantieri details including cliente info
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
      cantieri = cantieriData as Cantiere[];
    }
  }

  // Get success message if present
  const { action, success } = await searchParams;

  let successMessage = "";
  if (success && action && action === "update") {
    successMessage = "Tecnico aggiornato con successo";
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <Link
        href="/tecnici"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Indietro
      </Link>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <TecnicoDetails tecnico={tecnico} cantieri={cantieri} />
    </div>
  );
}
