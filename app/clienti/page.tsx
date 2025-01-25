import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ClientiTable from './components/ClientiTable';

export default async function Clienti() {
  const supabase = await createClient();

  // Fetch user from Supabase auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch client data
  const { data: clienti = [] } = await supabase.from("clienti").select();

  // Pass data to the client component
  return <ClientiTable data={clienti ?? []} />;
}

