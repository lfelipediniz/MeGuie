import React from "react";
import Image from 'next/image';
import { FaRegHeart } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";

interface CardComponentProps {
  image: string;
  title: string;
  progress: number;
  isFavorite: boolean;
  toggleFavorite: () => void;
  topics: string[];
  handleOpenTopics: (event: React.MouseEvent) => void;
}

const CardComponent: React.FC<CardComponentProps> = (props) => {
  function handleClick() {
    console.log("clique");
  }

  function handleFavorite(event: React.MouseEvent) {
    event.stopPropagation();
    props.toggleFavorite();
  }

  return (
    <div onClick={handleClick} className="bg-white rounded-3xl shadow-xl overflow-hidden h-auto max-w-full cursor-pointer">
      <Image
        src={`/images/cards/${props.image}`}
        alt={`Imagem de ${props.title}`}
        width={1000}
        height={1000}
        className="w-full h-30 md:h-36 object-cover"
      />
      <div className="p-4 md:p-6 flex flex-col gap-4">
        <p className="text-[var(--text-dark-blue)] font-inter text-lg md:text-2xl font-bold text-left">{props.title}</p>
        <div className="h-2 w-full bg-[var(--light-gray)] rounded-full">
          <div
            className="h-full rounded-full bg-[var(--gray)]"
            style={{ width: `${props.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={props.handleOpenTopics} className="border border-[var(--gray)] rounded-full p-2 pointer-events-auto flex items-center gap-2 text-[var(--gray)]">
            Ver tópicos abordados <IoChevronForward size={18} color={"var(--gray)"} />
          </button>
          <button onClick={handleFavorite} className="pointer-events-auto">
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
