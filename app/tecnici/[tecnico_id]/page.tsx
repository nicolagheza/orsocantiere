import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TecnicoDetails } from "../components/TecnicoDetails";
import { TecnicoForm } from "../components/TecnicoForm";

export default async function Page({
  params,
}: {
  params: Promise<{ tecnico_id: string }>;
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

  // Check if we're on the edit page
  const isEditing = tecnico_id.endsWith("/edit");
  const actualId = isEditing ? tecnico_id.split("/")[0] : tecnico_id;

  const { data } = await supabase.from("tecnici").select().eq("id", actualId);
  const tecnico = data?.[0];

  if (!tecnico) {
    return <div>Tecnico non trovato</div>;
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

      {isEditing ? (
        <TecnicoForm tecnico={tecnico} isEditing={true} />
      ) : (
        <TecnicoDetails tecnico={tecnico} />
      )}
    </div>
  );
}
