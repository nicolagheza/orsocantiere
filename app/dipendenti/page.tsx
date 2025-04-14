import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DipendentiTable from "./components/DipendentiTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export default async function Dipendenti({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; action?: string }>;
}) {
  const supabase = await createClient();

  // Fetch user from Supabase auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch data dipendenti
  const { data: dipendenti = [] } = await supabase.from("dipendenti").select();

  // Get success message if present
  const { action, success } = await searchParams;

  let successMessage = "";
  if (success && action) {
    switch (action) {
      case "create":
        successMessage = "Dipendente creato con successo";
        break;
      case "update":
        successMessage = "Dipendente aggiornato con successo";
        break;
      case "delete":
        successMessage = "Dipendente eliminato con successo";
        break;
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dipendenti</h1>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <DipendentiTable data={dipendenti ?? []} />
    </div>
  );
}
