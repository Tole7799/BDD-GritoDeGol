import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const isAdmin = (email: string) => email.toLowerCase().endsWith("@admin.com");

export default async function Page() {
  const email = (await cookies()).get("userEmail")?.value;
  if (!email) redirect("/");
  if (!isAdmin(email)) redirect("/");

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
    orderBy: { id: "asc" },
  });

  return (
    <main className="min-h-dvh bg-zinc-100">
      <section className="mx-auto max-w-5xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-emerald-900">Usuarios</h1>
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-2">{u.id}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.name ?? "-"}</td>
                  <td className="px-4 py-2">
                    {isAdmin(u.email) ? "Administrador" : "Usuario"}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                    Sin usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
