import React, { useState } from "react";

const AccessibilityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [fontSizeClicks, setFontSizeClicks] = useState(0); // Número de cliques para aumentar o tamanho

  const changeFontSize = (delta: number) => {
    const root = document.documentElement;
    const currentFontSize = parseFloat(
      getComputedStyle(root).getPropertyValue("--base-font-size")
    );

    if (delta > 0 && fontSizeClicks >= 5) return; // Limite de 5 aumentos
    if (delta < 0 && fontSizeClicks > 0) setFontSizeClicks(fontSizeClicks - 1); // Reduz contador ao diminuir

    const newFontSize = Math.max(12, currentFontSize + delta); // Limita o tamanho mínimo a 12px
    root.style.setProperty("--base-font-size", `${newFontSize}px`);

    if (delta > 0) setFontSizeClicks(fontSizeClicks + 1); // Incrementa contador ao aumentar
  };

  const resetFontSize = () => {
    document.documentElement.style.setProperty("--base-font-size", "16px");
    setFontSizeClicks(0); // Reseta o contador ao padrão
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-primary">Opções de Acessibilidade</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-secondary">Ajustar Tamanho da Fonte:</span>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => changeFontSize(-2)}
              >
                A-
              </button>
              <button
                className={`px-3 py-1 ${
                  fontSizeClicks < 5 ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-200 cursor-not-allowed"
                } rounded`}
                onClick={() => changeFontSize(2)}
                disabled={fontSizeClicks >= 5} // Desativa botão quando atinge o limite
              >
                A+
              </button>
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={resetFontSize}
              >
                Resetar
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-secondary">Modo de Contraste:</span>
            <button
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => {
                const root = document.documentElement;
                const isDark = root.classList.contains("dark");
                if (isDark) {
                  root.classList.remove("dark");
                } else {
                  root.classList.add("dark");
                }
              }}
            >
              Alternar
            </button>
          </div>
        </div>

        <button
          className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default AccessibilityModal;
