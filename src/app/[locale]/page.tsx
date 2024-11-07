"use client";
import { useTranslations } from "next-intl";
import Button from "./components/Button";
import LogoIcon from "../icons/logo";
import LottieStudy from "./components/LottieStudy";
import Sponsors from "./components/Sponsors";
import { useEffect, useState } from "react";
import FAQ from "./components/FAQ";
import { FaInstagram, FaFacebook, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function DashboardPage() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallScreen(width <= 1200);
      setIsMobile(width <= 880);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sponsorsData = [
    { logoUrl: "/images/icmc-logo.png" },
    { logoUrl: "/images/brains.png" },
    { logoUrl: "/images/centerIA.png" },
  ];

  const t = useTranslations("");

  const faqData = [
    {
      question: "Como o MeGuie funciona?",
      answer:
        "O MeGuie organiza conteúdos gratuitos e de qualidade encontrados na internet em um formato de roadmap.",
    },
    {
      question: "Preciso pagar para usar o MeGuie?",
      answer: "Não sei",
    },
    {
      question:
        "Qual é a diferença entre o MeGuie e outros métodos de estudo online?",
      answer: "Não sei",
    },
  ];

  return (
    <div className="mt-32">
      <section
        className={`flex ${isSmallScreen ? "flex-col-reverse" : "flex-row"} relative py-0`}
      >
        <div
          className={`flex flex-col items-center ${isSmallScreen ? "text-center" : "md:flex-row text-left"} space-x-0 md:space-x-4`}
        >
          <div>
            <h1 className="">Me Guie</h1>
            <p className="leading-loose text-base md:text-lg">
              Uma solução inovadora que organiza e estrutura o seu estudo com
              base em roadmaps pensados para as matérias do ensino médio e
              fundamental. Com uma seleção cuidadosa de conteúdos de qualidade,
              oferecemos um guia claro e prático para você seguir, economizando
              tempo e potencializando os seus resultados no caminho da
              aprovação.
            </p>
            <br />
            <Button variant="secondary" size="medium" pageLink="/pages/about">
              Começar
            </Button>
            &nbsp; &nbsp;
            <Button variant="secondary" size="medium" pageLink="/pages/about">
              Entrar
            </Button>
          </div>
        </div>
        <div
          className={`flex justify-center -mt-[100px] -mb-[50px] ${isSmallScreen ? "" : "md:-mt-30 ml-44"} float-animation`}
        >
          <LottieStudy
            height={isSmallScreen ? 250 : 500}
            width={isSmallScreen ? 250 : 500}
          />
        </div>
      </section>
      <br />
      <h2 className="text-center">Sobre o Projeto</h2>
      <br />
      <p className="text-center">
        O MeGuie é uma plataforma que oferece Roadmaps completos para estudantes
        do ensino fundamental e médio, criando um caminho claro e eficiente para
        quem deseja se preparar para o vestibular de forma gratuita. Nosso
        objetivo é democratizar o acesso ao conhecimento de qualidade disponível
        na internet e ajudar cada aluno a alcançar seu potencial máximo.Sabemos
        que há uma infinidade de conteúdos educativos gratuitos e de alta
        qualidade online, mas a falta de uma organização estruturada muitas
        vezes impede os estudantes de aproveitarem esses recursos ao máximo. O
        MeGuie resolve esse problema ao indexar e organizar esses conteúdos,
        criando uma jornada de aprendizado com um passo a passo em cada matéria,
        para que você possa estudar com mais foco e direção.
      </p>
      <br />

      <h2 className="text-center">Perguntas Frequentes</h2>
      <FAQ data={faqData} />

      
      <h2 className="text-center">Fale Conosco</h2>
      <br />
      <p className="text-center">
        Ficou com alguma dúvida não respondida ou tem alguma sugestão?
        <br />
        Entre em contato conosco nas redes sociais!
      </p>
      <div className="flex justify-center space-x-6 mt-4">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={isMobile ? 30 : 40} className="hover:text-gray-700 transition duration-300" />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook size={isMobile ? 30 : 40} className="hover:text-gray-700 transition duration-300" />
        </a>
        <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp size={isMobile ? 30 : 40} className="hover:text-gray-700 transition duration-300" />
        </a>
        <a href="mailto:contato@meguie.com" target="_blank" rel="noopener noreferrer">
          <FaEnvelope size={isMobile ? 30 : 40} className="hover:text-gray-700 transition duration-300" />
        </a>
      </div>
    </div>
  );
}
