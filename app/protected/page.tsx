import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Users,
  Wrench,
  Building2,
  ClipboardList,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch counts from different tables
  const [clientiCount, dipendentiCount, tecniciCount] = await Promise.all([
    supabase.from("clienti").select("id", { count: "exact", head: true }),
    supabase.from("dipendenti").select("id", { count: "exact", head: true }),
    supabase.from("tecnici").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-blue-100">
            Benvenuto, {user.email?.split("@")[0] || "Utente"}! Gestisci i tuoi
            dati e monitora le attività.
          </p>
        </div>
      </section>

      {/* Quick Access Modules */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Moduli</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Clienti Card */}
          <Link href="/clienti" className="no-underline text-foreground">
            <Card className="h-full transition-all hover:shadow-md hover:border-blue-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Clienti</CardTitle>
                  <Building2 className="h-8 w-8 text-blue-500" />
                </div>
                <CardDescription>Gestisci l'anagrafica clienti</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {clientiCount.count || 0}
                  </p>
                  <span className="text-sm text-gray-500">Clienti totali</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Dipendenti Card */}
          <Link href="/dipendenti" className="no-underline text-foreground">
            <Card className="h-full transition-all hover:shadow-md hover:border-blue-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Dipendenti</CardTitle>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <CardDescription>Gestisci il tuo personale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-3xl font-bold text-green-600">
                    {dipendentiCount.count || 0}
                  </p>
                  <span className="text-sm text-gray-500">
                    Dipendenti totali
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Tecnici Card */}
          <Link href="/tecnici" className="no-underline text-foreground">
            <Card className="h-full transition-all hover:shadow-md hover:border-blue-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Tecnici</CardTitle>
                  <Wrench className="h-8 w-8 text-orange-500" />
                </div>
                <CardDescription>
                  Gestisci i tecnici specializzati
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-3xl font-bold text-orange-600">
                    {tecniciCount.count || 0}
                  </p>
                  <span className="text-sm text-gray-500">Tecnici totali</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Azioni Rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/clienti/new">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-500" />
                <span>Nuovo Cliente</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dipendenti/new">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <User className="h-5 w-5 text-green-500" />
                <span>Nuovo Dipendente</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tecnici/new">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Wrench className="h-5 w-5 text-orange-500" />
                <span>Nuovo Tecnico</span>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-purple-500" />
              <span>Rapporto Attività</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* User Info */}
      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informazioni Utente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-sm">
              <span className="font-medium">Ultimo accesso:</span>{" "}
              {new Date().toLocaleString("it-IT")}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
