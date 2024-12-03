"use client";
import { FaInstagram, FaFacebook, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState, FC } from "react";
import BinaryLogo from "@/src/app/icons/binaryLogo";
import { AiOutlineLinkedin } from "react-icons/ai";
import { RiFacebookCircleLine } from "react-icons/ri";

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
    <footer className="bg-[var(--footer-bg)] text-[var(--background)] relative  mt-auto w-full p-4 py-6 lg:py-8">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href={`/${locale}/`} className="flex items-center" aria-label="Página inicial">
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
                  <a href={`/${locale}/pages/about`} aria-label="Sobre nós">
                    {"Sobre nós"}
                  </a>
                </li>
                <li className="mb-4">
                  <a href={`/${locale}/pages/contact`} aria-label="Fale Conosco">
                    {"Fale Conosco"}
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
                  <a href={`/${locale}/pages/howtouse`} aria-label="Como usar a plataforma" title="Como usar a plataforma">
                    Como usar a plataforma
                  </a>
                </li>
                <li>
                  <a 
                    href={`/${locale}/pages/youtubevideo`}
                    aria-label="Vídeo de tutorial no YouTube" title="Vídeo de tutorial no YouTube">
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
                     href={`/${locale}/pages/youtubevideo?videoId=QTlIH-LTydM?si=MKSvgcaLv2tO-94p&section=Como+organizar+os+estudos`}
                    aria-label="Vídeo no YouTube de como organizar os estudos"
                  >
                    {"Como organizar os estudos"}
                  </a>
                </li>
                <li>
                  <a
                    href={`/${locale}/pages/youtubevideo?videoId=BF-6ofd0DNg?si=LmP2F7wqVBhf4BD6&section=Como+resolver+questões+do+ENEM`}
                    aria-label="Vídeo no YouTube de como resolver questões do ENEM"
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
              href="https://www.instagram.com/"
              aria-label="Instagram"
              className="me-5"
              title="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/"
              aria-label="Facebook"
              className="me-5"
              title="Facebook"
            >
              <RiFacebookCircleLine className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/35988550516"
              aria-label="WhatsApp"
              className="me-5"
              title="WhatsApp"
            >
              <FaWhatsapp className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/"
              aria-label="LinkedIn"
              className="me-5"
              title="LinkedIn"
            >
              <AiOutlineLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
