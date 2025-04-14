import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TecnicoForm } from "../../components/TecnicoForm";
import { notFound } from "next/navigation";

export default async function EditTecnicoPage({
  params,
}: {
  params: Promise<{ tecnico_id: string }>;
}) {
  const tecnico_id = (await params).tecnico_id;
  const supabase = await createClient();

  const { data } = await supabase.from("tecnici").select().eq("id", tecnico_id);
  const tecnico = data?.[0];

  if (!tecnico) {
    return notFound();
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <Link
        href={`/tecnici/${tecnico_id}`}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Indietro
      </Link>
      <TecnicoForm tecnico={tecnico} isEditing={true} />
    </div>
  );
}
