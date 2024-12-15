// src/pages/Admin.tsx

"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "@/src/navigation";
// Removido import do LoadingOverlay
import RoadmapCard from "../../components/RoadmapCard";
import TopicsModal from "../../components/TopicsModal";
import SearchBar from "../../components/SearchBar";
import CreateRoadmapModal from "../../components/CreateRoadmapModal";
import axios from "axios";

type DBRoadmap = {
  _id: string;
  imageURL: string;
  name: string;
  nameSlug: string;
  nodes: { name: string; description: string }[];
};

type Topic = {
  title: string;
  description: string;
};

type RoadmapDisplay = {
  _id: string; // Adicionado para manter a consistência
  image: string;
  title: string;
  progress: number;
  topics: Topic[];
  isFavorite: boolean;
  nameSlug: string; // Adicionado
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
      _id: db._id, // Adicionado para manter a consistência
      image: db.imageURL || "image_generic.png",
      title: db.name,
      progress: 0,
      topics,
      isFavorite: false,
      nameSlug: db.nameSlug, // Adicionado
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
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 mt-3 rounded-2xl bg-[var(--action)] text-[var(--background)] hover:opacity-90"
        >
          Criar
        </button>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-[var(--dark-blue)] text-xl md:text-2xl font-bold">
          Roadmaps Criados
        </h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredRoadmaps.map((m, index) => (
            <RoadmapCard
              key={m._id} // Usando _id como key único
              _id={m._id} // Passando _id
              image={m.image}
              title={m.title}
              progress={m.progress}
              isFavorite={m.isFavorite}
              toggleFavorite={() => toggleFavorite(index)}
              topics={m.topics}
              handleOpenTopics={handleOpenTopics}
              nameSlug={m.nameSlug} // Adicionado
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
    </div>
  );
}
