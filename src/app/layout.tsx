// src/app/layout.tsx
import { ThemeProvider } from "@/src/app/components/ThemeProvider";
import type { Metadata } from "next";
import { Inter, Montserrat, Orbitron } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import Header from "@/src/app/components/Header";
import "./globals.css";
import { Footer } from "@/src/app/components/Footer";
import Sidebar from "@/src/app/components/SideBar";
import VLibrasToggleWrapper from "@/src/app/components/VLibrasToggleWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--inter",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "MeGuie",
  description:
    "Grupo de Extensão em Ciência de Dados e Inteligência Artificial da Universidade de São Paulo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const languageCode = "pt-BR"; // Define a default language code

  return (
    <html
      lang={languageCode}
      className={`${inter.variable} ${montserrat.variable} ${orbitron.variable}`}
    >
      <body className="relative min-h-screen flex flex-col">
        <VLibrasToggleWrapper />
        <ThemeProvider>
          <NextTopLoader
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            easing="ease"
            speed={200}
            color="var(--primary)"
            showSpinner={false}
          />
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="relative z-10 flex-grow">{children}</main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
