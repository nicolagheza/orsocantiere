import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DipendentiTable from "./components/DipendentiTable";

export default async function Dipendenti() {
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

  return <DipendentiTable data={dipendenti ?? []} />;
}
