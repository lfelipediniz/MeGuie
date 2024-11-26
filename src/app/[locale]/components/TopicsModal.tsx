import React from "react";

const TopicsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
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
          Tópicos Abordados
        </h2>
        <div className="space-y-4">
          <div>
            <h3>Topico 1</h3>
            <p>Descrição do tópico 1...</p>
          </div>
          <div>
            <h3>Topico 2</h3>
            <p>Descrição do tópico 2...</p>
          </div>
          <div>
            <h3>Topico 3</h3>
            <p>Descrição do tópico 3...</p>
          </div>
        </div>
        {/* Botão de fechar */}
        <button
          className="mt-6 px-4 py-2 rounded-lg hover:opacity-90"
          style={{
            backgroundColor: "var(--action)",
            color: "var(--contrast-bt-text)",
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
