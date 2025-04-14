import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DipendenteForm } from "../../components/DipendenteForm";
import { notFound } from "next/navigation";

export default async function EditDipendentePage({
  params,
}: {
  params: Promise<{ dipendente_id: string }>;
}) {
  const dipendente_id = (await params).dipendente_id;
  const supabase = await createClient();

  const { data } = await supabase
    .from("dipendenti")
    .select()
    .eq("id", dipendente_id);
  const dipendente = data?.[0];

  if (!dipendente) {
    return notFound();
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <Link
        href={`/dipendenti/${dipendente_id}`}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Indietro
      </Link>
      <DipendenteForm dipendente={dipendente} />
    </div>
  );
}
