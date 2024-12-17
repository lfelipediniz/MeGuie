// src/pages/roadmap/[slug].tsx

"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Node,
  Edge,
  NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { FaArrowLeft, FaRegHeart, FaHeart } from "react-icons/fa6";
import { Select, MenuItem, InputLabel, FormControl, IconButton } from "@mui/material";
import MaterialsModal from "../../../components/MaterialsModal";
import TopicsModal from "../../../components/TopicsModal";
import "@xyflow/react/dist/style.css";
import { usePathname, useRouter } from "@/src/navigation";
import axios from "axios";

interface IContent {
  _id: string;
  type: "vídeo" | "website";
  title: string;
  url: string;
}

interface INodeData {
  _id: string;
  name: string;
  description: string;
  contents: IContent[];
  position: {
    x: number;
    y: number;
  };
}

interface IEdgeData {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface IRoadmap {
  _id: string;
  name: string;
  nameSlug: string;
  nodes: INodeData[];
  edges: IEdgeData[];
}

interface IUser {
  _id: string;
  favoriteRoadmaps: string[]; // IDs dos roadmaps favoritos
  seenContents: {
    roadmapId: {
      name: string;
      _id: string;
    }; // Alterado para string
    nodes: {
      nodeId: string;
      contentIds: string[];
    }[];
  }[];
}

export default function RoadmapPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [videosUrls, setVideosUrls] = useState<{ _id: string; name: string; url: string }[]>([]);
  const [websitesUrls, setWebsitesUrls] = useState<{ _id: string; name: string; url: string }[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const slug = pathname ? pathname.split("/").pop() || "none" : "none";

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [roadmapData, setRoadmapData] = useState<IRoadmap | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<INodeData | null>(null);

  const [userData, setUserData] = useState<IUser | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState<boolean>(false);
  const [isTopicsModalOpen, setIsTopicsModalOpen] = useState<boolean>(false);
  const [localTopics, setLocalTopics] = useState<{ title: string; description: string }[]>([]);

  // Função auxiliar para determinar a cor da borda
  const getNodeProgressColor = (
    nodeId: string,
    totalContents: number,
    seenContents: string[] | undefined
  ): string => {
    const seenCount = seenContents ? seenContents.length : 0;

    if (seenCount === 0) {
      return "gray"; // Cinza
    } else if (seenCount > 0 && seenCount < totalContents) {
      return "#FFA500"; // Laranja
    } else if (seenCount === totalContents) {
      return "#42b48c"; // Verde
    }

    return "gray"; // default para segurança
  };

  // Primeiro useEffect: Buscar roadmap e dados do usuário
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setLoading(false);
        return;
      }

      if (!slug || slug === "none") {
        // Tratar como erro se não houver slug válido
        setLoading(false);
        return;
      }

      try {
        // Buscar roadmap e dados do usuário simultaneamente
        const [roadmapResponse, userResponse] = await Promise.all([
          axios.get(`/api/roadmap/${slug}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get("/api/user", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        const roadmap: IRoadmap = roadmapResponse.data;
        setRoadmapData(roadmap);

        const user: IUser = userResponse.data;
        setUserData(user);

        // Verificar se o roadmap está nos favoritos do usuário
        setIsFavorite(user.favoriteRoadmaps.includes(roadmap._id));
      } catch (error) {
        console.error("Erro ao carregar roadmap ou dados do usuário:", error);
        // Opcional: redirecionar para página de erro
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]); // Dependência apenas de slug

  // Segundo useEffect: Processar nodes e edges quando roadmapData ou userData mudar
  useEffect(() => {
    if (!roadmapData || !userData) return;

    const convertedNodes: Node[] = roadmapData.nodes.map((nodeData) => {
      const totalContents = nodeData.contents.length;

      // Encontrar os conteúdos vistos pelo usuário para este nó
      let seenContents: string[] | undefined;

      const roadmapSeen = userData.seenContents?.find(
        (rc) => rc.roadmapId?._id.toString() === roadmapData._id
      );

      if (roadmapSeen) {
        const nodeSeen = roadmapSeen.nodes.find((n) => n.nodeId === nodeData._id);
        if (nodeSeen) {
          // Filtrar contentIds que ainda existem no roadmap atual
          seenContents = nodeSeen.contentIds.filter((cid) =>
            nodeData.contents.some((content) => content._id === cid)
          );
        }
      }

      const viewedContents = seenContents ? seenContents.length : 0;

      // Obter a cor da borda com base no progresso
      const borderColor = getNodeProgressColor(nodeData._id, totalContents, seenContents);

      return {
        id: nodeData._id.toString(),
        type: "custom",
        data: { label: nodeData.name },
        position: { x: nodeData.position.x, y: nodeData.position.y },
        style: { border: `2px solid ${borderColor}` },
      };
    });

    setNodes(convertedNodes);

    const convertedEdges: Edge[] = roadmapData.edges.map((edgeData, index) => ({
      id: `${edgeData.source}-${edgeData.target}-${index}`,
      source: edgeData.source,
      target: edgeData.target,
      sourceHandle: edgeData.sourceHandle,
      targetHandle: edgeData.targetHandle,
    }));

    setEdges(convertedEdges);
  }, [roadmapData, userData]);

  // Função para alternar o estado de favorito
  const toggleFavorite = async () => {
    if (!userData || !roadmapData) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Token de autenticação inválido.");
      return;
    }

    try {
      const action = isFavorite ? "remove" : "add";

      // Atualizar favoriteRoadmaps no backend
      const response = await axios.put(
        "/api/user",
        {
          action,
          roadmapId: roadmapData._id,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Atualizar o estado local com a resposta do backend
      setIsFavorite(response.data.favoriteRoadmaps.includes(roadmapData._id));
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              favoriteRoadmaps: response.data.favoriteRoadmaps,
            }
          : prev
      );
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      alert("Não foi possível atualizar o favorito.");
    }
  };

  // Funções para gerenciar modais
  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    if (!roadmapData) return;

    const nodeData = roadmapData.nodes.find((n) => n._id.toString() === node.id);
    if (nodeData) {
      setSelectedNode(node);
      setSelectedNodeData(nodeData);

      const videos = nodeData.contents
        .filter((c) => c.type === "vídeo")
        .map((c) => ({ _id: c._id.toString(), name: c.title, url: c.url }));

      const websites = nodeData.contents
        .filter((c) => c.type === "website")
        .map((c) => ({ _id: c._id.toString(), name: c.title, url: c.url }));

      setVideosUrls(videos);
      setWebsitesUrls(websites);
      setIsMaterialsModalOpen(true); // Abrir MaterialsModal ao clicar no nó
    } else {
      setSelectedNodeData(null);
      setVideosUrls([]);
      setWebsitesUrls([]);
    }
  };

  const handleMenuClose = () => {
    setSelectedNode(null);
    setSelectedNodeData(null);
    setIsMaterialsModalOpen(false);
  };

  const handleBack = () => {
    router.back();
  };

  const openTopicsModal = () => {
    setIsTopicsModalOpen(true);
  };

  const closeTopicsModal = () => {
    setIsTopicsModalOpen(false);
  };

  const handleOpenTopics = (topics: { title: string; description: string }[], event: React.SyntheticEvent) => {
    event.stopPropagation();
    setLocalTopics(topics);
    openTopicsModal();
  };

  // Definição do CustomNode
  const CustomNode = ({ id, data }: NodeProps) => {
    const { label, style } = data as {
      label: string;
      style?: React.CSSProperties;
    };

    return (
      <div
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const syntheticMouseEvent = {} as React.MouseEvent;
            const nodeObj: Node = { id, data, position: { x: 0, y: 0 } };
            handleNodeClick(syntheticMouseEvent, nodeObj);
          }
        }}
        className="custom-node"
        style={{
          ...style,
          padding: "10px",
          backgroundColor: "transparent",
          cursor: "pointer",
          borderRadius: "4px",
          textAlign: "center",
          position: "relative",
        }}
        onClick={(e) => {
          handleNodeClick(e, { id, data, position: { x: 0, y: 0 } });
        }}
      >
        {label}
        {/* Handles invisíveis */}
        <Handle
          type="target"
          position={Position.Top}
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            opacity: 0,
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            opacity: 0,
          }}
        />
      </div>
    );
  };

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  return (
    <div className="mt-24 mb-5 mx-auto" style={{ width: "90vw", height: "80vh" }}>
      {loading ? (
        <div className="transition-opacity duration-500 opacity-100">
          <LoadingOverlay />
        </div>
      ) : roadmapData ? (
        <div className="flex flex-col gap-7" style={{ width: "100%", height: "100%" }}>
          <div className="flex flex-wrap xs:flex-nowrap justify-center xs:justify-between items-center text-center xs:text-left">
            <div className="flex items-center mb-5 xs:mb-0">
              <button
                className="h-12 w-12 flex justify-center items-center hover:bg-black/5 rounded-full transition duration-500"
                onClick={handleBack}
                aria-label="Voltar para Roadmaps"
              >
                <FaArrowLeft size={24} color={"var(--action)"} />
              </button>
              <h2 className="ml-3">{roadmapData.name}</h2>
            </div>

            <div className="flex items-center gap-2">
              <FormControl sx={{ minWidth: "250px" }} size="small">
                <InputLabel id="legenda-de-cores" sx={{ color: "var(--primary)" }}>
                  Legenda de Cores
                </InputLabel>
                <Select
                  labelId="legenda-de-cores"
                  label="Legenda de Cores"
                  id="lista-cores"
                  value=""
                  aria-label="Legenda de Cores"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--primary) !important",
                    },
                    backgroundColor: "var(--background) !important",
                    color: "var(--primary)",
                    "& .MuiSvgIcon-root": {
                      color: "var(--primary)",
                    },
                  }}
                >
                  <MenuItem value="green">
                    <span style={{ color: "#42b48c" }}>Verde</span>&nbsp;
                    <span>(Concluído)</span>
                  </MenuItem>
                  <MenuItem value="orange">
                    <span style={{ color: "#FFA500" }}>Amarelo</span>&nbsp;
                    <span>(Em progresso)</span>
                  </MenuItem>
                  <MenuItem value="gray">
                    <span style={{ color: "gray" }}>Cinza</span>&nbsp;
                    <span>(Não Iniciada)</span>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodesConnectable={false}
            nodesDraggable={false}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls
              showInteractive={false}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            />
            <Background />
          </ReactFlow>
        </div>
      ) : (
        <p>Roadmap não encontrado.</p>
      )}

      {/* Modal de Materiais */}
      <MaterialsModal
        isOpen={isMaterialsModalOpen}
        onClose={handleMenuClose}
        title={selectedNodeData?.name || ""}
        videos={videosUrls}
        websites={websitesUrls}
        roadmapId={roadmapData?._id}
        nodeId={selectedNodeData?._id}
      />

      {/* Modal de Tópicos */}
      <TopicsModal
        topics={localTopics}
        isOpen={isTopicsModalOpen}
        onClose={closeTopicsModal}
      />
    </div>
  );
}
