import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function toB64(s: string) {
  return Buffer.from(s, "utf-8").toString("base64");
}

async function main() {
  await prisma.user.deleteMany(); // limpia la tabla (solo para test)

  await prisma.user.createMany({
    data: [
      {
        email: "admin@admin.com",
        password: toB64("admin123"),
        name: "Administrador",
      },
      {
        email: "usuario@gmail.com",
        password: toB64("user123"),
        name: "Usuario Normal",
      },
    ],
  });

  console.log("✅ Usuarios creados correctamente");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
