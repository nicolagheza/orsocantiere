import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TecniciTable from "./components/TecniciTable";

export default async function Tecnici() {
  const supabase = await createClient();

  // Fetch user from Supabase auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch data tecnici
  const { data: tecnici = [] } = await supabase.from("tecnici").select();

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tecnici</h1>
      </div>
      <TecniciTable data={tecnici ?? []} />
    </div>
  );
}
