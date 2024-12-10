'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';

const MaterialsModal: React.FC<{
  title: string;
  videos?: { name: string; url: string }[];
  websites?: { name: string; url: string }[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ title, videos, websites, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Função para alternar o checkbox
  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Função para prender o foco dentro do modal
  const trapFocus = (e: KeyboardEvent) => {
    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      } else if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      document.addEventListener('keydown', trapFocus);
    } else {
      document.removeEventListener('keydown', trapFocus);
    }

    return () => document.removeEventListener('keydown', trapFocus);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 inset-0 z-50 flex w-screen h-screen bg-black bg-opacity-50" onClick={onClose}>
      <div
        ref={modalRef}
        className="bg-white dark:bg-background-secondary shadow-lg pt-16 w-full h-full md:w-96 absolute right-0 overflow-auto"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-[var(--dark-blue)] text-lg font-bold">Conteúdos sobre {title}</h2>
          <button
            onClick={onClose}
            className="bg-[var(--button-primary)] hover:opacity-90 rounded-full w-8 h-8 flex justify-center items-center"
            aria-label="Fechar modal"
          >
            <IoClose color="#ffffff" size={24} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-[var(--dark-blue)] text-lg font-bold mb-4">Vídeo-aulas no YouTube</h3>
          {videos?.length ? (
            videos.map((video, index) => {
              const videoId = `video-${index}`;
              return (
                <div key={videoId} className="shadow-lg rounded-md overflow-hidden mb-4">
                  <iframe
                    src={video.url}
                    title={video.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    height={200}
                    className="w-full"
                  ></iframe>
                  <div className="p-4 flex justify-between">
                    <h3 className="text-[var(--dark-blue)] text-lg">{video.name}</h3>
                    <input
                      type="checkbox"
                      className="w-6 h-6 cursor-pointer"
                      checked={!!checkedItems[videoId]}
                      onChange={() => handleCheckboxChange(videoId)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCheckboxChange(videoId);
                      }}
                      aria-label={`Marcar vídeo ${video.name} como assistido`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-base text-[var(--dark-blue)]">Não encontramos vídeos para essa matéria.</p>
          )}

          <h3 className="text-[var(--dark-blue)] text-lg font-bold mt-6 mb-4">Sites para estudo</h3>
          {websites?.length ? (
            websites.map((website, index) => {
              const websiteId = `website-${index}`;
              return (
                <a
                  key={websiteId}
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 flex justify-between items-center border-2 border-[var(--light-gray)] mb-4 hover:bg-[var(--dropdown)] transition"
                  aria-label={`Visitar site ${website.name}`}
                >
                  <h3 className="text-[var(--dark-blue)] text-lg">{website.name}</h3>
                  <input
                    type="checkbox"
                    className="w-6 h-6 cursor-pointer"
                    checked={!!checkedItems[websiteId]}
                    onChange={() => handleCheckboxChange(websiteId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheckboxChange(websiteId);
                    }}
                    aria-label={`Marcar site ${website.name} como visitado`}
                  />
                </a>
              );
            })
          ) : (
            <p className="text-base text-[var(--dark-blue)]">Não encontramos sites para essa matéria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialsModal;
