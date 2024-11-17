import React from "react";
import { FaAdjust, FaTextHeight, FaHandsHelping } from "react-icons/fa";

const AccessibilityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro do modal
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--primary)" }}>
          Opções de Acessibilidade
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 cursor-pointer">
            <FaAdjust style={{ color: "var(--primary)" }} />
            <span>Alto Contraste</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer">
            <FaTextHeight style={{ color: "var(--primary)" }} />
            <span>Aumentar Fonte</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer">
            <FaHandsHelping style={{ color: "var(--primary)" }} />
            <span>Libras</span>
          </div>
        </div>
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

export default AccessibilityModal;
