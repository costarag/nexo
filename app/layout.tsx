import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexo",
  description: "Nexo - IA para qualificacao e pitch comercial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
