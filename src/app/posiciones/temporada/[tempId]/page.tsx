import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

function semaforo(pj: number, pts: number) {
  const r = pj ? pts / pj : 0;
  if (r >= 2) return "bg-green-500";
  if (r >= 1) return "bg-yellow-500";
  return "bg-red-500";
}

type Stand = {
  id_equipo: number; equipo: string;
  pj: number; pg: number; pe: number; pp: number;
  gf: number; gc: number; pts: number;
};

type Params = { params: { tempId: string } };

export default async function Page({ params }: Params) {
  const tempId = Number(params.tempId);

  const temporada = await prisma.temporada.findUnique({
    where: { id_temporada: tempId },
    include: { liga: { include: { pais: true } } },
  });
  if (!temporada) return notFound();

  // --- SELECT (puede devolver Prisma.Decimal en agregados) ---
  const rowsRaw = await prisma.$queryRaw<Stand[]>`
    SELECT
      e.id_equipo, e.nombre AS equipo,
      SUM(CASE WHEN p.id_local = e.id_equipo OR p.id_visitante = e.id_equipo THEN 1 ELSE 0 END) AS pj,
      SUM(CASE WHEN (p.id_local = e.id_equipo AND p.goles_local > p.goles_visitante)
                OR (p.id_visitante = e.id_equipo AND p.goles_visitante > p.goles_local) THEN 1 ELSE 0 END) AS pg,
      SUM(CASE WHEN p.goles_local = p.goles_visitante
                AND (p.id_local = e.id_equipo OR p.id_visitante = e.id_equipo) THEN 1 ELSE 0 END) AS pe,
      SUM(CASE WHEN (p.id_local = e.id_equipo AND p.goles_local < p.goles_visitante)
                OR (p.id_visitante = e.id_equipo AND p.goles_visitante < p.goles_local) THEN 1 ELSE 0 END) AS pp,
      SUM(CASE WHEN p.id_local = e.id_equipo THEN p.goles_local
               WHEN p.id_visitante = e.id_equipo THEN p.goles_visitante ELSE 0 END) AS gf,
      SUM(CASE WHEN p.id_local = e.id_equipo THEN p.goles_visitante
               WHEN p.id_visitante = e.id_equipo THEN p.goles_local ELSE 0 END) AS gc,
      (3 * SUM(CASE WHEN (p.id_local = e.id_equipo AND p.goles_local > p.goles_visitante)
                    OR (p.id_visitante = e.id_equipo AND p.goles_visitante > p.goles_local) THEN 1 ELSE 0 END)
        + SUM(CASE WHEN p.goles_local = p.goles_visitante
                    AND (p.id_local = e.id_equipo OR p.id_visitante = e.id_equipo) THEN 1 ELSE 0 END)
      ) AS pts
    FROM Equipo e
    JOIN Partido p  ON p.id_local = e.id_equipo OR p.id_visitante = e.id_equipo
    JOIN Fecha   f  ON f.id_fecha = p.id_fecha
    WHERE f.id_temporada = ${tempId}
    GROUP BY e.id_equipo, e.nombre
    ORDER BY pts DESC, (gf-gc) DESC, e.nombre ASC;
  `;

  // --- Normalización: convertir Decimal/BigInt -> number ---
  const rows = rowsRaw.map((r: any) => ({
    ...r,
    pj:  Number(r.pj),
    pg:  Number(r.pg),
    pe:  Number(r.pe),
    pp:  Number(r.pp),
    gf:  Number(r.gf),
    gc:  Number(r.gc),
    pts: Number(r.pts),
  })) as Stand[];

  return (
    <main className="min-h-dvh bg-zinc-100 p-6 mx-auto max-w-5xl">
      <div className="mb-4 text-sm text-zinc-600">
        <Link className="text-emerald-700 hover:underline" href="/posiciones">Países</Link> →
        <Link className="text-emerald-700 hover:underline" href={`/posiciones/pais/${temporada.liga.id_pais}`}> {temporada.liga.pais.nombre}</Link> →
        <Link className="text-emerald-700 hover:underline" href={`/posiciones/liga/${temporada.id_liga}`}> {temporada.liga.nombre}</Link> →
        <span> {temporada.nombre}</span>
      </div>

      <h1 className="mb-6 text-3xl font-bold text-emerald-900">
        Tabla de posiciones · {temporada.liga.nombre} · {temporada.nombre}
      </h1>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-50 text-emerald-900">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Equipo</th>
              <th className="px-3 py-2">PJ</th><th className="px-3 py-2">PG</th>
              <th className="px-3 py-2">PE</th><th className="px-3 py-2">PP</th>
              <th className="px-3 py-2">GF</th><th className="px-3 py-2">GC</th>
              <th className="px-3 py-2">Pts</th><th className="px-3 py-2">Semáforo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id_equipo} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{r.equipo}</td>
                <td className="px-3 py-2 text-center">{r.pj}</td>
                <td className="px-3 py-2 text-center">{r.pg}</td>
                <td className="px-3 py-2 text-center">{r.pe}</td>
                <td className="px-3 py-2 text-center">{r.pp}</td>
                <td className="px-3 py-2 text-center">{r.gf}</td>
                <td className="px-3 py-2 text-center">{r.gc}</td>
                <td className="px-3 py-2 text-center font-semibold">{r.pts}</td>
                <td className="px-3 py-2">
                  <span className={`inline-block h-3 w-3 rounded-full ${semaforo(r.pj, r.pts)}`} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={10} className="px-3 py-6 text-center text-zinc-500">Aún no hay partidos en esta temporada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
