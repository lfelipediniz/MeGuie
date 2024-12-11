"use client";
import { FaInstagram, FaFacebook, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useEffect, useState, FC, JSX } from "react";
import BinaryLogo from "@/src/app/icons/binaryLogo";
import { AiOutlineLinkedin } from "react-icons/ai";
import { RiFacebookCircleLine } from "react-icons/ri";



export const Footer: FC = () => {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/simpleDATAICON.png");



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
            <a href={`/`} className="flex items-center" aria-label="Página inicial">
              <BinaryLogo width={35} height={35} /> &nbsp;
              <span className="self-center text-2xl font-semibold whitespace-nowrap">
                MeGuie
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-[var(--background)]">
                {"Recursos"}
              </h2>
              <ul className="font-medium text-[var(--background)]">
                <li className="mb-4">
                  <a href={`/pages/about`} aria-label="Sobre nós">
                    {"Sobre nós"}
                  </a>
                </li>
                <li className="mb-4">
                  <a href={`/pages/contact`} aria-label="Fale Conosco">
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
                  <a href={`/pages/howtouse`} aria-label="Como usar a plataforma" title="Como usar a plataforma">
                    Como usar a plataforma
                  </a>
                </li>
                <li>
                  <a 
                    href={`https://www.youtube.com/watch?v=l1THA3vg5UQ`}
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
                     href={`https://www.youtube.com/watch?v=ANctp8kBVzY`}
                    aria-label="Vídeo no YouTube de como organizar os estudos"
                  >
                    {"Como organizar os estudos"}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://www.youtube.com/watch?v=XwvAehZAEPQ`}
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
            <a href={`/`} aria-label="Home">
              MeGuie
            </a>
            . {"Todos os direitos reservados."}
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
