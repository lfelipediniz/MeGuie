"use client";
import { useTranslations } from "next-intl";
import Button from "./components/Button";
import LogoIcon from "../icons/logo";
import LottieStudy from "./components/LottieStudy";
import Sponsors from "./components/Sponsors";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsSmallScreen(width <= 1200);
      setIsMobile(width <= 880);
    };

    // Definindo o estado inicial e adicionando o listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup do listener ao desmontar o componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sponsorsData = [
    { logoUrl: "/images/icmc-logo.png" },
    { logoUrl: "/images/brains.png" },
    { logoUrl: "/images/centerIA.png" },

    // adicione mais patrocinadores conforme necessário
  ];

  const t = useTranslations("");
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
            height={isSmallScreen ? 300 : 500}
            width={isSmallScreen ? 300 : 500}
          />
        </div>
      </section>

      <h2 className="text-center">Sobre o Projeto</h2>
      <br />
      <p className="text-center">
        O MeGuie é uma plataforma que oferece Roadmaps completos para
        estudantes do ensino fundamental e médio, criando um caminho claro e
        eficiente para quem deseja se preparar para o vestibular de forma
        gratuita. Nosso objetivo é democratizar o acesso ao conhecimento de
        qualidade disponível na internet e ajudar cada aluno a alcançar seu
        potencial máximo.Sabemos que há uma infinidade de conteúdos educativos
        gratuitos e de alta qualidade online, mas a falta de uma organização
        estruturada muitas vezes impede os estudantes de aproveitarem esses
        recursos ao máximo. O MeGuie resolve esse problema ao indexar e
        organizar esses conteúdos, criando uma jornada de aprendizado com um
        passo a passo em cada matéria, para que você possa estudar com mais foco
        e direção.
      </p>
      <br />

      <h2 className="text-center">Nossos Patrocinadores</h2>
    </div>
  );
}
