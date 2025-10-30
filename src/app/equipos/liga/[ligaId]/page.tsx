// src/app/equipos/liga/[ligaId]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: { ligaId: string };
};

export default async function Page({ params }: PageProps) {
  const id = Number(params.ligaId);
  if (Number.isNaN(id)) return notFound();

  const liga = await prisma.liga.findUnique({
    where: { id_liga: id },
    include: { pais: true },
  });
  if (!liga) return notFound();

  const equipos = await prisma.equipo.findMany({
    where: { id_liga: id },
    orderBy: { nombre: "asc" },
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-4 text-sm">
        <Link href="/equipos" className="text-emerald-700 hover:underline">Países</Link> →
        <Link href={`/equipos/pais/${liga.id_pais}`} className="text-emerald-700 hover:underline">
          {" "}{liga.pais.nombre}
        </Link> →
        <span> {liga.nombre}</span>
      </div>

      <h1 className="mb-6 text-3xl font-bold text-emerald-900">Equipos · {liga.nombre}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {equipos.map((eq) => (
          <Link
            key={eq.id_equipo}
            href={`/equipos/equipo/${eq.id_equipo}`}
            className="rounded-xl bg-white shadow px-4 py-3 hover:bg-emerald-50 border border-emerald-100"
          >
            {eq.nombre}
            <span className="block text-xs text-zinc-500">{eq.ciudad}</span>
          </Link>
        ))}
        {equipos.length === 0 && (
          <p className="text-zinc-500">No hay equipos en esta liga.</p>
        )}
      </div>
    </main>
  );
}
