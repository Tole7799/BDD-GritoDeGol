import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const b64 = (s: string) => Buffer.from(s, "utf-8").toString("base64");

async function crearPartido({
  id_fecha,
  local,
  visitante,
  goles_local,
  goles_visitante,
  estadio,
}: {
  id_fecha: number;
  local: { id_equipo: number; posesion?: string; tiros?: number; tiros_arco?: number; amarillas?: number; rojas?: number };
  visitante: { id_equipo: number; posesion?: string; tiros?: number; tiros_arco?: number; amarillas?: number; rojas?: number };
  goles_local: number;
  goles_visitante: number;
  estadio: string;
}) {
  const partido = await prisma.partido.create({
    data: {
      id_fecha,
      id_local: local.id_equipo,
      id_visitante: visitante.id_equipo,
      goles_local,
      goles_visitante,
      estadio,
    },
  });

  await prisma.partidoEquipo.createMany({
    data: [
      {
        id_partido: partido.id_partido,
        id_equipo: local.id_equipo,
        es_local: true,
        posesion: local.posesion ?? "50.00",
        tiros: local.tiros ?? 10,
        tiros_arco: local.tiros_arco ?? 5,
        amarillas: local.amarillas ?? 1,
        rojas: local.rojas ?? 0,
      },
      {
        id_partido: partido.id_partido,
        id_equipo: visitante.id_equipo,
        es_local: false,
        posesion: visitante.posesion ?? "50.00",
        tiros: visitante.tiros ?? 10,
        tiros_arco: visitante.tiros_arco ?? 5,
        amarillas: visitante.amarillas ?? 1,
        rojas: visitante.rojas ?? 0,
      },
    ],
  });
}

async function main() {
  // limpia en orden por FKs
  await prisma.partidoEquipo.deleteMany();
  await prisma.plantel.deleteMany();
  await prisma.partido.deleteMany();
  await prisma.fecha.deleteMany();
  await prisma.temporada.deleteMany();
  await prisma.equipo.deleteMany();
  await prisma.liga.deleteMany();
  await prisma.pais.deleteMany();
  await prisma.user.deleteMany();

  // Países y ligas
  const ar = await prisma.pais.create({ data: { nombre: "Argentina" } });
  const uk = await prisma.pais.create({ data: { nombre: "Inglaterra" } });

  const lpa = await prisma.liga.create({ data: { id_pais: ar.id_pais, nombre: "Liga Profesional" } });
  const epl = await prisma.liga.create({ data: { id_pais: uk.id_pais, nombre: "Premier League" } });

  // Equipos
  const equiposAR = await prisma.equipo.createMany({
    data: [
      { id_liga: lpa.id_liga, nombre: "Boca Juniors", ciudad: "Buenos Aires" },
      { id_liga: lpa.id_liga, nombre: "River Plate", ciudad: "Buenos Aires" },
      { id_liga: lpa.id_liga, nombre: "Rosario Central", ciudad: "Rosario" },
      { id_liga: lpa.id_liga, nombre: "San Lorenzo", ciudad: "Buenos Aires" },
      { id_liga: lpa.id_liga, nombre: "Racing", ciudad: "Avellaneda" },
    ],
  });
  const equiposEPL = await prisma.equipo.createMany({
    data: [
      { id_liga: epl.id_liga, nombre: "Manchester United", ciudad: "Manchester" },
      { id_liga: epl.id_liga, nombre: "Liverpool", ciudad: "Liverpool" },
      { id_liga: epl.id_liga, nombre: "Manchester City", ciudad: "Manchester" },
      { id_liga: epl.id_liga, nombre: "Chelsea", ciudad: "London" },
      { id_liga: epl.id_liga, nombre: "Arsenal", ciudad: "London" },
    ],
  });

  // Recuperar IDs con findMany
  const arTeams = await prisma.equipo.findMany({ where: { id_liga: lpa.id_liga } });
  const eplTeams = await prisma.equipo.findMany({ where: { id_liga: epl.id_liga } });

  // Temporadas y fechas
  const tempAR = await prisma.temporada.create({
    data: { id_liga: lpa.id_liga, nombre: "2024", fecha_inicio: new Date("2024-01-15"), fecha_fin: new Date("2024-12-10") },
  });
  const tempEPL = await prisma.temporada.create({
    data: { id_liga: epl.id_liga, nombre: "2024", fecha_inicio: new Date("2024-08-15"), fecha_fin: new Date("2025-05-20") },
  });

  const fechasAR = await Promise.all(
    [1, 2, 3, 4, 5].map((n) => prisma.fecha.create({ data: { id_temporada: tempAR.id_temporada, numero_fecha: n } }))
  );
  const fechasEPL = await Promise.all(
    [1, 2, 3, 4, 5].map((n) => prisma.fecha.create({ data: { id_temporada: tempEPL.id_temporada, numero_fecha: n } }))
  );

  // Helper para elegir equipo por nombre rápido
  const get = (list: any[], nombre: string) => list.find((e) => e.nombre === nombre)!;

  // --- LIGA PROFESIONAL ARG ---
  await crearPartido({ id_fecha: fechasAR[0].id_fecha, local: get(arTeams, "Boca Juniors"), visitante: get(arTeams, "River Plate"), goles_local: 2, goles_visitante: 1, estadio: "La Bombonera" });
  await crearPartido({ id_fecha: fechasAR[0].id_fecha, local: get(arTeams, "Racing"), visitante: get(arTeams, "Rosario Central"), goles_local: 1, goles_visitante: 0, estadio: "Cilindro" });
  await crearPartido({ id_fecha: fechasAR[1].id_fecha, local: get(arTeams, "San Lorenzo"), visitante: get(arTeams, "Boca Juniors"), goles_local: 0, goles_visitante: 1, estadio: "NGC" });
  await crearPartido({ id_fecha: fechasAR[1].id_fecha, local: get(arTeams, "River Plate"), visitante: get(arTeams, "Racing"), goles_local: 3, goles_visitante: 3, estadio: "Monumental" });
  await crearPartido({ id_fecha: fechasAR[2].id_fecha, local: get(arTeams, "Rosario Central"), visitante: get(arTeams, "San Lorenzo"), goles_local: 1, goles_visitante: 1, estadio: "Arroyito" });
  await crearPartido({ id_fecha: fechasAR[2].id_fecha, local: get(arTeams, "Boca Juniors"), visitante: get(arTeams, "Racing"), goles_local: 0, goles_visitante: 2, estadio: "La Bombonera" });
  await crearPartido({ id_fecha: fechasAR[3].id_fecha, local: get(arTeams, "River Plate"), visitante: get(arTeams, "Rosario Central"), goles_local: 2, goles_visitante: 0, estadio: "Monumental" });
  await crearPartido({ id_fecha: fechasAR[3].id_fecha, local: get(arTeams, "San Lorenzo"), visitante: get(arTeams, "Racing"), goles_local: 1, goles_visitante: 0, estadio: "NGC" });
  await crearPartido({ id_fecha: fechasAR[4].id_fecha, local: get(arTeams, "Boca Juniors"), visitante: get(arTeams, "Rosario Central"), goles_local: 1, goles_visitante: 1, estadio: "La Bombonera" });
  await crearPartido({ id_fecha: fechasAR[4].id_fecha, local: get(arTeams, "River Plate"), visitante: get(arTeams, "San Lorenzo"), goles_local: 0, goles_visitante: 2, estadio: "Monumental" });

  // --- PREMIER LEAGUE ---
  await crearPartido({ id_fecha: fechasEPL[0].id_fecha, local: get(eplTeams, "Manchester City"), visitante: get(eplTeams, "Manchester United"), goles_local: 2, goles_visitante: 0, estadio: "Etihad" });
  await crearPartido({ id_fecha: fechasEPL[0].id_fecha, local: get(eplTeams, "Arsenal"), visitante: get(eplTeams, "Chelsea"), goles_local: 1, goles_visitante: 1, estadio: "Emirates" });
  await crearPartido({ id_fecha: fechasEPL[1].id_fecha, local: get(eplTeams, "Liverpool"), visitante: get(eplTeams, "Manchester City"), goles_local: 3, goles_visitante: 1, estadio: "Anfield" });
  await crearPartido({ id_fecha: fechasEPL[1].id_fecha, local: get(eplTeams, "Chelsea"), visitante: get(eplTeams, "Manchester United"), goles_local: 2, goles_visitante: 2, estadio: "Stamford Bridge" });
  await crearPartido({ id_fecha: fechasEPL[2].id_fecha, local: get(eplTeams, "Arsenal"), visitante: get(eplTeams, "Liverpool"), goles_local: 0, goles_visitante: 1, estadio: "Emirates" });
  await crearPartido({ id_fecha: fechasEPL[2].id_fecha, local: get(eplTeams, "Manchester United"), visitante: get(eplTeams, "Chelsea"), goles_local: 2, goles_visitante: 1, estadio: "Old Trafford" });
  await crearPartido({ id_fecha: fechasEPL[3].id_fecha, local: get(eplTeams, "Manchester City"), visitante: get(eplTeams, "Arsenal"), goles_local: 3, goles_visitante: 3, estadio: "Etihad" });
  await crearPartido({ id_fecha: fechasEPL[3].id_fecha, local: get(eplTeams, "Liverpool"), visitante: get(eplTeams, "Chelsea"), goles_local: 2, goles_visitante: 2, estadio: "Anfield" });
  await crearPartido({ id_fecha: fechasEPL[4].id_fecha, local: get(eplTeams, "Arsenal"), visitante: get(eplTeams, "Manchester United"), goles_local: 1, goles_visitante: 0, estadio: "Emirates" });
  await crearPartido({ id_fecha: fechasEPL[4].id_fecha, local: get(eplTeams, "Manchester City"), visitante: get(eplTeams, "Liverpool"), goles_local: 2, goles_visitante: 3, estadio: "Etihad" });

  // Usuarios
  await prisma.user.createMany({
    data: [
      { email: "admin@admin.com", password: b64("admin123"), role: "admin", name: "Administrador" },
      { email: "usuario@gmail.com", password: b64("user123"), role: "user", name: "Usuario" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed cargado: cada equipo con 5 partidos en LPA y EPL.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
