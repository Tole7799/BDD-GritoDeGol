"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Credenciales inválidas");
        return;
      }

      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
      } else {
        setError("Credenciales inválidas");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center px-4">
      <section className="w-full max-w-[420px] rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 md:p-8">
        {/* Logo */}
        <div className="mx-auto mb-6 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo Liga de Deportes"
            width={80}
            height={80}
            className="rounded-full"
            priority
          />
        </div>

        <h1 className="text-center text-2xl font-semibold text-gray-900">
          Iniciar sesión
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email" name="email" type="email" autoComplete="email" required
              placeholder="tucorreo@gmail.com"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password" name="password" type="password" autoComplete="current-password" required
              placeholder="●●●●●●●●"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/20"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-white font-medium transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30 disabled:opacity-60 disabled:cursor-not-allowed shadow"
          >
            {submitting ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          Grito de Gol · Copyright 2025
        </p>
      </section>
    </main>
  );
}
