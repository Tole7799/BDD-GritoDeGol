import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Params = { params: { paisId: string } };

export default async function Page({ params }: Params) {
  const paisId = Number(params.paisId);
  const pais = await prisma.pais.findUnique({ where: { id_pais: paisId } });
  if (!pais) return notFound();

  const ligas = await prisma.liga.findMany({
    where: { id_pais: paisId },
    orderBy: { nombre: "asc" },
  });

  return (
    <main className="min-h-dvh bg-zinc-100 p-6 mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">
        País: {pais.nombre}
      </h1>
      <h2 className="mb-4 text-lg text-emerald-800">Selecciona liga</h2>

      <ul className="grid gap-3">
        {ligas.map(l => (
          <li key={l.id_liga}>
            <Link className="block rounded-xl bg-white p-4 shadow hover:shadow-md transition"
                  href={`/posiciones/liga/${l.id_liga}`}>
              {l.nombre}
            </Link>
          </li>
        ))}
        {ligas.length === 0 && <p className="text-sm text-zinc-600">No hay ligas.</p>}
      </ul>
    </main>
  );
}
