"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "@/src/navigation";
import RoadmapCard from "../../components/RoadmapCard";
import TopicsModal from "../../components/TopicsModal";
import SearchBar from "../../components/SearchBar";
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
  nameSlug: string;
};

export default function FavoritesPage() {
  const router = useRouter();
  const [isTopicsModalOpen, setIsTopicsModalOpen] = useState(false);
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapDisplay[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      return;
    }

    fetchFavoriteRoadmaps(authToken);
  }, []);

  const fetchFavoriteRoadmaps = async (authToken: string) => {
    try {
      // Fazer a requisição para obter os IDs dos roadmaps favoritos
      const favoriteResponse = await axios.get("/api/favoriteRoadmaps", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const favoriteRoadmapIds: string[] = favoriteResponse.data.favoriteRoadmapIds;

      if (favoriteRoadmapIds.length === 0) {
        setRoadmaps([]);
        return;
      }

      // Fazer a requisição para obter os detalhes dos roadmaps com base nos IDs favoritos
      const roadmapsResponse = await axios.get("/api/roadmap", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const dbRoadmaps: DBRoadmap[] = roadmapsResponse.data;

      // Filtrar os roadmaps que estão na lista de IDs favoritos
      const favoriteRoadmaps = dbRoadmaps.filter((db) =>
        favoriteRoadmapIds.includes(db._id)
      );

      const converted = favoriteRoadmaps.map((db) => convertDBRoadmapToDisplay(db));
      setRoadmaps(converted);
    } catch (error) {
      console.error("Erro ao buscar roadmaps favoritos:", error);
    }
  };

  const convertDBRoadmapToDisplay = (db: DBRoadmap): RoadmapDisplay => {
    const topics: Topic[] = db.nodes.map((node) => ({
      title: node.name,
      description: node.description,
    }));

    return {
      _id: db._id,
      imageURL: db.imageURL || "/image_generic.png",
      imageAlt: db.imageAlt || "Imagem de uma matéria",
      title: db.name,
      progress: 0,
      topics,
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

  return (
    <div className="mt-16 p-4 md:p-8 bg-[var(--background-secondary)] min-h-screen h-auto">
      <div className="w-full h-12 flex justify-between items-center gap-4 mb-4">
        <SearchBar
          onSearch={(query) => setSearchQuery(query)}
          onBack={handleBack}
        />
      </div>
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-[var(--dark-blue)] text-xl md:text-2xl font-bold">
          Roadmaps Favoritos
        </h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredRoadmaps.length > 0 ? (
            filteredRoadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap._id}
                _id={roadmap._id}
                imageURL={roadmap.imageURL}
                imageAlt={roadmap.imageAlt}
                title={roadmap.title}
                topics={roadmap.topics}
                handleOpenTopics={handleOpenTopics}
                nameSlug={roadmap.nameSlug}
              />
            ))
          ) : (
            <p className="text-gray-500">Nenhum roadmap favorito encontrado.</p>
          )}
        </div>
      </div>
      <TopicsModal
        topics={localTopics}
        isOpen={isTopicsModalOpen}
        onClose={closeTopicsModal}
      />
    </div>
  );
}
