"use client";
;
import OrganizingCommittee from "../../components/OrganizingCommittee";
import Photo from "../../components/Photo";

// Import dos arquivos JSON
import peopleBR from "../../../../data/br/people.json";
import peopleEN from "../../../../data/en/people.json";
import FAQ from "../../components/FAQ";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "@/src/navigation";

export default function About() {




  const router = useRouter();

  function handleBack() {
    router.back();
  }

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
      answer: "Diferentemente de outros métodos de estudos em que o conteúdo é dividido em dias ou semanas, o MeGuie possui um cronograma de estudos mais flexível, permitindo que você estude no seu próprio ritmo.",
    },
  ];

  return (
    <div className="text-xl md:text-2xl mt-16 p-8 relative">
      <button onClick={handleBack} className="h-12 w-12 flex justify-center items-center hover:bg-black/5 rounded-full transition duration-500 absolute left-4 md:left-8 top-4" aria-label="Voltar">
        <FaArrowLeft size={24} color={"var(--marine)"} />
      </button>
      <div className="w-full max-w-screen-md mx-auto flex flex-col gap-4">

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-center md:text-left mt-8 md:mt-16 mb-4" aria-label="Sobre o MeGuie">{"Sobre o MeGuie"}</h2>
            <p className="leading-relaxed px-4 md:px-0 text-justify">
              {"O MeGuie é uma solução inovadora que organiza e estrutura o seu estudo com base em roadmaps pensados para as matérias do ensino médio e fundamental. Com uma seleção cuidadosa de conteúdos de qualidade, oferecemos um guia claro e prático para você seguir, economizando tempo e potencializando os seus resultados no caminho da aprovação."}
            </p>
          </div>

          <div>
            <h2 className="text-center md:text-left mt-8 md:mt-16 mb-4" aria-label="Sobre o projeto">
              {"Sobre o projeto"}
            </h2>
            <p className="leading-relaxed px-4 md:px-0 mt-2 md:mt-4 text-justify">
              {"O MeGuie é uma plataforma que oferece Roadmaps completos para estudantes do ensino fundamental e médio, criando um caminho claro e eficiente para quem deseja se preparar para o vestibular de forma gratuita. Nosso objetivo é democratizar o acesso ao conhecimento de qualidade disponível na internet e ajudar cada aluno a alcançar seu potencial máximo. Sabemos que há uma infinidade de conteúdos educativos gratuitos e de alta qualidade online, mas a falta de uma organização estruturada muitas vezes impede os estudantes de aproveitarem esses recursos ao máximo. O MeGuie resolve esse problema ao indexar e organizar esses conteúdos, criando uma jornada de aprendizado com um passo a passo em cada matéria, para que você possa estudar com mais foco e direção."}
            </p>
          </div>
        </section>

        <section className="">
          <h2 className="text-center md:text-left mt-8 md:mt-16 mb-4" aria-label="Perguntas frequentes">{"Perguntas frequentes"}</h2>
          <FAQ data={faqData} />
        </section>
      </div> 
    </div>
  );
}
