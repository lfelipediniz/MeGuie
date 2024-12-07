import React, { useState, useEffect } from "react";
import { FiMinus, FiPlus, FiRefreshCw } from "react-icons/fi"; // Ícones para ajuste de fonte
import { IoIosContrast } from "react-icons/io"; // Ícone para contraste

const AccessibilityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [fontSizeClicks, setFontSizeClicks] = useState(0);
  const [isHighContrast, setIsHighContrast] = useState(false); // Estado para o modo de alto contraste
  const [isVLibrasEnabled, setIsVLibrasEnabled] = useState(false);
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
      localStorage.setItem("isHighContrast", "false");
    } else {
      root.classList.add("dark");
      setIsHighContrast(true);
      localStorage.setItem("isHighContrast", "true");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPreference = localStorage.getItem("isHighContrast");
      const root = document.documentElement;

      if (savedPreference === "true") {
        root.classList.add("dark");
        setIsHighContrast(true);
      } else {
        root.classList.remove("dark");
        setIsHighContrast(false);
      }
    }
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem("isVLibrasEnabled") === "true";
    setIsVLibrasEnabled(savedState);
  }, []);

  const toggleVLibras = () => {
    const newState = !isVLibrasEnabled;
    setIsVLibrasEnabled(newState);
    localStorage.setItem("isVLibrasEnabled", String(newState));
    location.reload(); // Reload to apply the change immediately
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semitransparente
        backdropFilter: "blur(10px)", // Desfoque no fundo
      }}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-background-secondary rounded-lg shadow-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
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
          {/* Ajuste de tamanho da fonte */}
          <div className="flex items-center justify-between">
            <span className="text-secondary" style={{ color: "var(--text-secondary)" }}>
              Ajustar Tamanho da Fonte:
            </span>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${
                  fontSizeClicks <= 0 ? "cursor-not-allowed opacity-50" : "bg-button-secondary hover:opacity-90"
                }`}
                style={{
                  backgroundColor: fontSizeClicks <= 0 ? "var(--button-secondary)" : "var(--action)",
                  color: "var(--contrast-bt-text)",
                }}
                onClick={() => changeFontSize(-2)}
                disabled={fontSizeClicks <= 0}
                aria-label="Diminuir tamanho da fonte"
              >
                <FiMinus />
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  fontSizeClicks >= maxClicks ? "cursor-not-allowed opacity-50" : "bg-button-secondary hover:opacity-90"
                }`}
                style={{
                  backgroundColor: fontSizeClicks >= maxClicks ? "var(--button-secondary)" : "var(--action)",
                  color: "var(--contrast-bt-text)",
                }}
                onClick={() => changeFontSize(2)}
                disabled={fontSizeClicks >= maxClicks}
                aria-label="Aumentar tamanho da fonte"
              >
                <FiPlus />
              </button>
              <button
                className="px-3 py-1 rounded hover:opacity-90"
                style={{
                  backgroundColor: "var(--action)",
                  color: "var(--contrast-bt-text)",
                }}
                onClick={resetFontSize}
                aria-label="Redefinir tamanho da fonte"
              >
                <FiRefreshCw />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-secondary" style={{ color: "var(--text-secondary)" }}>
              {isHighContrast ? "Tirar Alto Contraste" : "Ativar Alto Contraste"}
            </span>
            <button
              className="px-3 py-1 rounded hover:opacity-90"
              style={{
                backgroundColor: "var(--action)",
                color: "var(--contrast-bt-text)",
              }}
              onClick={toggleContrastTheme}
              aria-label={isHighContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
            >
              <IoIosContrast />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-secondary" style={{ color: "var(--text-secondary)" }}>
              {isVLibrasEnabled ? "Desativar VLibras" : "Ativar VLibras"}
            </span>
            <button
              className="px-3 py-1 rounded hover:opacity-90"
              style={{
                backgroundColor: "var(--action)",
                color: "var(--contrast-bt-text)",
              }}
              onClick={toggleVLibras}
              aria-label={isVLibrasEnabled ? "Desativar VLibras" : "Ativar VLibras"}
            >
              {isVLibrasEnabled ? <FiMinus /> : <FiPlus />}
            </button>
          </div>
        </div>
        
        <button
          className="mt-6 px-4 py-2 rounded-lg hover:opacity-90"
          style={{
            backgroundColor: "var(--action)",
            color: "var(--contrast-bt-text)",
          }}
          onClick={onClose}
          aria-label="Fechar modal de acessibilidade"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default AccessibilityModal;
