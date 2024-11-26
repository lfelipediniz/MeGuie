"use client";
import { FaInstagram, FaFacebook, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState, FC } from "react";
import BinaryLogo from "@/src/app/icons/binaryLogo";

interface Props {
  locale: string;
}

export const Footer: FC<Props> = ({ locale }) => {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/simpleDATAICON.png");

  const t = useTranslations("");

  useEffect(() => {
    const updatedLogoSrc =
      resolvedTheme === "light"
        ? "/simpleDATAICON-white.png"
        : "/simpleDATAICON.png";
    setLogoSrc(updatedLogoSrc);
  }, [resolvedTheme]);

  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--background)] relative z-20 mt-auto w-full p-4 py-6 lg:py-8">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href={`/${locale}/`} className="flex items-center">
              <BinaryLogo width={35} height={35} /> &nbsp;
              <span className="self-center text-2xl font-semibold whitespace-nowrap">
                MeGuie
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-[var(--background)]">
                {t("Footer.Resources")}
              </h2>
              <ul className="font-medium text-[var(--background)]">
                <li className="mb-4">
                  <a href={`/${locale}/pages/about`} aria-label={t("Footer.AboutUs")}>
                    {t("Footer.AboutUs")}
                  </a>
                </li>
                <li className="mb-4">
                  <a href={`/${locale}/pages/fronts`} aria-label={"Fale Conosco"}>
                    {"Fale Cosnosco"}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-[var(--background)]">
                {"GUIA DO MEGUIE"}
              </h2>
              <ul className="font-medium text-[var(--background)]">
                <li className="mb-4">
                  <a href="https://www.linkedin.com/school/meguie/" aria-label="LinkedIn" title="LinkedIn">
                    Como usar a plataforma
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/data.icmc/" aria-label="Instagram" title="Instagram">
                    Tutorial em vídeo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-[var(--background)]">
                {"DICAS DE ESTUDOS"}
              </h2>
              <ul className="font-medium text-[var(--background)]">
                <li className="mb-4">
                  <a
                    href={`/${locale}/pages/events/understandingDL`}
                    aria-label={t("Footer.Events")}
                  >
                    {"Como organizar os estudos"}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=LxP-r00E2fo&list=PLFE-LjWAAP9Skog9YhRvuNBjWD724c32m"
                    aria-label={t("Footer.Courses")}
                  >
                    {"Guia de como resolver questões do ENEM"}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-[var(--footer-border-color)] sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm sm:text-center text-[var(--background)]">
            © 2024{" "}
            <a href={`/${locale}/`} aria-label="Home">
              MeGuie
            </a>
            . {t("Footer.AllRightsReserved")}
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <a
              href="https://www.youtube.com/c/DataICMC"
              aria-label="YouTube"
              className="me-5"
              title="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/data.icmc/"
              aria-label="Instagram"
              className="me-5"
              title="Facebook"
            >
              <FaFacebook className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/1234567890"
              aria-label="WhatsApp"
              className="me-5"
              title="WhatsApp"
            >
              <FaWhatsapp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
