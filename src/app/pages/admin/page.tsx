"use client";
import { useEffect, useState, useMemo, FormEvent } from "react";
import { useRouter } from "@/src/navigation";
import LoadingOverlay from "../../components/LoadingOverlay";
import RoadmapCard from "../../components/RoadmapCard";
import TopicsModal from "../../components/TopicsModal";
import SearchBar from "../../components/SearchBar";
import axios from "axios";

type Topic = {
  title: string;
  description: string;
};

// Estrutura do node retornado pela API, agora com contents embutidos
interface DBContent {
  type: 'vídeo' | 'website';
  title: string;
  url: string;
}

interface DBNode {
  name: string;
  description: string;
  contents: DBContent[];
  position: {
    x: number;
    y: number;
  };
}

interface DBRoadmap {
  _id: string;
  name: string;
  nodes: DBNode[];
  edges: {
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }[];
}

type RoadmapDisplay = {
  image: string;
  title: string;
  progress: number;
  topics: Topic[];
  isFavorite: boolean;
};

export default function Admin() {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(true);
  const [isTopicsModalOpen, setIsTopicsModalOpen] = useState(false);
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapDisplay[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null enquanto não sabemos

  // Estados para modal de criação de roadmap
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [roadmapJson, setRoadmapJson] = useState('');

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setIsAdmin(false);
      setShowLoading(false);
      return;
    }

    axios.get('/api/user', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    .then(response => {
      const user = response.data;
      setIsAdmin(!!user.admin);

      if (user.admin) {
        // Carregar roadmaps do backend
        fetchRoadmaps(authToken);
      } else {
        setShowLoading(false);
      }
    })
    .catch(error => {
      console.error("Erro ao verificar admin:", error);
      setIsAdmin(false); 
      setShowLoading(false);
    });
  }, []);

  const fetchRoadmaps = (authToken: string) => {
    axios.get('/api/roadmap', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    .then(response => {
      const dbRoadmaps: DBRoadmap[] = response.data;
      const converted = dbRoadmaps.map(db => convertDBRoadmapToDisplay(db));
      setRoadmaps(converted);
    })
    .catch(error => {
      console.error("Erro ao buscar roadmaps:", error);
    })
    .finally(() => setShowLoading(false));
  };

  const convertDBRoadmapToDisplay = (db: DBRoadmap): RoadmapDisplay => {
    // Definimos imagem e progresso fixos, pois não temos lógica real
    const topics: Topic[] = db.nodes.map(node => ({
      title: node.name,
      description: node.description,
    }));

    return {
      image: 'image_generic.png',
      title: db.name,
      progress: 0,
      topics,
      isFavorite: false
    };
  };

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

  function handleOpenTopics(topics: Topic[], event: React.SyntheticEvent) {
    event.stopPropagation();
    setLocalTopics(topics);
    openTopicsModal();
  }

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter(
      f => f.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roadmaps, searchQuery]);

  if (showLoading) {
    return (
      <div className="transition-opacity duration-500 opacity-100 mx-auto max-w-screen-2xl">
        <LoadingOverlay />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl font-bold">Você não tem os privilégios para acessar o sistema</p>
      </div>
    );
  }

  // Funções para criar Roadmap
  const handleCreateRoadmap = async (e: FormEvent) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;
    try {
      const parsedJson = JSON.parse(roadmapJson);
      await axios.post('/api/roadmap', parsedJson, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      // Se criar com sucesso, recarrega a lista de roadmaps
      fetchRoadmaps(authToken);
      setIsCreateModalOpen(false);
      setRoadmapJson('');
    } catch (error: any) {
      console.error("Erro ao criar roadmap:", error);
      alert('Erro ao criar roadmap: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="mt-16 p-4 md:p-8 bg-[var(--background-secondary)]">
      <div className="w-full h-12 flex justify-between items-center gap-4 mb-4">
        <SearchBar onSearch={(query) => {setSearchQuery(query)}} onBack={handleBack} />
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[var(--action)] text-[var(--background)] hover:opacity-90"
        >
          Criar Roadmap
        </button>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-[var(--dark-blue)] text-xl md:text-2xl font-bold">Roadmaps Criados</h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredRoadmaps.map((m, index) => (
            <RoadmapCard 
              key={m.title + index}
              image={m.image}
              title={m.title}
              progress={m.progress}
              isFavorite={m.isFavorite}
              toggleFavorite={() => toggleFavorite(index)}
              topics={m.topics}
              handleOpenTopics={handleOpenTopics} />
          ))}
        </div>
      </div>
      <TopicsModal
        topics={localTopics}
        isOpen={isTopicsModalOpen}
        onClose={closeTopicsModal}
      />

      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-5 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Criar Roadmap</h2>
            <form onSubmit={handleCreateRoadmap} className="flex flex-col gap-4">
              <textarea
                className="border p-2 rounded w-full h-40"
                placeholder='Cole aqui o JSON do roadmap...'
                value={roadmapJson}
                onChange={(e) => setRoadmapJson(e.target.value)}
              ></textarea>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--action)] text-white hover:opacity-90"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
