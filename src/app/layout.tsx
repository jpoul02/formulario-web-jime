import type { Metadata } from "next";
import { Press_Start_2P, VT323, Nunito, Caveat } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });
const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-vt" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = { title: "Feliz Cumple Jime ❄" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${pressStart2P.variable} ${vt323.variable} ${nunito.variable} ${caveat.variable} font-nunito`}>
        {children}
      </body>
    </html>
  );
}
