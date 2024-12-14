"use client";
import { useEffect, useState, useMemo, FormEvent, useCallback } from "react";
import { useRouter } from "@/src/navigation";
// Removido import do LoadingOverlay
import RoadmapCard from "../../components/RoadmapCard";
import TopicsModal from "../../components/TopicsModal";
import SearchBar from "../../components/SearchBar";
import axios from "axios";

import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type Topic = {
  title: string;
  description: string;
};

interface DBContent {
  type: "vídeo" | "website";
  title: string;
  url: string;
}

interface DBNode {
  name: string;
  description: string;
  contents: DBContent[];
  position: {
    x: number;
    y: number;
  };
}

interface DBEdge {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface DBRoadmap {
  _id: string;
  name: string;
  nameSlug: string;
  imageURL: string;
  imageAlt: string;
  nodes: DBNode[];
  edges: DBEdge[];
}

type RoadmapDisplay = {
  image: string;
  title: string;
  progress: number;
  topics: Topic[];
  isFavorite: boolean;
};

export default function Admin() {
  const router = useRouter();
  const [isTopicsModalOpen, setIsTopicsModalOpen] = useState(false);
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapDisplay[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Modal de criação com etapas
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Campos da etapa 1
  const [name, setName] = useState("");
  const [nameSlug, setNameSlug] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const onConnect = useCallback(
    (params: any) => setEdges((eds: any[]) => addEdge(params, eds)),
    []
  );

  const [nodeName, setNodeName] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [nodeContents, setNodeContents] = useState<DBContent[]>([]);
  const [contentType, setContentType] = useState<"vídeo" | "website">("vídeo");
  const [contentTitle, setContentTitle] = useState("");
  const [contentUrl, setContentUrl] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setIsAdmin(false);
      return;
    }

    axios
      .get("/api/user", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        const user = response.data;
        setIsAdmin(!!user.admin);

        if (user.admin) {
          // Carregar roadmaps do backend
          fetchRoadmaps(authToken);
        }
      })
      .catch((error) => {
        console.error("Erro ao verificar admin:", error);
        setIsAdmin(false);
      });
  }, []);

  const fetchRoadmaps = (authToken: string) => {
    axios
      .get("/api/roadmap", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        const dbRoadmaps: DBRoadmap[] = response.data;
        const converted = dbRoadmaps.map((db) => convertDBRoadmapToDisplay(db));
        setRoadmaps(converted);
      })
      .catch((error) => {
        console.error("Erro ao buscar roadmaps:", error);
      });
  };

  const convertDBRoadmapToDisplay = (db: DBRoadmap): RoadmapDisplay => {
    const topics: Topic[] = db.nodes.map((node) => ({
      title: node.name,
      description: node.description,
    }));

    return {
      image: db.imageURL || "image_generic.png",
      title: db.name,
      progress: 0,
      topics,
      isFavorite: false,
    };
  };

  const toggleFavorite = (index: number) => {
    setRoadmaps((prevRoadmaps) => {
      const newRoadmaps = prevRoadmaps.map((roadmap, i) => {
        if (i === index) {
          return { ...roadmap, isFavorite: !roadmap.isFavorite };
        }
        return roadmap;
      });
      return newRoadmaps;
    });
  };

  function handleBack() {
    router.back();
  }

  const openTopicsModal = () => {
    setIsTopicsModalOpen(true);
  };

  const closeTopicsModal = () => {
    setIsTopicsModalOpen(false);
  };

  function handleOpenTopics(topics: Topic[], event: React.SyntheticEvent) {
    event.stopPropagation();
    setLocalTopics(topics);
    openTopicsModal();
  }

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roadmaps, searchQuery]);

  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl font-bold">
          Você não tem os privilégios para acessar o sistema
        </p>
      </div>
    );
  }

  const CustomNode = ({ id, data }: any) => {
    const { label } = data;
    return (
      <div
        style={{
          background: "white",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid gray",
        }}
      >
        {label}
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: "#555" }}
        />
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: "#555" }}
        />
      </div>
    );
  };

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  // Handler da primeira etapa
  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault();
    // Validações básicas
    if (!name || !nameSlug || !imageURL || !imageAlt) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    setCurrentStep(2);
  };

  // Adicionar um conteúdo ao array de conteúdos do nó
  const addContent = () => {
    if (!contentTitle || !contentUrl) {
      alert("Título e URL do conteúdo são obrigatórios.");
      return;
    }

    const newContent: DBContent = {
      type: contentType,
      title: contentTitle,
      url: contentUrl,
    };
    setNodeContents((prev) => [...prev, newContent]);
    setContentTitle("");
    setContentUrl("");
  };

  // Inserir nó no canvas
  const insertNode = () => {
    if (!nodeName) {
      alert("O nome do nó é obrigatório.");
      return;
    }
    if (nodeContents.length === 0) {
      alert("É necessário inserir pelo menos um conteúdo.");
      return;
    }

    const newNode = {
      id: nodeName, // Usando nodeName como ID
      type: "custom",
      data: {
        label: nodeName,
        name: nodeName,
        description: nodeDescription,
        contents: nodeContents,
      },
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      style: {
        border: "1px solid gray",
        padding: "10px",
        borderRadius: "4px",
        background: "white",
      },
    };
    setNodes((nds) => nds.concat(newNode));

    // Limpar campos do nó
    setNodeName("");
    setNodeDescription("");
    setNodeContents([]);
  };

  // Handler final: criar roadmap
  const handleCreateRoadmap = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Token inválido.");
      return;
    }

    try {
      const convertedNodes = nodes.map((n: any) => ({
        name: n.data.name || n.id, // Agora n.id é nodeName
        description: n.data.description || "",
        contents: n.data.contents || [],
        position: { x: n.position.x, y: n.position.y },
      }));

      const convertedEdges = edges.map((e: any) => ({
        source: e.source, // Deve ser nodeName
        target: e.target, // Deve ser nodeName
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
      }));

      const body = {
        name,
        nameSlug,
        imageURL,
        imageAlt,
        nodes: convertedNodes,
        edges: convertedEdges,
      };

      await axios.post("/api/roadmap", body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Se criar com sucesso, recarrega a lista de roadmaps
      fetchRoadmaps(authToken);
      setIsCreateModalOpen(false);
      setCurrentStep(1);
      setName("");
      setNameSlug("");
      setImageURL("");
      setImageAlt("");
      setNodes([]);
      setEdges([]);
    } catch (error: any) {
      console.error("Erro ao criar roadmap:", error);
      alert(
        "Erro ao criar roadmap: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="mt-16 p-4 md:p-8 bg-[var(--background-secondary)]">
      <div className="w-full h-12 flex justify-between items-center gap-4 mb-4">
        <SearchBar
          onSearch={(query) => {
            setSearchQuery(query);
          }}
          onBack={handleBack}
        />
        <button
          onClick={() => {
            setIsCreateModalOpen(true);
            setCurrentStep(1);
          }}
          className="px-4 py-2 mt-3 rounded-2xl bg-[var(--action)] text-[var(--background)] hover:opacity-90"
        >
          Criar
        </button>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-[var(--dark-blue)] text-xl md:text-2xl font-bold">
          Roadmaps Criados
        </h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredRoadmaps.map((m, index) => (
            <RoadmapCard
              key={m.title + index}
              image={m.image}
              title={m.title}
              progress={m.progress}
              isFavorite={m.isFavorite}
              toggleFavorite={() => toggleFavorite(index)}
              topics={m.topics}
              handleOpenTopics={handleOpenTopics}
            />
          ))}
        </div>
      </div>
      <TopicsModal
        topics={localTopics}
        isOpen={isTopicsModalOpen}
        onClose={closeTopicsModal}
      />

      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-5 rounded shadow w-full max-w-4xl max-h-[90vh] overflow-auto">
            {currentStep === 1 && (
              <form
                onSubmit={handleStep1Submit}
                className="flex flex-col gap-4"
              >
                <h2 className="text-xl font-bold">Criar Roadmap - Etapa 1</h2>
                <label>
                  Nome*:
                  <input
                    type="text"
                    className="border p-1 rounded w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  NameSlug*:
                  <input
                    type="text"
                    className="border p-1 rounded w-full"
                    value={nameSlug}
                    onChange={(e) => setNameSlug(e.target.value)}
                  />
                </label>
                <label>
                  Image URL*:
                  <input
                    type="text"
                    className="border p-1 rounded w-full"
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                  />
                </label>
                <label>
                  Image Alt*:
                  <input
                    type="text"
                    className="border p-1 rounded w-full"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                  />
                </label>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[var(--action)] text-white hover:opacity-90"
                  >
                    Próximo
                  </button>
                </div>
              </form>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Criar Roadmap - Etapa 2</h2>
                <p>
                  Insira os nós e conteúdos. Você pode adicionar quantos nós
                  quiser. Após adicionar, conecte-os na interface abaixo. Ao
                  final, clique em "Concluir Roadmap".
                </p>

                <div className="border p-3 rounded">
                  <h3 className="font-bold">Criar Nó</h3>
                  <label>
                    Nome do Nó*:
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={nodeName}
                      onChange={(e) => setNodeName(e.target.value)}
                    />
                  </label>
                  <label>
                    Descrição do Nó:
                    <textarea
                      className="border p-1 rounded w-full"
                      value={nodeDescription}
                      onChange={(e) => setNodeDescription(e.target.value)}
                    />
                  </label>

                  <h4>Conteúdos do Nó</h4>
                  {nodeContents.length > 0 && (
                    <ul className="list-disc pl-5">
                      {nodeContents.map((c, idx) => (
                        <li key={idx}>
                          {c.type}: {c.title} ({c.url})
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex gap-2">
                    <select
                      value={contentType}
                      onChange={(e) =>
                        setContentType(e.target.value as "vídeo" | "website")
                      }
                      className="border p-1 rounded"
                    >
                      <option value="vídeo">Vídeo</option>
                      <option value="website">Website</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Título do conteúdo"
                      className="border p-1 rounded"
                      value={contentTitle}
                      onChange={(e) => setContentTitle(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="URL do conteúdo"
                      className="border p-1 rounded"
                      value={contentUrl}
                      onChange={(e) => setContentUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={addContent}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={insertNode}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Inserir Nó
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "50vh",
                    border: "1px solid #ccc",
                  }}
                >
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                  >
                    <Controls />
                    <Background />
                  </ReactFlow>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateRoadmap}
                    className="px-4 py-2 rounded-lg bg-[var(--action)] text-white hover:opacity-90"
                  >
                    Concluir Roadmap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
