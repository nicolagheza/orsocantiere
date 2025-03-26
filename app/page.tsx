import Image from "next/image";

export default async function Home() {
  return (
    <>
      <main className="flex align-centers gap-6 px-4 py-6">
        <Image src="/logo.jpeg" width={320} height={320} alt="Logo" priority />

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-3">Changelog</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>2025-03-24 - v0.0.1@beta live</li>
            <li>
              {
                //FIX: FINIRE QUESTI
              }
              2025-03-26 - v0.0.1@beta: aggiunta dipendenti e tecnici nella
              creazioe del cantiere--FATTO, vista cantierei da dipendenti e
              tecnici, aggiunta e rimozione cantieri e dipendenti da cantiere
              details. Upload e Lista file x Cantieri, Dipendenti, Clienti e
              Tecnici.
            </li>
          </ol>
        </div>
      </main>
    </>
  );
}
