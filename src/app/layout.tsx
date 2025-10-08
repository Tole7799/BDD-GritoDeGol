import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grito de Gol",
  description: "Pantalla de inicio de sesión del dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
