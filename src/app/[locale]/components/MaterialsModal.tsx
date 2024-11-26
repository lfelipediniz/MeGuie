'use client'

import React, { useState } from "react";
import { FiMinus, FiPlus, FiRefreshCw } from "react-icons/fi"; // Ícones para ajuste de fonte
import { IoIosContrast } from "react-icons/io"; // Ícone para contraste4
import { IoClose } from "react-icons/io5";

const MaterialsModal: React.FC<{ title: string; videos: string[]; pdfs: string[]; isOpen: boolean; onClose: () => void }> = ({ title, videos, pdfs, isOpen, onClose }) => {
  const [fontSizeClicks, setFontSizeClicks] = useState(0);
  const [isHighContrast, setIsHighContrast] = useState(false); // Estado para o modo de alto contraste
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({}); // Estado para os checkboxes
  const maxClicks = 5;
  const originalFontSize = 16;

  const changeFontSize = (delta: number) => {
    const root = document.documentElement;
    const currentFontSize = parseFloat(
      getComputedStyle(root).getPropertyValue("--base-font-size")
    );

    if ((delta > 0 && fontSizeClicks >= maxClicks) || (delta < 0 && fontSizeClicks <= 0)) return;

    const newFontSize = currentFontSize + delta;
    root.style.setProperty("--base-font-size", `${newFontSize}px`);

    if (delta > 0) setFontSizeClicks(fontSizeClicks + 1);
    if (delta < 0) setFontSizeClicks(fontSizeClicks - 1);
  };

  const resetFontSize = () => {
    document.documentElement.style.setProperty("--base-font-size", `${originalFontSize}px`);
    setFontSizeClicks(0);
  };

  const handleCheckboxChange = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index], // Alterna o valor do checkbox
    }));
  };

  const toggleContrastTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    if (isDark) {
      root.classList.remove("dark");
      setIsHighContrast(false);
    } else {
      root.classList.add("dark");
      setIsHighContrast(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex w-screen h-screen"
      style={{ backgroundColor: "var(--background-opacity)" }}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-background-secondary rounded-lg shadow-lg pt-20 h-full w-screen md:w-96 absolute right-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 shadow-lg">
          <h2 className="text-[var(--dark-blue)] text-xl font-bold">Conteúdos sobre {title}</h2>
          <button onClick={onClose} className="bg-[var(--button-primary)] hover:opacity-90 rounded-full w-10 h-10 flex justify-center items-center">
            <IoClose color={"#ffffff"} size={24} />
          </button>
        </div>
        <div className="w-full h-full overflow-scroll p-4">
          <div className="w-full h-auto flex flex-col gap-2">
            <div>
              <h3 className="text-[var(--dark-blue)] text-lg font-bold mb-4">Vídeo-aulas no YouTube</h3>
              {videos.map((video, index) => (
                <div key={index} className="shadow-lg rounded-md overflow-hidden mb-4">
                  <iframe
                    src={video}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    height={200}
                    className="w-full"
                  ></iframe>
                  <div className="p-4 flex flex-row justify-between">
                    <h3 key={index} className="text-[var(--dark-blue)] text-lg">Vídeo {index+1}</h3>
                    <input
                      type="checkbox"
                      className="w-6 h-6" 
                      checked={!!checkedItems[index]} // Verifica se o item está marcado
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </div> 
              </div>
              ))}
            </div>
            <div>
              <h3 className="text-[var(--dark-blue)] text-lg font-bold">Materias de estudo</h3>
              {pdfs.map((pdf, index) => (
                <button className="p-4 flex justify-between items-center w-full border-2 border-[var(--light-gray)]">
                  <h3 key={index} className="text-[var(--dark-blue)] text-lg">{pdf}</h3>
                  <input type="checkbox" className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsModal;
