// src/components/RoadmapCard.tsx

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaRegHeart, FaHeart, FaEdit } from "react-icons/fa"; // Import dos ícones de coração e edição
import { IoChevronForward } from "react-icons/io5";
import { useRouter } from "@/src/navigation";
import axios from "axios";

type Topic = {
  title: string;
  description: string;
};

interface RoadmapCardProps {
  _id: string; // ID único do roadmap
  imageURL: string;
  imageAlt: string;
  title: string;
  topics: Topic[];
  handleOpenTopics: (topics: Topic[], event: React.SyntheticEvent) => void;
  isEditMode?: boolean; // Prop para controlar o Modo Edição
  onEdit?: () => void; // Função para abrir o modal de edição
  nameSlug: string; // Slug do nome do roadmap
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({
  _id,
  imageURL,
  imageAlt,
  title,
  topics,
  handleOpenTopics,
  isEditMode = false,
  onEdit,
  nameSlug,
}) => {
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loadingFavorite, setLoadingFavorite] = useState<boolean>(false);
  const [errorFavorite, setErrorFavorite] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<boolean>(true);
  const [errorProgress, setErrorProgress] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;

      try {
        // Buscar dados do roadmap
        const roadmapResponse = await axios.get(`/api/roadmap/${nameSlug}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const roadmap = roadmapResponse.data;

        // Buscar dados do usuário
        const userResponse = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const user = userResponse.data;

        console.log("Roadmap ID:", _id);
        console.log("Favorite Roadmaps:", user.favoriteRoadmaps);

        // Verificar se o roadmap está nos favoritos do usuário
        const favorite = user.favoriteRoadmaps.some(
          (fav: { _id: string }) => fav._id.toString() === _id.toString()
        );
        setIsFavorite(favorite);

        // Extrair todos os IDs de conteúdos atuais do roadmap
        const currentContentIds = new Set<string>();
        roadmap.nodes.forEach((node: any) => {
          if (node.contents) {
            node.contents.forEach((content: any) => {
              currentContentIds.add(content._id);
            });
          }
        });

        // Calcular o total de conteúdos atuais
        const totalContents = currentContentIds.size;

        // Calcular os conteúdos vistos pelo usuário que ainda existem no roadmap
        let viewedContents = 0;
        if (user.seenContents) {
          const roadmapSeen = user.seenContents.find(
            (entry: any) => entry.roadmapId?._id === _id
          );
          if (roadmapSeen && roadmapSeen.nodes) {
            roadmapSeen.nodes.forEach((node: any) => {
              node.contentIds.forEach((contentId: string) => {
                if (currentContentIds.has(contentId)) {
                  viewedContents += 1;
                }
              });
            });
          }
        }

        // Calcular o progresso
        const calculatedProgress =
          totalContents > 0
            ? Math.round((viewedContents / totalContents) * 100)
            : 0;
        setProgress(calculatedProgress);
      } catch (error: any) {
        console.error("Erro ao buscar dados iniciais:", error);
        if (error.response && error.response.data && error.response.data.message) {
          setErrorProgress(error.response.data.message);
        } else {
          setErrorProgress("Falha ao carregar dados.");
        }
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchInitialData();
  }, [_id, nameSlug]);

  const handleFavorite = async (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    setLoadingFavorite(true);
    setErrorFavorite(null);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setErrorFavorite("Token de autenticação inválido.");
      setLoadingFavorite(false);
      return;
    }

    const action = isFavorite ? "favorite_remove" : "favorite_add";
    try {
      await axios.put(
        "/api/user",
        { userId: 'userIdHere', action, roadmapId: _id },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      // Atualizar estado baseado na ação realizada
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      setErrorFavorite("Falha ao atualizar favorito.");
    } finally {
      setLoadingFavorite(false);
    }
  };  

  function handleClick() {
    if (!isEditMode && nameSlug) {
      router.push(`/pages/roadmap/${nameSlug}`); // Corrigido para a rota correta
    }
  }

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => {
        if (!isEditMode && e.key === "Enter") {
          handleClick();
        }
      }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden h-auto max-w-full cursor-pointer relative"
      aria-label={`Card de ${title}`}
      tabIndex={0} // Acessível por teclado
    >
      {/* Ícone de Edição */}
      {isEditMode && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
          aria-label={`Editar ${title}`}
        >
          <FaEdit size={20} color="black" />
        </button>
      )}

      <Image
        src={imageURL}
        alt={imageAlt}
        unoptimized
        width={1000}
        height={1000}
        className="w-full h-30 md:h-36 object-cover"
      />
      <div className="p-4 md:p-6 flex flex-col gap-4">
        <p className="text-[var(--text-dark-blue)] font-inter text-lg md:text-2xl font-bold text-left">
          {title}
        </p>
        <div
          className="h-2 w-full bg-gray-300 rounded-full"
          aria-label={`Progresso de ${progress}%`}
        >
          {loadingProgress ? (
            <div className="h-full w-full bg-gray-200 animate-pulse rounded-full"></div>
          ) : errorProgress ? (
            <div className="h-full w-full bg-red-200 rounded-full flex items-center justify-center">
              <span className="text-xs text-red-600">Erro</span>
            </div>
          ) : (
            <div
              className={`h-full rounded-full bg-green-500`}
              style={{ width: `${progress}%` }}
            ></div>
          )}
        </div>
        {!loadingProgress && !errorProgress && (
          <p className="text-sm text-gray-600">{progress}% completado</p>
        )}
        <div className="flex justify-between items-center">
          <button
            onClick={(event) =>
              handleOpenTopics(topics, event as React.SyntheticEvent)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleOpenTopics(topics, e as React.SyntheticEvent);
              }
            }}
            className="border border-[var(--gray)] rounded-full p-2 pointer-events-auto flex items-center gap-2 text-[var(--gray)]"
            aria-label="Ver tópicos abordados"
            tabIndex={0}
          >
            Ver tópicos abordados{" "}
            <IoChevronForward size={18} color={"var(--gray)"} />
          </button>

          <button
            onClick={handleFavorite}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                handleFavorite(e);
              }
            }}
            role="button"
            className="pointer-events-auto focus:outline-none"
            aria-label={
              isFavorite
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }
            tabIndex={0}
          >
            {loadingFavorite ? (
              <FaRegHeart size={24} color={"gray"} className="animate-pulse" />
            ) : isFavorite ? (
              <FaHeart size={24} color={"red"} />
            ) : (
              <FaRegHeart size={24} color={"gray"} />
            )}
          </button>
        </div>
        {/* Exibir mensagem de erro ao atualizar favorito */}
        {errorFavorite && (
          <p className="text-xs text-red-500 mt-1">{errorFavorite}</p>
        )}
      </div>
    </div>
  );
};

export default RoadmapCard;
