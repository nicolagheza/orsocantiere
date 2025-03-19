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
        <CantiereForm />
      </div>
    );
  }

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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Dettagli Cantiere</h1>
      <CantiereDetails cantiere={cantiere} />
    </div>
  );
}
