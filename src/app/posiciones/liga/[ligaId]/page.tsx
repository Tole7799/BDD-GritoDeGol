import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Params = { params: { ligaId: string } };

export default async function Page({ params }: Params) {
  const ligaId = Number(params.ligaId);
  const liga = await prisma.liga.findUnique({ where: { id_liga: ligaId } });
  if (!liga) return notFound();

  const temporadas = await prisma.temporada.findMany({
    where: { id_liga: ligaId },
    orderBy: { fecha_inicio: "desc" },
  });

  return (
    <main className="min-h-dvh bg-zinc-100 p-6 mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-emerald-900">
        Liga: {liga.nombre}
      </h1>
      <h2 className="mb-4 text-lg text-emerald-800">Selecciona temporada</h2>

      <ul className="grid gap-3">
        {temporadas.map(t => (
          <li key={t.id_temporada}>
            <Link className="block rounded-xl bg-white p-4 shadow hover:shadow-md transition"
                  href={`/posiciones/temporada/${t.id_temporada}`}>
              {t.nombre} ({t.fecha_inicio.toISOString().slice(0,10)} → {t.fecha_fin.toISOString().slice(0,10)})
            </Link>
          </li>
        ))}
        {temporadas.length === 0 && <p className="text-sm text-zinc-600">No hay temporadas.</p>}
      </ul>
    </main>
  );
}
