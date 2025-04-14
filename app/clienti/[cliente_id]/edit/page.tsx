import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClienteForm } from "../../components/ClienteForm";
import { notFound } from "next/navigation";

export default async function EditClientePage({
  params,
}: {
  params: Promise<{ cliente_id: string }>;
}) {
  const cliente_id = (await params).cliente_id;
  const supabase = await createClient();

  const { data } = await supabase.from("clienti").select().eq("id", cliente_id);
  const cliente = data?.[0];

  if (!cliente) {
    return notFound();
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <Link
        href={`/clienti/${cliente_id}`}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Indietro
      </Link>
      <ClienteForm cliente={cliente} />
    </div>
  );
}
