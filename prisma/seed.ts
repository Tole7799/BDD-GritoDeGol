import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Hasheo Base64
function toB64(s: string) {
  return Buffer.from(s, "utf-8").toString("base64");
}

async function main() {
  const email = "admin@demo.com";
  const plain = "admin123"; 
  const hashed = toB64(plain);

  // Evita duplicados si ya corriste antes
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashed,
      name: "Administrador",
    },
  });

  console.log("✔ Usuario de prueba creado:", { email, password: plain });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
