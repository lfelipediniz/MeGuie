import React from "react";
import Image from 'next/image';
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
  handleOpenTopics: (topics: Topic[] , event: React.MouseEvent) => void;
}

const CardComponent: React.FC<CardComponentProps> = (props) => {
  const router = useRouter();

  function handleClick() {
    router.push(
      `/pages/roadmap/${
        props.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      }`
    );
  }

  function handleFavorite(event: React.MouseEvent) {
    event.stopPropagation();
    props.toggleFavorite();
  }

  return (
    <div onClick={handleClick} className="bg-white rounded-3xl shadow-xl overflow-hidden h-auto max-w-full cursor-pointer" aria-label={`Card de ${props.title}`}>
      <Image
        src={`/images/cards/${props.image}`}
        alt={`Imagem de ${props.title}`}
        width={1000}
        height={1000}
        className="w-full h-30 md:h-36 object-cover"
      />
      <div className="p-4 md:p-6 flex flex-col gap-4">
        <p className="text-[var(--text-dark-blue)] font-inter text-lg md:text-2xl font-bold text-left">{props.title}</p>
        <div className="h-2 w-full bg-gray-300 rounded-full" aria-label={`Progresso de ${props.progress}%`}>
          <div
            className="h-full rounded-full bg-green-500"
            style={{ width: `${props.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={(event) => props.handleOpenTopics(props.topics, event)} className="border border-[var(--gray)] rounded-full p-2 pointer-events-auto flex items-center gap-2 text-[var(--gray)]" aria-label="Ver tópicos abordados">
            Ver tópicos abordados <IoChevronForward size={18} color={"var(--gray)"} />
          </button>
          <button onClick={(event) => handleFavorite(event)} className="pointer-events-auto" aria-label={props.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
            {props.isFavorite ? 
              <FaHeart size={24} color={"var(--gray)"} />
            :
            <FaRegHeart size={24} color={"var(--gray)"} />
          }
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardComponent;
