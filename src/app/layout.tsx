import "./globals.css";
import LayoutClient from "./LayoutClient";

export const metadata = {
  title: "Grito de Gol",
  description: "Sistema de gestión de ligas de fútbol",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-zinc-100">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
