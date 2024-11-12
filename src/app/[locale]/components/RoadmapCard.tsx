import React from "react";
import Image from 'next/image';
import { FaRegHeart } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";

interface CardComponentProps {
  image: string;
  title: string;
  progress: number;
  topics: string[];
}

const CardComponent: React.FC<CardComponentProps> = (props) => {
  function handleClick() {
    console.log("clique");
  }

  function handleOpenTopics(event: React.MouseEvent) {
    event.stopPropagation();
    console.log("topicos");
  }

  function handleFavorite(event: React.MouseEvent) {
    event.stopPropagation();
    console.log("favoritos");
  }

  return (
    <button onClick={handleClick} className="bg-white rounded-3xl shadow-xl overflow-hidden w-96 h-auto">
      <Image
        src={`/images/cards/${props.image}`}
        alt={`Imagem de ${props.title}`}
        width={1000}
        height={1000}
        className="w-full h-30 md:h-36 object-cover"
      />
      <div className="p-4 md:p-6 flex flex-col gap-4">
        <p className="text-[var(--dark-blue)] font-inter text-lg md:text-2xl font-bold text-left">{props.title}</p>
        <div className="h-2 w-full bg-[var(--light-gray)] rounded-full">
          <div
            className="h-full rounded-full bg-[var(--gray)]"
            style={{ width: `${props.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={handleOpenTopics} className="border border-[var(--gray)] rounded-full p-2 pointer-events-auto flex items-center gap-2">
            Ver tópicos abordados <IoChevronForward size={18} color={"var(--gray)"} />
          </button>
          <button onClick={handleFavorite} className="pointer-events-auto">
            <FaRegHeart size={24} color={"var(--gray)"} />
          </button>
        </div>
      </div>
    </button>
  );
}

export default CardComponent;
