import React from "react";
import { FaAdjust, FaTextHeight, FaHandsHelping } from "react-icons/fa";
import { useTheme } from "next-themes";

const AccessibilityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { setTheme, resolvedTheme } = useTheme();

  if (!isOpen) return null;

  const toggleContrastTheme = () => {
    const isDark = resolvedTheme === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  const isDarkMode = resolvedTheme === "dark";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "var(--background-opacity)" }}
      onClick={onClose}
    >
      <div
        className="rounded-lg shadow-lg p-6 max-w-sm w-full"
        style={{
          backgroundColor: "var(--background-secondary)",
          color: "var(--text-secondary)",
        }}
        onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro do modal
      >
        <h2
          className="text-xl font-bold mb-4"
          style={{
            color: "var(--primary)",
            fontFamily: "var(--font-montserrat)",
          }}
        >
          Opções de Acessibilidade
        </h2>
        <div className="space-y-4">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={toggleContrastTheme}
            style={{ color: "var(--primary)" }}
          >
            <FaAdjust />
            <span>{isDarkMode ? "Tirar Alto Contraste" : "Alto Contraste"}</span>
          </div>
          <div
            className="flex items-center space-x-3 cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
          >
            <FaTextHeight />
            <span>Aumentar Fonte</span>
          </div>
          <div
            className="flex items-center space-x-3 cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
          >
            <FaHandsHelping />
            <span>Libras</span>
          </div>
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

export default AccessibilityModal;
