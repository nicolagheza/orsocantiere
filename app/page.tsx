import Image from "next/image";

export default async function Home() {
  return (
    <>
      <main className="flex align-centers gap-6 px-4 py-6">
        <Image src="/logo.jpeg" width={320} height={320} alt="Logo" priority />
      </main>
    </>
  );
}
