"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/navigation";
import { FaArrowLeft } from "react-icons/fa6";

export default function HowToUse() {
  const t = useTranslations("");
  const locale = t("DONT_DELETE"); // determina o idioma atual da página
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  const steps = [
    { title: 'Passo 1', description: 'Faça login ou cadastro na plataforma' },
    { title: 'Passo 2', description: 'Escolha uma matéria para estudar e clique nela' },
    { title: 'Passo 3', description: 'Veja o roadmap de conteúdos' },
    { title: 'Passo 4', description: 'Clique em um contaúdo da matéria' },
    { title: 'Passo 5', description: 'Visualize vídeos no youtube e sites sobre o conteúdo' },
    { title: 'Passo 6', description: 'Marque o checkbox dos conteúdos que já foram vistos' },
    { title: 'Passo 7', description: 'Acompanhe seu progresso na tela de roadmaps' },
    { title: 'Passo 8', description: 'Continue estudando!' },
  ];

  return (
    <div className="relative text-xl md:text-2xl mt-16 p-8">
      <button 
        onClick={handleBack} 
        className="h-12 w-12 flex justify-center items-center hover:bg-black/5 rounded-full transition duration-500 absolute left-4 md:left-8 top-4"
        aria-label="Voltar"
      >
        <FaArrowLeft size={24} color={"var(--marine)"} />
      </button>
      <div className="container mx-auto flex flex-col items-center space-y-12">
        <h2 className="text-3xl font-bold text-center mb-8">Roadmap da plataforma</h2>

        {/* Container principal do roadmap */}
        <div className="relative flex items-center justify-center w-full max-w-screen-md">
          {/* Traço vertical no meio */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bg-[var(--secondary)] w-1 h-full z-0 rounded-full"></div>
          
          {/* Etapas do roadmap */}
          <div className="w-full flex flex-col space-y-12 z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-center w-full`}
              >
                {/* Caixa do passo */}
                <div className="w-full max-w-md flex items-center p-6 bg-white rounded-lg border-2 border-[var(--light-gray)] shadow-lg">
                  <div className="flex-shrink-0 h-10 w-10 bg-[var(--secondary)] text-white rounded-full flex items-center justify-center mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
