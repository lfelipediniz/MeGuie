import React, { useState } from "react";
import { FiMinus, FiPlus, FiRefreshCw } from "react-icons/fi"; // Ícones para ajuste de fonte
import { IoIosContrast } from "react-icons/io"; // Ícone para contraste

const TopicsModal: React.FC<{ topics: string[]; isOpen: boolean; onClose: () => void }> = ({ topics, isOpen, onClose }) => {
  const [fontSizeClicks, setFontSizeClicks] = useState(0);
  const [isHighContrast, setIsHighContrast] = useState(false); // Estado para o modo de alto contraste
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
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-red-400"
      style={{ backgroundColor: "var(--background-opacity)" }}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-background-secondary rounded-lg shadow-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[var(--marine)] text-2xl font-bold mb-4">Tópicos abordados:</h2>
        <div className="w-full h-auto flex flex-col gap-2">
          {topics.map((topic, index) => (
            <h3 key={index} className="text-[var(--dark-blue)] text-lg">{topic}</h3>
          ))}
        </div>
        <button
          className="mt-6 px-4 py-2 rounded-lg hover:opacity-90"
          style={{
            backgroundColor: "var(--action)",
            color: "var(--contrast-bt-text)",
            fontFamily: "var(--font-inter)",
          }}
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default TopicsModal;
