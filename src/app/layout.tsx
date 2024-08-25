import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Poppins } from 'next/font/google';
import "./globals.css";
import 'animate.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
 
const inter = Inter({ subsets: ["latin"] });

// Cargar la fuente "Poppins"
const poppins = Poppins({
  //weight: ['400', '700'], // Puedes especificar los pesos que necesitas
  weight: ['500'], // Puedes especificar los pesos que necesitas
  subsets: ['latin'], // Subconjunto que necesitas (generalmente 'latin')
});

export const metadata: Metadata = {
  title: "Frases",
  description: "Frases inspiradoras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}<SpeedInsights /></body>
    </html>
  );
}
