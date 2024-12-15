// src/components/RoadmapCard.tsx

import React from "react";
import Image from "next/image";
import { FaRegHeart, FaHeart, FaEdit } from "react-icons/fa"; // Import dos ícones de coração e edição
import { IoChevronForward } from "react-icons/io5";
import { useRouter } from "@/src/navigation";

type Topic = {
  title: string;
  description: string;
};

interface RoadmapCardProps {
  _id: string; // ID único do roadmap
  image: string;
  title: string;
  progress: number;
  isFavorite: boolean;
  toggleFavorite: () => void;
  topics: Topic[];
  handleOpenTopics: (topics: Topic[], event: React.SyntheticEvent) => void;
  isEditMode?: boolean; // Prop para controlar o Modo Edição
  onEdit?: () => void; // Função para abrir o modal de edição
  nameSlug: string; // Slug do nome do roadmap
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({
  _id,
  image,
  title,
  progress,
  isFavorite,
  toggleFavorite,
  topics,
  handleOpenTopics,
  isEditMode = false,
  onEdit,
  nameSlug,
}) => {
  const router = useRouter();

  function handleClick() {
    if (!isEditMode && nameSlug) { // Verifica se nameSlug existe
      router.push(`/pages/roadmap/${nameSlug}`);
    }
  }

  function handleFavorite(event: React.MouseEvent | React.KeyboardEvent) {
    event.stopPropagation();
    toggleFavorite();
  }

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => {
        if (!isEditMode && e.key === "Enter") {
          handleClick();
        }
      }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden h-auto max-w-full cursor-pointer relative"
      aria-label={`Card de ${title}`}
      tabIndex={0} // Acessível por teclado
    >
      {/* Ícone de Edição */}
      {isEditMode && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
          aria-label={`Editar ${title}`}
        >
          <FaEdit size={20} color="black" />
        </button>
      )}

      <Image
        src={`/images/cards/${image}`}
        alt={`Imagem representativa de ${title}`}
        width={1000}
        height={1000}
        className="w-full h-30 md:h-36 object-cover"
      />
      <div className="p-4 md:p-6 flex flex-col gap-4">
        <p className="text-[var(--text-dark-blue)] font-inter text-lg md:text-2xl font-bold text-left">
          {title}
        </p>
        <div
          className="h-2 w-full bg-gray-300 rounded-full"
          aria-label={`Progresso de ${progress}%`}
        >
          <div
            className="h-full rounded-full bg-green-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={(event) =>
              handleOpenTopics(topics, event as React.SyntheticEvent)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleOpenTopics(topics, e as React.SyntheticEvent);
              }
            }}
            className="border border-[var(--gray)] rounded-full p-2 pointer-events-auto flex items-center gap-2 text-[var(--gray)]"
            aria-label="Ver tópicos abordados"
            tabIndex={0}
          >
            Ver tópicos abordados{" "}
            <IoChevronForward size={18} color={"var(--gray)"} />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              handleFavorite(event);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault(); // Previne comportamentos padrão, como rolar a página
                e.stopPropagation(); // Evita que o evento suba para o pai
                handleFavorite(e); // Executa a lógica do botão
              }
            }}
            role="button"
            className="pointer-events-auto"
            aria-label={
              isFavorite
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }
            tabIndex={0}
          >
            {isFavorite ? (
              <FaHeart size={24} color={"var(--gray)"} />
            ) : (
              <FaRegHeart size={24} color={"var(--gray)"} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapCard;
