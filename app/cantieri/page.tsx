import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CantieriTable from "./components/CantieriTable";

export default async function Cantieri() {
  const supabase = await createClient();

  // Fetch user from Supabase auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch cantieri with cliente info using Supabase's join capability
  const { data: cantieri = [] } = await supabase.from("cantieri").select(`
      *,
      cliente:clienti(id, denominazione)
    `);

  // Pass data to the client component
  return <CantieriTable data={cantieri ?? []} />;
}
