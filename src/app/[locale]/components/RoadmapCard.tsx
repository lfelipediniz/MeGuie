import React from "react";

interface CardComponentProps {
  image: string;
  title: string;
  progress: Number;
  topics: string[];
}

const CardComponent: React.FC<CardComponentProps> = (props) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 w-60 h-auto">
    <img src={props.image} alt={`Imagem de ${props.title}`} className="w-full h-30 md:h-36 object-cover" />
    <div className="p-4 md:p-6">
      <p className="text-primary font-inter text-lg md:text-xl mb-2 font-bold text-center">{props.title}</p>
      <div className="h-4 w-full bg-light-gray rounded-full">
        <div className="h-full w-[50%] rounded-full bg-gray"></div>
      </div>
    </div>
  </div>
);

export default CardComponent;
