// src/components/CreateRoadmapModal.tsx

import React, { useState, FormEvent, useCallback } from "react";
import axios from "axios";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Handle,
  Position,
  Background,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid"; // Importando a função v4 do uuid

interface CreateRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoadmapCreated: () => void;
}

type Topic = {
  title: string;
  description: string;
};

interface DBContent {
  _id?: string; // Adicionado para compatibilidade
  type: "vídeo" | "website";
  title: string;
  url: string;
}

interface DBNode {
  _id?: string; // Opcional no frontend, obrigatório no backend
  name: string;
  description: string;
  contents: DBContent[];
  position: {
    x: number;
    y: number;
  };
}

interface DBEdge {
  _id?: string; // Opcional no frontend, obrigatório no backend
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

// Componente CustomNode para o ReactFlow
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

const CreateRoadmapModal: React.FC<CreateRoadmapModalProps> = ({
  isOpen,
  onClose,
  onRoadmapCreated,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Campos da etapa 1
  const [name, setName] = useState("");
  const [nameSlug, setNameSlug] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({ ...params, id: uuidv4() }, eds)),
    []
  );

  const [nodeName, setNodeName] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [nodeContents, setNodeContents] = useState<DBContent[]>([]);
  const [contentType, setContentType] = useState<"vídeo" | "website">("vídeo");
  const [contentTitle, setContentTitle] = useState("");
  const [contentUrl, setContentUrl] = useState("");

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
      _id: uuidv4(), // Gerando ID único para o conteúdo
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

    const newNode: Node = {
      id: uuidv4(), // Gerando ID único para o node
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
      // Mapear nodes para o formato esperado pelo backend
      const convertedNodes: DBNode[] = nodes.map((n: Node) => ({
        _id: n.id, // Usando o id gerado no frontend (string)
        name: n.data.name || n.id,
        description: n.data.description || "",
        contents: n.data.contents || [],
        position: { x: n.position.x, y: n.position.y },
      }));

      // Mapear edges para o formato esperado pelo backend
      const convertedEdges: DBEdge[] = edges.map((e: Edge) => ({
        _id: e.id, // Usando o id gerado no frontend (string)
        source: e.source, // Já é um ID string
        target: e.target, // Já é um ID string
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

      // Se criar com sucesso, chama o callback para atualizar a lista de roadmaps
      onRoadmapCreated();
      onClose();
      // Resetar estados
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

  const nodeTypes = React.useMemo(() => ({ custom: CustomNode }), []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-5 rounded shadow w-full max-w-4xl max-h-[90vh] overflow-auto">
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} className="flex flex-col gap-4">
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
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
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
              Insira os nós e conteúdos. Você pode adicionar quantos nós quiser.
              Após adicionar, conecte-os na interface abaixo. Ao final, clique em
              "Concluir Roadmap".
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
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateRoadmap}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Concluir Roadmap
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRoadmapModal;
