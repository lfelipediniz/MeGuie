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
  imageAlt: string;
  name: string;
  nameSlug: string;
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
  imageURL: string;
  imageAlt: string;
  title: string;
  progress: number;
  topics: Topic[];
  isFavorite: boolean;
  nameSlug: string;
};

type IUser = {
  _id: string;
  admin: boolean;
  favoriteRoadmaps: string[]; // IDs dos roadmaps favoritos
  seenContents: any[]; // Ajuste conforme a estrutura real
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

  // Estado para armazenar os dados do usuário
  const [userData, setUserData] = useState<IUser | null>(null);

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
        const user: IUser = response.data;
        setUserData(user);
        setIsAdmin(!!user.admin);

        if (user.admin) {
          // Carregar roadmaps do backend
          fetchRoadmaps(authToken, user);
        }
      })
      .catch((error) => {
        console.error("Erro ao verificar admin:", error);
        setIsAdmin(false);
      });
  }, []);

  const fetchRoadmaps = async (authToken: string, user: IUser) => {
    try {
      const response = await axios.get("/api/roadmap", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const dbRoadmaps: DBRoadmap[] = response.data;
      const converted = dbRoadmaps.map((db) =>
        convertDBRoadmapToDisplay(db, user)
      );
      setRoadmaps(converted);
    } catch (error) {
      console.error("Erro ao buscar roadmaps:", error);
    }
  };

  const convertDBRoadmapToDisplay = (
    db: DBRoadmap,
    user: IUser
  ): RoadmapDisplay => {
    const topics: Topic[] = db.nodes.map((node) => ({
      title: node.name,
      description: node.description,
    }));

    // Calcular o progresso (se necessário)
    // Aqui, progress está sendo setado como 0, já que o cálculo está sendo feito no RoadmapCard
    return {
      _id: db._id,
      imageURL: db.imageURL || "/image_generic.png",
      imageAlt: db.imageAlt || "Imagem de uma matéria",
      title: db.name,
      progress: 0, // Pode ser removido se não for mais utilizado
      topics,
      isFavorite: user.favoriteRoadmaps.includes(db._id),
      nameSlug: db.nameSlug,
    };
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
      const response = await axios.get(`/api/roadmap/${roadmap.nameSlug}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const fullRoadmap: DBRoadmap = response.data;
      setRoadmapToEdit(fullRoadmap);
    } catch (error) {
      console.error("Erro ao buscar roadmap para edição:", error);
      alert("Erro ao carregar o roadmap para edição.");
    }
  };

  const closeEditModal = () => {
    setRoadmapToEdit(null);
  };

  // Função para salvar as alterações após a edição
  const handleSaveEdit = () => {
    const authToken = localStorage.getItem("authToken");
    if (authToken && userData) {
      fetchRoadmaps(authToken, userData);
    }
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
    <div className="mt-16 p-4 md:p-8 bg-[var(--background-secondary)] min-h-screen h-auto">
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
        <br />
        <h2 className="text-[var(--dark-blue)] text-xl md:text-2xl font-bold">
          Roadmaps Criados
        </h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredRoadmaps.map((roadmap, index) => (
            <RoadmapCard
              key={roadmap._id} // Usando _id como key único
              _id={roadmap._id} // Passando _id
              imageURL={roadmap.imageURL}
              imageAlt={roadmap.imageAlt}
              title={roadmap.title}
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
        onRoadmapCreated={() =>
          fetchRoadmaps(localStorage.getItem("authToken") || "", userData!)
        }
      />

      {/* Modal de Edição */}
      {roadmapToEdit && (
        <EditRoadmapModal
          isOpen={!!roadmapToEdit}
          onClose={closeEditModal}
          roadmap={roadmapToEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
