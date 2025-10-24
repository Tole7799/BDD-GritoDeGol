import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const isAdmin = (email: string) => email.toLowerCase().endsWith("@admin.com");

export default async function PagPrincipal() {
  const email = (await cookies()).get("userEmail")?.value;
  if (!email) redirect("/");

  const admin = isAdmin(email);

  return (
    <main className="min-h-dvh bg-zinc-100">
      <header className="w-full bg-emerald-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Grito de Gol" width={40} height={40} />
            <span className="font-extrabold text-emerald-900">
              GRITO <span className="text-emerald-700">de</span> GOL
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-emerald-950 sm:block">{email}</span>
            <Link href="/api/logout" className="rounded-xl bg-emerald-900 px-4 py-2 text-white">Cerrar sesión</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-emerald-900">Menú principal</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Equipos */}
          <Link href="/equipos" className="block rounded-2xl bg-white p-6 shadow hover:shadow-lg transition">
            <h2 className="mb-2 text-xl font-semibold text-emerald-800">🏟️ Equipos</h2>
            <p className="text-sm text-zinc-600">Información general por equipo.</p>
          </Link>

          {/* Posiciones */}
          <Link href="/posiciones" className="block rounded-2xl bg-white p-6 shadow hover:shadow-lg transition">
            <h2 className="mb-2 text-xl font-semibold text-emerald-800">📊 Posiciones</h2>
            <p className="text-sm text-zinc-600">Tabla y métricas.</p>
          </Link>

          {/* Usuarios (solo admin) */}
          {admin && (
            <Link href="/usuarios" className="block rounded-2xl bg-white p-6 shadow hover:shadow-lg transition">
              <h2 className="mb-2 text-xl font-semibold text-emerald-800">👥 Usuarios</h2>
              <p className="text-sm text-zinc-600">Administración del sistema.</p>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
