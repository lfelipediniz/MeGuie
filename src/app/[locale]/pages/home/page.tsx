"use client";
import { useEffect, useState } from "react";
import { useRouter } from "@/src/navigation";
import LoadingOverlay from "../../components/LoadingOverlay";
import RoadmapCard from "../../components/RoadmapCard";
import { IoSearch } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import TopicsModal from "../../components/TopicsModal";

type Topic = {
  title: string;
  description: string;
};

type Roadmap = {
  image: string;
  title: string;
  progress: number;
  topics: Topic[];
  isFavorite: boolean;
};

const mockRoadmaps: Roadmap[] = [
  {
    image: 'image_biologia.png',
    title: 'Biologia',
    progress: 40,
    topics: [
      { title: 'Ecossistemas', description: 'Biodiversidade e interações entre espécies.' },
      { title: 'Genética', description: 'Estudo da hereditariedade e variação dos seres vivos.' },
      { title: 'Evolução', description: 'Mudanças nas espécies ao longo do tempo.' },
    ],
    isFavorite: false,
  },
  {
    image: 'image_fisica.png',
    title: 'Matemática',
    progress: 50,
    topics: [
      { title: 'Álgebra', description: 'Equações, variáveis e expressões matemáticas.' },
      { title: 'Geometria', description: 'Estudo das formas, ângulos e espaço.' },
      { title: 'Cálculo', description: 'Derivadas, integrais e suas aplicações.' },
    ],
    isFavorite: false,
  },
  {
    image: 'image_portugues.png',
    title: 'Português',
    progress: 30,
    topics: [
      { title: 'Gramática', description: 'Regras e estruturas da língua portuguesa.' },
      { title: 'Literatura', description: 'Análise de obras e autores brasileiros.' },
      { title: 'Redação', description: 'Técnicas para escrita de textos.' },
    ],
    isFavorite: false,
  },
  {
    image: 'image_quimica.png',
    title: 'Química',
    progress: 0,
    topics: [
      { title: 'Tabela Periódica', description: 'Organização dos elementos químicos.' },
      { title: 'Reações Químicas', description: 'Transformações e interações entre substâncias.' },
      { title: 'Química Orgânica', description: 'Estudo dos compostos baseados em carbono.' },
    ],
    isFavorite: false,
  },
  {
    image: 'image_sociologia.png',
    title: 'Sociologia',
    progress: 100,
    topics: [
      { title: 'Cultura', description: 'Valores, costumes e práticas sociais.' },
      { title: 'Estratificação Social', description: 'Classes sociais e desigualdades.' },
      { title: 'Globalização', description: 'Globalização e seus impactos.' },
    ],
    isFavorite: false,
  }
];

export default function Home() {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [isTopicsModalOpen, setIsTopicsModalOpen] = useState(false);
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(mockRoadmaps);

  const toggleFavorite = (index: number) => {
    setRoadmaps((prevRoadmaps) => {
      const newRoadmaps = prevRoadmaps.map((roadmap, i) => {
        if (i === index) {
          return { ...roadmap, isFavorite: !roadmap.isFavorite };
        }
        return roadmap;
      });
      return newRoadmaps; 
    });
  };

  function handleBack() {
    router.back()
  }

  const openTopicsModal = () => {
    setIsTopicsModalOpen(true);
  };

  const closeTopicsModal = () => {
    setIsTopicsModalOpen(false);
  };

  function handleOpenTopics(topics: Topic[]) {
    setLocalTopics(topics);
    openTopicsModal();
  }

  return (
    <div className="mt-16 p-4 md:p-8 bg-[var(--background-secondary)]">
      {showLoading ? (
        <div className="transition-opacity duration-500 opacity-100 mx-auto max-w-screen-2xl">
          <LoadingOverlay />
        </div>
      ) : (
        <div className="transition-opacity duration-500 opacity-100 mx-auto max-w-screen-2xl">
          <div className="w-full h-12 flex justify-between items-center gap-4 mb-4">
            <button onClick={handleBack} className="h-12 w-12 flex justify-center items-center hover:bg-black/5 rounded-full transition duration-500">
              <FaArrowLeft size={24} color={"var(--marine)"} />
            </button>
            <div className="w-full h-full rounded-xl shadow-xl bg-white px-4 flex items-center gap-4">
              <IoSearch size={24} color={"var(--text-tertiary)"} />
              <input type="text" placeholder="Pesquisar roadmap" className="placeholder-[var(--text-tertiary)] text-[var(--text-dark-blue)] text-lg outline-none w-full h-full" />
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <h2 className="text-[var(--dark-blue)] text-xl md:text-2xl font-bold">Roadmaps</h2>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
              {roadmaps.map((m, index) => (
                <RoadmapCard 
                  image={m.image}
                  title={m.title}
                  progress={m.progress}
                  isFavorite={m.isFavorite}
                  toggleFavorite={() => toggleFavorite(index)}
                  handleOpenTopics={() => handleOpenTopics(m.topics)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <TopicsModal
        topics={localTopics}
        isOpen={isTopicsModalOpen}
        onClose={closeTopicsModal}
      />
    </div>
  );
}
