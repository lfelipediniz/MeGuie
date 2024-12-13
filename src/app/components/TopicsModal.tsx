import React from "react";

interface TopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics?: { title: string; description: string }[]; // Propriedade opcional para os tópicos
  title?: string; // Novo título opcional
}

const TopicsModal: React.FC<TopicsModalProps> = ({ isOpen, onClose, topics, title }) => {
  if (!isOpen) return null;

  // Tópicos padrão, caso o usuário não forneça nenhum
  const defaultTopics = [
    { title: "Tópico 1", description: "Descrição do tópico 1..." },
    { title: "Tópico 2", description: "Descrição do tópico 2..." },
    { title: "Tópico 3", description: "Descrição do tópico 3..." },
  ];

  const topicsToDisplay = topics || defaultTopics;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semitransparente
        backdropFilter: "blur(10px)", // Desfoque no fundo
      }}
      onClick={onClose}
      aria-label="Topics Modal Background"
    >
      <div
        className="bg-white dark:bg-background-secondary rounded-lg shadow-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
        aria-label="Topics Modal Content"
      >
        <h2
          className="text-xl font-bold mb-4"
          style={{
            color: "var(--primary)",
            fontFamily: "var(--font-montserrat)",
          }}
          aria-label="Topics Modal Title"
        >
          {title || "Tópicos Abordados"}
        </h2>
        <div className="space-y-4" aria-label="Topics List">
          {topicsToDisplay.map((topic, index) => (
            <div key={index} aria-label={`Topic ${index + 1}`}>
              <h3 aria-label={`Topic Title ${index + 1}`}>{topic.title}</h3>
              <p aria-label={`Topic Description ${index + 1}`}>{topic.description}</p>
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
          aria-label="Close Topics Modal"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default TopicsModal;
