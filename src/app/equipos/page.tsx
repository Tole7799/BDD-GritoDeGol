import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const paises = await prisma.pais.findMany({ orderBy: { nombre: "asc" } });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-emerald-900">Equipos · Selecciona país</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {paises.map(p => (
          <Link key={p.id_pais}
                href={`/equipos/pais/${p.id_pais}`}
                className="rounded-xl bg-white shadow px-4 py-3 hover:bg-emerald-50 border border-emerald-100">
            {p.nombre}
          </Link>
        ))}
      </div>
    </main>
  );
}
