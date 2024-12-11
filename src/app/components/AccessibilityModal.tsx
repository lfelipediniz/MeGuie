import React, { useState, useEffect, useRef } from "react";
import { FiMinus, FiPlus, FiRefreshCw } from "react-icons/fi";
import { IoIosContrast } from "react-icons/io";

const AccessibilityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [fontSizeClicks, setFontSizeClicks] = useState(0);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isVLibrasEnabled, setIsVLibrasEnabled] = useState(false);
  const maxClicks = 5;
  const originalFontSize = 16;

  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

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
    location.reload();
  };

  const getFocusableElements = (element: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="radio"]:not([disabled])',
      'input[type="checkbox"]:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    const focusableElements = Array.from(element.querySelectorAll<HTMLElement>(focusableSelectors.join(',')));
    return focusableElements.filter(el => !el.hasAttribute('aria-hidden'));
  };

  useEffect(() => {
    if (isOpen) {
      // Salva o elemento que estava focado antes de abrir o modal
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      // Define o foco para o primeiro elemento focável no modal
      const modal = modalRef.current;
      if (modal) {
        const focusableElements = getFocusableElements(modal);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
          firstFocusableRef.current = focusableElements[0];
          lastFocusableRef.current = focusableElements[focusableElements.length - 1];
        } else {
          modal.focus();
        }
      }

      // Desabilita o scroll da página de fundo
      document.body.style.overflow = 'hidden';
    } else {
      // Retorna o foco ao elemento anterior
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }

      // Habilita o scroll da página
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = getFocusableElements(modal);
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    // O foco será retornado no useEffect que trata o fechamento
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
      }}
      aria-modal="true"
      role="dialog"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-background-secondary rounded-lg shadow-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1} // Permite que o div receba foco se necessário
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
          onClick={handleClose}
          aria-label="Fechar modal de acessibilidade"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default AccessibilityModal;
