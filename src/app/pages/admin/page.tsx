// src/pages/Admin.tsx

"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "@/src/navigation";
import RoadmapCard from "../../components/RoadmapCard";
import TopicsModal from "../../components/TopicsModal";
import SearchBar from "../../components/SearchBar";
import CreateRoadmapModal from "../../components/CreateRoadmapModal";
import EditRoadmapModal from "../../components/EditRoadmapModal"; // Import do modal de edição
import axios from "axios";

type DBRoadmap = {
  _id: string;
  imageURL: string;
  name: string;
  nameSlug: string;
  imageAlt: string;
  nodes: DBNode[];
  edges: DBEdge[];
};

type DBNode = {
  _id: string;
  name: string;
  description: string;
  contents: DBContent[];
  position: {
    x: number;
    y: number;
  };
};

type DBContent = {
  _id: string;
  type: "vídeo" | "website";
  title: string;
  url: string;
};

type DBEdge = {
  _id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
};

type Topic = {
  title: string;
  description: string;
};

type RoadmapDisplay = {
  _id: string;
  image: string;
  title: string;
  progress: number;
  topics: Topic[];
  isFavorite: boolean;
  nameSlug: string;
};

export default function Admin() {
  const router = useRouter();
  const [isTopicsModalOpen, setIsTopicsModalOpen] = useState(false);
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapDisplay[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Modal de criação com etapas
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Estados para o modo edição
  const [isEditMode, setIsEditMode] = useState(false);
  const [roadmapToEdit, setRoadmapToEdit] = useState<DBRoadmap | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setIsAdmin(false);
      return;
    }

    axios
      .get("/api/user", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        const user = response.data;
        setIsAdmin(!!user.admin);

        if (user.admin) {
          // Carregar roadmaps do backend
          fetchRoadmaps(authToken);
        }
      })
      .catch((error) => {
        console.error("Erro ao verificar admin:", error);
        setIsAdmin(false);
      });
  }, []);

  const fetchRoadmaps = (authToken: string) => {
    axios
      .get("/api/roadmap", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        const dbRoadmaps: DBRoadmap[] = response.data;
        const converted = dbRoadmaps.map((db) =>
          convertDBRoadmapToDisplay(db)
        );
        setRoadmaps(converted);
      })
      .catch((error) => {
        console.error("Erro ao buscar roadmaps:", error);
      });
  };

  const convertDBRoadmapToDisplay = (db: DBRoadmap): RoadmapDisplay => {
    const topics: Topic[] = db.nodes.map((node) => ({
      title: node.name,
      description: node.description,
    }));

    return {
      _id: db._id,
      image: db.imageURL || "image_generic.png",
      title: db.name,
      progress: 0, // Você pode calcular isso com base nos nós ou outro critério
      topics,
      isFavorite: false,
      nameSlug: db.nameSlug,
    };
  };

  const toggleFavorite = (index: number) => {
    setRoadmaps((prevRoadmaps) => {
      const newRoadmaps = [...prevRoadmaps];
      newRoadmaps[index].isFavorite = !newRoadmaps[index].isFavorite;
      return newRoadmaps;
    });
  };

  function handleBack() {
    router.back();
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
    return roadmaps.filter((f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roadmaps, searchQuery]);

  // Função para abrir o modal de edição e buscar o roadmap completo
  const openEditModal = async (roadmap: RoadmapDisplay) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Token inválido.");
      return;
    }

    try {
      // Use nameSlug em vez de _id
      const response = await axios.get(`/api/roadmap/${roadmap.nameSlug}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const fullRoadmap: DBRoadmap = response.data;
      setRoadmapToEdit(fullRoadmap);
    } catch (error: any) {
      console.error("Erro ao buscar roadmap completo:", error);
      
      // Melhorar o feedback de erro para o usuário
      if (error.response) {
        // A requisição foi feita e o servidor respondeu com um status diferente de 2xx
        alert(`Erro: ${error.response.data.message || "Falha na requisição."}`);
      } else if (error.request) {
        // A requisição foi feita mas nenhuma resposta foi recebida
        alert("Erro: Nenhuma resposta do servidor.");
      } else {
        // Algo aconteceu ao configurar a requisição que acionou um erro
        alert(`Erro: ${error.message}`);
      }
    }
  };

  const closeEditModal = () => {
    setRoadmapToEdit(null);
  };

  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl font-bold">
          Você não tem os privilégios para acessar o sistema
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16 p-4 md:p-8 bg-[var(--background-secondary)]">
      <div className="w-full h-12 flex justify-between items-center gap-4 mb-4">
        <SearchBar
          onSearch={(query) => {
            setSearchQuery(query);
          }}
          onBack={handleBack}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditMode((prev) => !prev)}
            className={`px-4 py-2 mt-3 rounded-2xl ${
              isEditMode
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-[var(--action)] text-[var(--background)] hover:opacity-90"
            }`}
          >
            {isEditMode ? "Sair do Modo Edição" : "Modo Edição"}
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 mt-3 rounded-2xl bg-[var(--action)] text-[var(--background)] hover:opacity-90"
          >
            Criar
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-[var(--dark-blue)] text-xl md:text-2xl font-bold">
          Roadmaps Criados
        </h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredRoadmaps.map((roadmap, index) => (
            <RoadmapCard
              key={roadmap._id}
              _id={roadmap._id}
              image={roadmap.image}
              title={roadmap.title}
              progress={roadmap.progress}
              isFavorite={roadmap.isFavorite}
              toggleFavorite={() => toggleFavorite(index)}
              topics={roadmap.topics}
              handleOpenTopics={handleOpenTopics}
              nameSlug={roadmap.nameSlug}
              isEditMode={isEditMode}
              onEdit={() => openEditModal(roadmap)}
            />
          ))}
        </div>
      </div>
      <TopicsModal
        topics={localTopics}
        isOpen={isTopicsModalOpen}
        onClose={closeTopicsModal}
      />

      {/* Componente de Criação de Roadmap */}
      <CreateRoadmapModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRoadmapCreated={() => fetchRoadmaps(localStorage.getItem("authToken") || "")}
      />

      {/* Modal de Edição */}
      {roadmapToEdit && (
        <EditRoadmapModal
          roadmap={roadmapToEdit}
          onClose={closeEditModal}
          onSave={() => fetchRoadmaps(localStorage.getItem("authToken") || "")}
        />
      )}
    </div>
  );
}
