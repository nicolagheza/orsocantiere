import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClienteDetails } from "../components/ClienteDetails";
import { ClienteForm } from "../components/ClienteForm";

export default async function Page({
  params,
}: {
  params: Promise<{ cliente_id: string }>
}) {
  const cliente_id = (await params).cliente_id;
  const supabase = await createClient();

  if (cliente_id === 'new') {

    return (
      <div className="flex-1 w-full flex flex-col gap-6">
        <Link
          href="/clienti"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Indietro
        </Link>
        <ClienteForm />
      </div>
    )
  }

  const { data } = await supabase.from('clienti').select().eq('id', cliente_id);
  const cliente = data?.[0];

  if (!cliente) {
    return <div>Cliente non trovato</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <Link
        href="/clienti"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Indietro
      </Link>
      <ClienteDetails cliente={cliente} />
    </div>
  )
}
