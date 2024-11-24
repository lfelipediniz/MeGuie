"use client";
import { useState } from "react";
import { useRouter } from "@/src/navigation";
import { IoSearch } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import RoadmapCard from "../../components/RoadmapCard";
import TopicsModal from "../../components/TopicsModal";

export default function SavedRoads() {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);

  const [favoriteRoadmaps, setFavoriteRoadmaps] = useState([
    {
      id: 1,
      image: "image_fisica.png",
      title: "Matemática",
      progress: 40,
      topics: ["Tópico 1", "Tópico 2", "Tópico 3", "Tópico 4"],
    },
    {
      id: 2,
      image: "image_fisica.png",
      title: "Física",
      progress: 60,
      topics: ["Tópico 1", "Tópico 2"],
    },
    {
      id: 3,
      image: "image_fisica.png",
      title: "Química",
      progress: 20,
      topics: ["Tópico 1", "Tópico 2", "Tópico 3"],
    },
  ]);

  function handleBack() {
    router.back();
  }

  const handleRemoveRoadmap = (roadmapId: number) => {
    setFavoriteRoadmaps((prevRoadmaps) =>
      prevRoadmaps.filter((roadmap) => roadmap.id !== roadmapId)
    );
  };

  return (
    <div className="mt-16 p-4 md:p-8 bg-[var(--background-secondary)]">
      {showLoading ? (
        <div className="transition-opacity duration-500 opacity-100 mx-auto max-w-screen-2xl">
          <LoadingOverlay />
        </div>
      ) : (
        <div className="transition-opacity duration-500 opacity-100 mx-auto max-w-screen-2xl">
          <div className="w-full h-12 flex justify-between items-center gap-4 mb-4">
            <button
              onClick={handleBack}
              className="h-12 w-12 flex justify-center items-center hover:bg-black/5 rounded-full transition duration-500"
            >
              <FaArrowLeft size={24} color={"var(--marine)"} />
            </button>
            <div className="w-full h-full rounded-xl shadow-xl bg-white px-4 flex items-center gap-4">
              <IoSearch size={24} color={"var(--text-tertiary)"} />
              <input
                type="text"
                placeholder="Pesquisar roadmap"
                className="placeholder-[var(--text-tertiary)] text-[var(--text-dark-blue)] text-lg outline-none w-full h-full"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <h2 className="text-[var(--dark-blue)] text-xl md:text-2xl font-bold">
              Roadmaps Favoritos
            </h2>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
              {favoriteRoadmaps.map((roadmap) => (
                <RoadmapCard
                  key={roadmap.id}
                  image={roadmap.image}
                  title={roadmap.title}
                  progress={roadmap.progress}
                  topics={roadmap.topics}
                  isFavorite={true}
                  onRemove={() => handleRemoveRoadmap(roadmap.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <TopicsModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
      />
    </div>
  );
}
