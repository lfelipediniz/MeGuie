"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import LogoIcon from "../icons/logo";
import LottieStudy from "./components/LottieStudy";
import Sponsors from "./components/Sponsors";
import FAQ from "./components/FAQ";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import Home from "./pages/home/page";
import LoadingOverlay from "../[locale]/components/LoadingOverlay"; // Supondo que você tenha um componente de carregamento
=======
import { MdOutlineEmail } from "react-icons/md";
import { RiFacebookCircleLine } from "react-icons/ri";
>>>>>>> refs/remotes/origin/main

export default function DashboardPage() {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Estado para rastrear se o usuário está logado
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null indica que ainda está verificando
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento inicial

  useEffect(() => {
    // Função para lidar com redimensionamento da janela
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallScreen(width <= 1200);
      setIsMobile(width <= 880);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Verificar o status de login ao montar o componente
    const checkLoginStatus = () => {
      const isLoggedInStorage = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(isLoggedInStorage === "true");
      setLoading(false);
    };

    checkLoginStatus();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sponsorsData = [
    { logoUrl: "/images/icmc-logo.png" },
    { logoUrl: "/images/brains.png" },
    { logoUrl: "/images/centerIA.png" },
  ];

  const faqData = [
    {
      question: "Como o MeGuie funciona?",
      answer:
        "O MeGuie organiza conteúdos gratuitos e de qualidade encontrados na internet em um formato de roadmap.",
    },
    {
      question: "Preciso pagar para usar o MeGuie?",
      answer: "Não, o MeGuie é totalmente gratuito.",
    },
    {
      question:
        "Qual é a diferença entre o MeGuie e outros métodos de estudo online?",
      answer:
        "Diferentemente de outros métodos de estudos em que o conteúdo é dividido em dias ou semanas, o MeGuie possui um cronograma de estudos mais flexível, permitindo que você estude no seu próprio ritmo.",
    },
  ];

  const handleSignup = () => {
    router.push("/br/pages/signup");
  };

  const handleLogin = () => {
    router.push("/br/pages/login");
  };

  // Se ainda estiver verificando o status de login, exibir um indicador de carregamento
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingOverlay />
      </div>
    );
  }

  // Renderização Condicional
  if (isLoggedIn) {
    return <Home />;
  }

  // Conteúdo da Dashboard para usuários não logados
  return (
    <div className="mt-32 mx-auto max-w-screen-2xl p-4 md:p-8">
      <section
        className={`flex ${
          isSmallScreen ? "flex-col-reverse" : "flex-row"
        } relative py-0`}
      >
        <div
          className={`flex flex-col items-center ${
            isSmallScreen ? "text-center" : "md:flex-row text-left"
          } space-x-0 md:space-x-4`}
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
            <button
              className="px-4 py-2 rounded-lg hover:opacity-90 mr-4"
              style={{
                backgroundColor: "var(--action)",
                color: "var(--background)",
                fontFamily: "var(--font-inter)",
              }}
              onClick={handleSignup}
              aria-label="Começar"
            >
              Começar
            </button>
            <button
              className="px-4 py-2 rounded-lg hover:opacity-90"
              style={{
                backgroundColor: "transparent",
                color: "var(--primary)",
                border: "2px solid var(--action)",
                fontFamily: "var(--font-inter)",
              }}
              onClick={handleLogin}
              aria-label="Entrar"
            >
              Entrar
            </button>
          </div>
        </div>
        <div
          className={`flex justify-center -mt-[100px] -mb-[50px] ${
            isSmallScreen ? "" : "md:-mt-30 ml-44"
          } float-animation`}
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
      <p className="text-center" id="main-content">
        O MeGuie é uma plataforma que oferece Roadmaps completos para estudantes
        do ensino fundamental e médio, criando um caminho claro e eficiente para
        quem deseja se preparar para o vestibular de forma gratuita. Nosso
        objetivo é democratizar o acesso ao conhecimento de qualidade disponível
        na internet e ajudar cada aluno a alcançar seu potencial máximo. Sabemos
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
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir Instagram"
        >
          <FaInstagram
            size={isMobile ? 30 : 40}
            className="hover:text-gray-700 transition duration-300"
          />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir Facebook"
        >
          <RiFacebookCircleLine
            size={isMobile ? 30 : 40}
            className="hover:text-gray-700 transition duration-300"
          />
        </a>
        <a
          href="https://wa.me/35988550516"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir WhatsApp"
        >
          <FaWhatsapp
            size={isMobile ? 30 : 40}
            className="hover:text-gray-700 transition duration-300"
          />
        </a>
        <a
          href="mailto:contato@meguie.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Enviar email"
        >
          <MdOutlineEmail
            size={isMobile ? 30 : 40}
            className="hover:text-gray-700 transition duration-300"
          />
        </a>
      </div>
    </div>
  );
}
