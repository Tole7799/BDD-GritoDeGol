// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const b64 = (s: string) => Buffer.from(s, "utf-8").toString("base64");

async function main() {
  // limpiar en orden por FKs
  await prisma.partidoEquipo.deleteMany();
  await prisma.plantel.deleteMany();
  await prisma.partido.deleteMany();
  await prisma.fecha.deleteMany();
  await prisma.temporada.deleteMany();
  await prisma.equipo.deleteMany();
  await prisma.liga.deleteMany();
  await prisma.pais.deleteMany();
  await prisma.user.deleteMany();

  const pais = await prisma.pais.create({ data: { nombre: "Argentina" } });

  const liga = await prisma.liga.create({
    data: { id_pais: pais.id_pais, nombre: "Liga Profesional" },
  });

  const boca = await prisma.equipo.create({
    data: { id_liga: liga.id_liga, nombre: "Boca Juniors", ciudad: "Buenos Aires" },
  });
  const river = await prisma.equipo.create({
    data: { id_liga: liga.id_liga, nombre: "River Plate", ciudad: "Buenos Aires" },
  });

  const temporada = await prisma.temporada.create({
    data: {
      id_liga: liga.id_liga,
      nombre: "2024",
      fecha_inicio: new Date("2024-01-26"),
      fecha_fin: new Date("2024-12-15"),
    },
  });

  const fecha1 = await prisma.fecha.create({
    data: { id_temporada: temporada.id_temporada, numero_fecha: 1 },
  });

  // jugadores
  const jB1 = await prisma.jugador.create({
    data: { nombre: "Edinson", apellido: "Cavani", posicion: "Delantero", fecha_nac: new Date("1987-02-14"), dorsal: 10 },
  });
  const jB2 = await prisma.jugador.create({
    data: { nombre: "Kevin", apellido: "Zenón", posicion: "Mediocampista", fecha_nac: new Date("2001-03-30"), dorsal: 22 },
  });
  const jR1 = await prisma.jugador.create({
    data: { nombre: "Miguel", apellido: "Borja", posicion: "Delantero", fecha_nac: new Date("1993-01-26"), dorsal: 9 },
  });
  const jR2 = await prisma.jugador.create({
    data: { nombre: "Ignacio", apellido: "Fernández", posicion: "Mediocampista", fecha_nac: new Date("1990-01-12"), dorsal: 10 },
  });

  await prisma.plantel.createMany({
    data: [
      { id_equipo: boca.id_equipo, id_jugador: jB1.id_jugador, id_temporada: temporada.id_temporada, fecha_alta: new Date("2024-01-01") },
      { id_equipo: boca.id_equipo, id_jugador: jB2.id_jugador, id_temporada: temporada.id_temporada, fecha_alta: new Date("2024-01-01") },
      { id_equipo: river.id_equipo, id_jugador: jR1.id_jugador, id_temporada: temporada.id_temporada, fecha_alta: new Date("2024-01-01") },
      { id_equipo: river.id_equipo, id_jugador: jR2.id_jugador, id_temporada: temporada.id_temporada, fecha_alta: new Date("2024-01-01") },
    ],
  });

  const partido1 = await prisma.partido.create({
    data: {
      id_fecha: fecha1.id_fecha,
      id_local: boca.id_equipo,
      id_visitante: river.id_equipo,
      goles_local: 2,
      goles_visitante: 1,
      estadio: "La Bombonera",
    },
  });

  // 👇 Pases posesion como string para Decimal(5,2)
  await prisma.partidoEquipo.createMany({
    data: [
      {
        id_partido: partido1.id_partido,
        id_equipo: boca.id_equipo,
        es_local: true,
        posesion: "54.30",
        tiros: 12,
        tiros_arco: 6,
        amarillas: 2,
        rojas: 0,
      },
      {
        id_partido: partido1.id_partido,
        id_equipo: river.id_equipo,
        es_local: false,
        posesion: "45.70",
        tiros: 9,
        tiros_arco: 3,
        amarillas: 3,
        rojas: 0,
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      { email: "admin@admin.com", password: b64("admin123"), role: "admin", name: "Administrador" },
      { email: "usuario@gmail.com", password: b64("user123"), role: "user", name: "Usuario" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed cargado con éxito");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
