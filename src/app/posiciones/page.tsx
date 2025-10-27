import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const paises = await prisma.pais.findMany({ orderBy: { nombre: "asc" } });

  return (
    <main className="min-h-dvh bg-zinc-100 p-6 mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold text-emerald-900">Selecciona país</h1>
      <ul className="grid gap-3">
        {paises.map(p => (
          <li key={p.id_pais}>
            <Link
              className="block rounded-xl bg-white p-4 shadow hover:shadow-md transition"
              href={`/posiciones/pais/${p.id_pais}`}
            >
              {p.nombre}
            </Link>
          </li>
        ))}
        {paises.length === 0 && <p className="text-sm text-zinc-600">No hay países.</p>}
      </ul>
    </main>
  );
}
