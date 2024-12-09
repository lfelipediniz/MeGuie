import React from "react";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "@/src/navigation";

type Topic = {
  title: string;
  description: string;
};

interface CardComponentProps {
  image: string;
  title: string;
  progress: number;
  isFavorite: boolean;
  toggleFavorite: () => void;
  topics: Topic[];
  handleOpenTopics: (topics: Topic[], event: React.SyntheticEvent) => void;
}

const CardComponent: React.FC<CardComponentProps> = (props) => {
  const router = useRouter();

  function handleClick() {
    router.push(
      `/pages/roadmap/${props.title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()}`
    );
  }

  function handleFavorite(event: React.MouseEvent | React.KeyboardEvent) {
    event.stopPropagation();
    props.toggleFavorite();
  }

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleClick();
        }
      }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden h-auto max-w-full cursor-pointer"
      aria-label={`Card de ${props.title}`}
      tabIndex={0} // permite que o card seja acessível por teclado
    >
      <Image
        src={`/images/cards/${props.image}`}
        alt={`Imagem representativa de ${props.title}`}
        width={1000}
        height={1000}
        className="w-full h-30 md:h-36 object-cover"
      />
      <div className="p-4 md:p-6 flex flex-col gap-4">
        <p className="text-[var(--text-dark-blue)] font-inter text-lg md:text-2xl font-bold text-left">
          {props.title}
        </p>
        <div
          className="h-2 w-full bg-gray-300 rounded-full"
          aria-label={`Progresso de ${props.progress}%`}
        >
          <div
            className="h-full rounded-full bg-green-500"
            style={{ width: `${props.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={(event) => props.handleOpenTopics(props.topics, event as React.SyntheticEvent)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                props.handleOpenTopics(props.topics, e as React.SyntheticEvent);
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
            role='button'
            className="pointer-events-auto"
            aria-label={
              props.isFavorite
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }
            tabIndex={0}
          >
            {props.isFavorite ? (
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

export default CardComponent;
