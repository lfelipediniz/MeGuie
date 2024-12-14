'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';

interface VideoContent {
  _id: string;
  name: string;
  url: string;
}

interface WebsiteContent {
  _id: string;
  name: string;
  url: string;
}

const MaterialsModal: React.FC<{
  title: string;
  videos?: VideoContent[];
  websites?: WebsiteContent[];
  isOpen: boolean;
  onClose: () => void;
  roadmapId?: string; // Novo campo
  nodeId?: string;    // Novo campo
}> = ({ title, videos, websites, isOpen, onClose, roadmapId, nodeId }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Função para buscar os conteúdos vistos do usuário
  const fetchSeenContents = async () => {
    if (!roadmapId || !nodeId) return;
  
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;
  
    try {
      const response = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
  
      const user = response.data;
      console.log("Dados do usuário:", user);
  
      const seenContents = user.seenContents || [];
  
      const seenForRoadmap = seenContents.find((entry: any) => entry.roadmapId.toString() === roadmapId);
      const seenForNode = seenForRoadmap?.nodes.find((node: any) => node.nodeId.toString() === nodeId);
  
      const initialCheckedItems: Record<string, boolean> = {};
  
      if (seenForNode) {
        seenForNode.contentIds.forEach((contentId: string) => {
          initialCheckedItems[`video-${contentId}`] = true;
          initialCheckedItems[`website-${contentId}`] = true;
        });
      }
  
      setCheckedItems(initialCheckedItems);
    } catch (error) {
      console.error("Erro ao buscar conteúdos vistos:", error);
    }
  };  

  // Chama a função de busca ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      fetchSeenContents();
    }
  }, [isOpen, roadmapId, nodeId]);

  // Função para alternar o checkbox
  const handleCheckboxChange = async (id: string, contentId: string, isChecked: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  
    if (!roadmapId || !nodeId) {
      console.error("roadmapId ou nodeId não definido.");
      return;
    }
  
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.error("Token de autenticação não encontrado.");
      return;
    }
  
    const action = isChecked ? 'remove' : 'add';
  
    console.log("Enviando requisição PUT com:", { action, roadmapId, nodeId, contentId });
  
    try {
      const response = await axios.put(
        '/api/user',
        { action, roadmapId, nodeId, contentId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
  
      console.log("Resposta do backend:", response.data);
    } catch (error) {
      console.error("Erro ao atualizar conteúdos vistos:", error);
    }
  };  

  // Função para converter YouTube URL para embed URL
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Função para verificar se a URL é de um vídeo local suportado
  const isLocalVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/);
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
            className="bg-[var(--text-secondary)] hover:opacity-90 rounded-full w-8 h-8 flex justify-center items-center"
            aria-label="Fechar modal"
          >
            <IoClose color="var(--background-secondary)" size={24} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-[var(--dark-blue)] text-lg font-bold mb-4">Vídeo-aulas</h3>
          {videos?.length ? (
            videos.map((video) => {
              const videoId = `video-${video._id}`;
              const isChecked = !!checkedItems[videoId];
              const embedUrl = getEmbedUrl(video.url);
              const localVideo = isLocalVideo(embedUrl);

              return (
                <div key={videoId} className="shadow-lg rounded-md overflow-hidden mb-4">
                  {localVideo ? (
                    <video controls className="w-full" height={200}>
                      <source src={embedUrl} type={`video/${embedUrl.split('.').pop()}`} />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  ) : (
                    <iframe
                      src={embedUrl}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      height={200}
                      className="w-full"
                    ></iframe>
                  )}
                  <div className="p-4 flex justify-between">
                    <h3 className="text-[var(--dark-blue)] text-lg">{video.name}</h3>
                    <input
                      type="checkbox"
                      className="w-6 h-6 cursor-pointer"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(videoId, video._id, isChecked)}
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
            websites.map((website) => {
              const websiteId = `website-${website._id}`;
              const isChecked = !!checkedItems[websiteId];
              return (
                <div key={websiteId} className="p-4 flex justify-between items-center border-2 border-[var(--light-gray)] mb-4">
                  <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-[var(--dark-blue)] text-lg">
                    {website.name}
                  </a>
                  <input
                    type="checkbox"
                    className="w-6 h-6 cursor-pointer"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(websiteId, website._id, isChecked)}
                  />
                </div>
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
