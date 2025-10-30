import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { params: { equipoId: string } };

function edad(fecha: Date | null) {
  if (!fecha) return null;
  const f = new Date(fecha);
  const t = new Date();
  let e = t.getFullYear() - f.getFullYear();
  const m = t.getMonth() - f.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < f.getDate())) e--;
  return e;
}
const ordenLinea = (pos: string | null) => {
  const p = (pos ?? "").toUpperCase();
  if (p.startsWith("ARQ") || p.includes("PORT")) return 0;
  if (p.startsWith("DEF")) return 1;
  if (p.startsWith("MED") || p.includes("VOL")) return 2;
  if (p.startsWith("DEL") || p.includes("ATA")) return 3;
  return 4;
};

export default async function Page({ params }: Params) {
  const id = Number(params.equipoId);

  const equipo = await prisma.equipo.findUnique({
    where: { id_equipo: id },
    include: { liga: { include: { pais: true } } },
  });
  if (!equipo) return notFound();

  const temporada = await prisma.temporada.findFirst({
    where: { id_liga: equipo.id_liga },
    orderBy: { fecha_inicio: "desc" },
  });
  if (!temporada) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <div className="mb-4 text-sm">
          <Link href="/equipos" className="text-emerald-700 hover:underline">Países</Link> →
          <Link href={`/equipos/pais/${equipo.liga.id_pais}`} className="text-emerald-700 hover:underline"> {equipo.liga.pais.nombre}</Link> →
          <Link href={`/equipos/liga/${equipo.id_liga}`} className="text-emerald-700 hover:underline"> {equipo.liga.nombre}</Link> →
          <span> {equipo.nombre}</span>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-emerald-900">{equipo.nombre}</h1>
        <p className="text-zinc-600">Este equipo todavía no tiene temporadas cargadas.</p>
      </main>
    );
  }

  const plantel = await prisma.plantel.findMany({
    where: { id_equipo: id, id_temporada: temporada.id_temporada },
    include: { jugador: true },
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 text-sm">
        <Link href="/equipos" className="text-emerald-700 hover:underline">Países</Link> →
        <Link href={`/equipos/pais/${equipo.liga.id_pais}`} className="text-emerald-700 hover:underline"> {equipo.liga.pais.nombre}</Link> →
        <Link href={`/equipos/liga/${equipo.id_liga}`} className="text-emerald-700 hover:underline"> {equipo.liga.nombre}</Link> →
        <span> {equipo.nombre}</span>
      </div>

      <h1 className="mb-1 text-3xl font-bold text-emerald-900">{equipo.nombre}</h1>
      <p className="mb-6 text-sm text-zinc-600">
        {equipo.liga.pais.nombre} · {equipo.liga.nombre} · Temporada {temporada.nombre}
      </p>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-50 text-emerald-900">
            <tr>
              <th className="px-3 py-2 text-left">Jugador</th>
              <th className="px-3 py-2">Posición</th>
              <th className="px-3 py-2">Dorsal</th>
              <th className="px-3 py-2">Edad</th>
              <th className="px-3 py-2">Nacimiento</th>
              <th className="px-3 py-2">Alta</th>
              <th className="px-3 py-2">Baja</th>
            </tr>
          </thead>
          <tbody>
            {plantel
              .sort((a, b) => ordenLinea(a.jugador.posicion) - ordenLinea(b.jugador.posicion))
              .map(p => (
                <tr key={`${p.id_equipo}-${p.id_jugador}`} className="border-t">
                  <td className="px-3 py-2">{p.jugador.apellido}, {p.jugador.nombre}</td>
                  <td className="px-3 py-2 text-center">{p.jugador.posicion ?? "-"}</td>
                  <td className="px-3 py-2 text-center">{p.jugador.dorsal ?? "-"}</td>
                  <td className="px-3 py-2 text-center">{edad(p.jugador.fecha_nac) ?? "-"}</td>
                  <td className="px-3 py-2 text-center">
                    {p.jugador.fecha_nac ? new Date(p.jugador.fecha_nac).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {p.fecha_alta ? new Date(p.fecha_alta).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {p.fecha_baja ? new Date(p.fecha_baja).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            {plantel.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-zinc-500">
                No hay jugadores cargados para esta temporada.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
