// layout.tsx
import { ThemeProvider } from "./components/ThemeProvider";
import type { Metadata } from "next";
import {
  AbstractIntlMessages,
  NextIntlClientProvider,
  useMessages,
} from "next-intl";
import { Inter, Montserrat, Orbitron } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Header } from "./components/Header";
import "./globals.css";
import { Footer } from "../[locale]/components/Footer";
import { cookies } from "next/headers";
import Sidebar from "./components/SideBar";
import VLibrasToggleWrapper from "./components/VLibrasToggleWrapper";

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
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();

  const userLocaleCookie = cookies().get("preferredLocale")?.value;
  const languageCode = userLocaleCookie || "br";

  return (
    <html
      lang={languageCode}
      className={`${inter.variable} ${montserrat.variable} ${orbitron.variable}`}
    >
      <body className="relative min-h-screen flex flex-col">
        <VLibrasToggleWrapper />
        <ThemeProvider>
          <NextIntlClientProvider
            locale={locale}
            messages={messages as AbstractIntlMessages}
          >
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
            <Header locale={languageCode} />
            <div className="flex">
              <Sidebar />
              <main className="relative z-10 flex-grow">{children}</main>
            </div>
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
