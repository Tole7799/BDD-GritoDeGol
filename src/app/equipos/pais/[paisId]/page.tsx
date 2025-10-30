import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { params: { paisId: string } };

export default async function Page({ params }: Params) {
  const id = Number(params.paisId);

  const pais = await prisma.pais.findUnique({
    where: { id_pais: id },
    include: { ligas: { orderBy: { nombre: "asc" } } }, // ← OJO: ligas (plural)
  });

  if (!pais) return notFound();

  // Para evitar 'implicit any' en el map
  const ligas = pais.ligas as Array<{ id_liga: number; nombre: string }>;

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-4 text-sm">
        <Link href="/equipos" className="text-emerald-700 hover:underline">Países</Link> →
        <span> {pais.nombre}</span>
      </div>

      <h1 className="mb-6 text-3xl font-bold text-emerald-900">Ligas · {pais.nombre}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {ligas.map((l) => (
          <Link
            key={l.id_liga}
            href={`/equipos/liga/${l.id_liga}`}
            className="rounded-xl bg-white shadow px-4 py-3 hover:bg-emerald-50 border border-emerald-100"
          >
            {l.nombre}
          </Link>
        ))}
        {ligas.length === 0 && <p className="text-zinc-500">No hay ligas para este país.</p>}
      </div>
    </main>
  );
}
