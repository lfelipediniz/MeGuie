import React, { useState } from "react";

const AccessibilityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [fontSizeClicks, setFontSizeClicks] = useState(0); // Número de cliques para aumentar o tamanho
  const maxClicks = 5; // Limite de aumentos
  const originalFontSize = 16; // Tamanho original da fonte

  const changeFontSize = (delta: number) => {
    const root = document.documentElement;
    const currentFontSize = parseFloat(
      getComputedStyle(root).getPropertyValue("--base-font-size")
    );

    // Limitar os cliques para não diminuir abaixo do original ou aumentar além do limite
    if ((delta > 0 && fontSizeClicks >= maxClicks) || (delta < 0 && fontSizeClicks <= 0)) return;

    const newFontSize = currentFontSize + delta;
    root.style.setProperty("--base-font-size", `${newFontSize}px`);

    // Atualiza o contador apenas quando aumentar ou diminuir
    if (delta > 0) setFontSizeClicks(fontSizeClicks + 1);
    if (delta < 0) setFontSizeClicks(fontSizeClicks - 1);
  };

  const resetFontSize = () => {
    document.documentElement.style.setProperty("--base-font-size", `${originalFontSize}px`);
    setFontSizeClicks(0); // Reseta o contador
  };

  const toggleContrastTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    if (isDark) {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "var(--background-opacity)" }}
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
                  fontSizeClicks <= 0
                    ? "cursor-not-allowed opacity-50"
                    : "bg-button-secondary hover:opacity-90"
                }`}
                style={{
                  backgroundColor: fontSizeClicks <= 0 ? "var(--button-secondary)" : "var(--action)",
                  color: "var(--contrast-bt-text)",
                }}
                onClick={() => changeFontSize(-2)}
                disabled={fontSizeClicks <= 0}
              >
                A-
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  fontSizeClicks >= maxClicks
                    ? "cursor-not-allowed opacity-50"
                    : "bg-button-secondary hover:opacity-90"
                }`}
                style={{
                  backgroundColor: fontSizeClicks >= maxClicks ? "var(--button-secondary)" : "var(--action)",
                  color: "var(--contrast-bt-text)",
                }}
                onClick={() => changeFontSize(2)}
                disabled={fontSizeClicks >= maxClicks}
              >
                A+
              </button>
              <button
                className="px-3 py-1 rounded hover:opacity-90"
                style={{
                  backgroundColor: "var(--action)",
                  color: "var(--contrast-bt-text)",
                }}
                onClick={resetFontSize}
              >
                Resetar
              </button>
            </div>
          </div>

          {/* Alternar modo de contraste */}
          <div className="flex items-center justify-between">
            <span className="text-secondary" style={{ color: "var(--text-secondary)" }}>
              Modo de Contraste:
            </span>
            <button
              className="px-3 py-1 rounded hover:opacity-90"
              style={{
                backgroundColor: "var(--action)",
                color: "var(--contrast-bt-text)",
              }}
              onClick={toggleContrastTheme}
            >
              Alternar
            </button>
          </div>
        </div>

        {/* Botão para fechar o modal */}
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
