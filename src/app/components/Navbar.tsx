"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);


  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)userEmail=([^;]+)/);
    setEmail(m ? decodeURIComponent(m[1]) : null);
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("userEmail");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-emerald-200 border-b border-emerald-300">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/pag-principal" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={34} height={34} />
          <span className="text-emerald-900 font-extrabold text-lg">GRITO de GOL</span>
        </Link>
        <div className="flex items-center gap-3">
          {email && <span className="text-emerald-900 text-sm">{email}</span>}
          <button
            onClick={handleLogout}
            className="rounded-lg bg-emerald-900 px-4 py-1.5 text-white hover:bg-emerald-800"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
