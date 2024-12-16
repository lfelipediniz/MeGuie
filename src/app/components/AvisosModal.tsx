import React from "react";

interface AvisosModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages?: { title: string; description: string }[]; // Propriedade opcional para os avisos
  title?: string; // Novo título opcional
}

const AvisosModal: React.FC<AvisosModalProps> = ({ isOpen, onClose, messages, title }) => {
  if (!isOpen) return null;

  // Avisos padrão, caso o usuário não forneça nenhum
  const defaultMessages = [
    { title: "Aviso 1", description: "Descrição do aviso 1..." },
    { title: "Aviso 2", description: "Descrição do aviso 2..." },
    { title: "Aviso 3", description: "Descrição do aviso 3..." },
  ];

  const messagesToDisplay = messages || defaultMessages;
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semitransparente
        backdropFilter: "blur(10px)", // Desfoque no fundo
      }}
      onClick={onClose}
      aria-label="Avisos Modal Background"
    >
      <div
        className="bg-white dark:bg-background-secondary rounded-lg shadow-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
        aria-label="Avisos Modal Content"
      >
        <h2
          className="text-xl font-bold mb-4"
          style={{
            color: "var(--primary)",
            fontFamily: "var(--font-montserrat)",
          }}
          aria-label="Avisos Modal Title"
        >
        </h2>
        <div className="space-y-4" aria-label="Avisos List">
          {messagesToDisplay.map((message, index) => (
            <div key={index} aria-label={`Aviso ${index + 1}`}>
              <h3 aria-label={`Aviso Title ${index + 1}`}>{message.title}</h3>
              <p aria-label={`Aviso Description ${index + 1}`}>{message.description}</p>
            </div>
          ))}
        </div>
        {/* Botão de fechar */}
        <button
          className="mt-6 px-4 py-2 rounded-lg hover:opacity-90"
          style={{
            backgroundColor: "var(--action)",
            color: "var(--contrast-bt-text)",
          }}
          onClick={onClose}
          aria-label="Close Avisos Modal"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default AvisosModal;
