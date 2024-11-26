"use client";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/src/navigation";
import PostSearch from "../../components/PostSearch";
import LoadingOverlay from "../../components/LoadingOverlay";
import { Footer } from "../../components/Footer";
import RoadmapCard from "../../components/RoadmapCard";
import { IoSearch } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import TopicsModal from "../../components/TopicsModal";
import MaterialsModal from "../../components/MaterialsModal";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTopicsModalOpen, setIsTopicsModalOpen] = useState(false);
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(true);

  function toggleFavorite() {
    setIsFavorite(!isFavorite);
  }

  function handleBack() {
    router.back()
  }

  const openTopicsModal = () => {
    setIsTopicsModalOpen(true);
  };

  const closeTopicsModal = () => {
    setIsTopicsModalOpen(false);
  };

  const openMaterialsModal = () => {
    setIsMaterialsModalOpen(true);
  };

  const closeMaterialsModal = () => {
    setIsMaterialsModalOpen(false);
  };

  function handleOpenTopics(event: React.MouseEvent) {
    event.stopPropagation();
    openTopicsModal();
  }

  const mathTopics = [
    "Tópico 1",
    "Tópico 2",
    "Tópico 3",
    "Tópico 4",
  ];

  const videosUrls = [
    "https://youtu.be/5Td5M0zyeBE?si=QwLg0lCZkbbRoq2r",
    "https://youtu.be/5Td5M0zyeBE?si=QwLg0lCZkbbRoq2r"
  ];

  const pdfsUrls = [
    "hfihefheofhei",
    "ghihfihifehfefe",
  ];

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
              <RoadmapCard image={"image_fisica.png"} title="Matemática" progress={40} isFavorite={isFavorite} toggleFavorite={toggleFavorite} topics={mathTopics} handleOpenTopics={handleOpenTopics} />
              <RoadmapCard image={"image_fisica.png"} title="Matemática" progress={40} isFavorite={isFavorite} toggleFavorite={toggleFavorite} topics={mathTopics} handleOpenTopics={handleOpenTopics} />
              <RoadmapCard image={"image_fisica.png"} title="Matemática" progress={40} isFavorite={isFavorite} toggleFavorite={toggleFavorite} topics={mathTopics} handleOpenTopics={handleOpenTopics} />
              <RoadmapCard image={"image_fisica.png"} title="Matemática" progress={40} isFavorite={isFavorite} toggleFavorite={toggleFavorite} topics={mathTopics} handleOpenTopics={handleOpenTopics} />
              <RoadmapCard image={"image_fisica.png"} title="Matemática" progress={40} isFavorite={isFavorite} toggleFavorite={toggleFavorite} topics={mathTopics} handleOpenTopics={handleOpenTopics} />
            </div>
          </div>
        </div>
      )}
      <TopicsModal
        topics={mathTopics}
        isOpen={isTopicsModalOpen}
        onClose={closeTopicsModal}
      />
      <MaterialsModal
        title={"Gráficos"}
        videos={videosUrls}
        pdfs={pdfsUrls}
        isOpen={isMaterialsModalOpen}
        onClose={closeMaterialsModal}
      />
    </div>
  );
}
