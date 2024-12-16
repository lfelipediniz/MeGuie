// src/components/EditRoadmapModal.tsx

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Handle,
  Position,
  Background,
  Node,
  Edge,
} from "reactflow"; // Certifique-se de que está usando o pacote correto
import "reactflow/dist/style.css";
import { ObjectId } from "bson"; // Importa ObjectId da biblioteca 'bson'
import AvisosModal from "./AvisosModal";

// Interfaces e Tipos
interface EditRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmap: DBRoadmap;
  onSave: () => void;
}

type Aviso = {
  title: string;
  description: string;
};

interface DBContent {
  _id?: string;
  type: "vídeo" | "website";
  title: string;
  url: string;
}

interface DBNode {
  _id: string;
  name: string;
  description: string;
  contents: DBContent[];
  position: {
    x: number;
    y: number;
  };
}

interface DBEdge {
  _id: string;
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

// Tipos Personalizados para Nodes
interface CustomNodeData {
  label: string;
  name: string;
  description: string;
  contents: DBContent[];
}

interface CustomNode extends Node<CustomNodeData> {}

// Componente CustomNode para o ReactFlow
interface CustomNodeProps {
  id: string;
  data: CustomNodeData;
}

const CustomNodeComponent: React.FC<CustomNodeProps> = ({ id, data }) => {
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

const EditRoadmapModal: React.FC<EditRoadmapModalProps> = ({
  isOpen,
  onClose,
  roadmap,
  onSave,
}) => {
  // Estados para os campos principais do Roadmap
  const [name, setName] = useState("");
  const [nameSlug, setNameSlug] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  // Tipos genéricos corrigidos para CustomNode e Edge
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Função para adicionar novas conexões com IDs únicos
  const onConnect = useCallback(
    (params: any) => {
      const newEdge: Edge = {
        ...params,
        id: new ObjectId().toHexString(), // Gera um ObjectId único para a edge
        sourceHandle: params.sourceHandle ?? undefined, // Remove null
        targetHandle: params.targetHandle ?? undefined, // Remove null
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Estados para gerenciamento de seleção e edição de nodes
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [renameNode, setRenameNode] = useState<string>("");

  // Estados para gerenciamento de conteúdos
  const [viewContents, setViewContents] = useState<DBContent[] | null>(null);
  const [editContent, setEditContent] = useState<DBContent | null>(null);
  const [newContent, setNewContent] = useState<DBContent>({
    type: "vídeo",
    title: "",
    url: "",
  });

  // Estados para o AvisosModal
  const [isAvisosModalOpen, setIsAvisosModalOpen] = useState(false);
  const [localAvisos, setLocalAvisos] = useState<Aviso[]>([]);

  // Estados para adicionar novos nodes
  const [nodeName, setNodeName] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [nodeContents, setNodeContents] = useState<DBContent[]>([]);
  const [contentType, setContentType] = useState<"vídeo" | "website">("vídeo");
  const [contentTitle, setContentTitle] = useState("");
  const [contentUrl, setContentUrl] = useState("");

  // Inicializar os campos e ReactFlow com os dados do roadmap
  useEffect(() => {
    if (roadmap) {
      setName(roadmap.name);
      setNameSlug(roadmap.nameSlug);
      setImageURL(roadmap.imageURL);
      setImageAlt(roadmap.imageAlt);

      const initialNodes: CustomNode[] = roadmap.nodes.map((node) => ({
        id: node._id,
        type: "custom",
        data: {
          label: node.name,
          name: node.name,
          description: node.description,
          contents: node.contents,
        },
        position: { x: node.position.x, y: node.position.y },
        style: {
          border: "1px solid gray",
          padding: "10px",
          borderRadius: "4px",
          background: "white",
        },
      }));

      setNodes(initialNodes as unknown as Node<Node<CustomNodeData>, string | undefined>[]);

      const initialEdges: Edge[] = roadmap.edges.map((edge) => ({
        id: edge._id,
        source: edge.source, // Já é um ID string
        target: edge.target, // Já é um ID string
        sourceHandle: edge.sourceHandle ?? undefined, // Remove null
        targetHandle: edge.targetHandle ?? undefined, // Remove null
      }));

      setEdges(initialEdges);
    }
  }, [roadmap, setNodes, setEdges]);

  // Função para selecionar um node
  const handleNodeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nodeId = e.target.value;
    setSelectedNodeId(nodeId);
    if (nodeId) {
      const node = nodes.find((n) => n.id === nodeId);
      setRenameNode(node && typeof (node.data as unknown as CustomNodeData).name === "string" ? (node.data as unknown as CustomNodeData).name : "");
      setViewContents(node && Array.isArray((node.data as unknown as CustomNodeData).contents) ? (node.data as unknown as CustomNodeData).contents : null);
    } else {
      setRenameNode("");
      setViewContents(null);
    }
    setEditContent(null);
  };

  // Função para renomear um node
  const handleRenameNode = () => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNodeId
          ? { ...node, data: { ...node.data, label: renameNode, name: renameNode } }
          : node
      )
    );
  };

  // Função para deletar um conteúdo de um node
  const handleDeleteContent = (contentId: string) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          const updatedContents = (node.data as unknown as CustomNodeData).contents.filter(
            (c: DBContent) => c._id !== contentId
          );
          return { ...node, data: { ...node.data, contents: updatedContents } };
        }
        return node;
      })
    );
    setViewContents((prev) =>
      prev ? prev.filter((c) => c._id !== contentId) : null
    );
  };

  // Função para editar um conteúdo existente
  const handleEditContent = (content: DBContent) => {
    setEditContent(content);
  };

  // Função para salvar as alterações de um conteúdo
  const handleSaveEditContent = () => {
    if (!selectedNodeId || !editContent) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          const updatedContents = (node.data as unknown as CustomNodeData).contents.map((c: DBContent) =>
            c._id === editContent._id ? editContent : c
          );
          return { ...node, data: { ...node.data, contents: updatedContents } };
        }
        return node;
      })
    );
    setViewContents((prev) =>
      prev
        ? prev.map((c) => (c._id === editContent._id ? editContent : c))
        : null
    );
    setEditContent(null);
  };

  // Função para adicionar um novo conteúdo a um node selecionado
  const handleAddContent = () => {
    if (!selectedNodeId) return;
    if (!newContent.title || !newContent.url) {
      showAvisosModal("Erro", "Título e URL do conteúdo são obrigatórios.");
      return;
    }

    const contentWithId: DBContent = {
      _id: new ObjectId().toHexString(), // Gera um ObjectId único para o conteúdo
      ...newContent,
    };

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                contents: [...(node.data as unknown as CustomNodeData).contents, contentWithId],
              },
            }
          : node
      )
    );

    setViewContents((prev) => (prev ? [...prev, contentWithId] : [contentWithId]));
    setNewContent({ type: "vídeo", title: "", url: "" });
  };

  // Funções para o AvisosModal
  const openAvisosModal = () => {
    setIsAvisosModalOpen(true);
  };

  const closeAvisosModal = () => {
    setIsAvisosModalOpen(false);
  };

  const showAvisosModal = (title: string, description: string) => {
    setLocalAvisos([{ title, description }]);
    setIsAvisosModalOpen(true);
  };

  function handleOpenAvisos(avisos: Aviso[], event: React.SyntheticEvent) {
    event.stopPropagation();
    setLocalAvisos(avisos);
    openAvisosModal();
  }

  // Função para inserir um novo node
  const insertNode = () => {
    if (!nodeName) {
      showAvisosModal("Erro", "O nome do nó é obrigatório.");
      return;
    }
    if (nodeContents.length === 0) {
      showAvisosModal("Erro", "É necessário inserir pelo menos um conteúdo.");
      return;
    }

    const newNode: CustomNode = {
      id: new ObjectId().toHexString(), // Gera um ObjectId único para o node
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
    setNodes((nds) => nds.concat(newNode as unknown as Node<Node<CustomNodeData>, string | undefined>));

    // Limpar campos do node
    setNodeName("");
    setNodeDescription("");
    setNodeContents([]);
  };

  // Função para adicionar conteúdo a um novo node antes de inseri-lo
  const addContentToNewNode = () => {
    if (!contentTitle || !contentUrl) {
      showAvisosModal("Erro", "Título e URL do conteúdo são obrigatórios.");
      return;
    }

    const newContent: DBContent = {
      _id: new ObjectId().toHexString(), // Adiciona um ObjectId único
      type: contentType,
      title: contentTitle,
      url: contentUrl,
    };
    setNodeContents((prev) => [...prev, newContent]);
    setContentTitle("");
    setContentUrl("");
  };

  // Função para atualizar o roadmap no backend
  const handleUpdateRoadmap = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      showAvisosModal("Erro", "Token inválido.");
      return;
    }

    try {
      // Mapear nodes para o formato esperado pelo backend
      const convertedNodes: DBNode[] = (nodes as unknown as CustomNode[]).map((n: CustomNode) => ({
        _id: n.id, // Usando o id gerado no frontend (compatível com ObjectId)
        name: n.data.name || n.id,
        description: n.data.description || "",
        contents: n.data.contents.map((content: DBContent) => ({
          _id: content._id || new ObjectId().toHexString(), // Garante que cada conteúdo tenha um _id
          type: content.type,
          title: content.title,
          url: content.url,
        })),
        position: { x: n.position.x, y: n.position.y },
      }));

      // Mapear edges para o formato esperado pelo backend
      const convertedEdges: DBEdge[] = edges.map((e: Edge) => ({
        _id: e.id, // Usando o id gerado no frontend (compatível com ObjectId)
        source: e.source, // Já é um ID string
        target: e.target, // Já é um ID string
        sourceHandle: e.sourceHandle ?? undefined, // Remove null
        targetHandle: e.targetHandle ?? undefined, // Remove null
      }));

      const body = {
        id: roadmap._id,
        name,
        nameSlug,
        imageURL,
        imageAlt,
        nodes: convertedNodes,
        edges: convertedEdges,
      };

      await axios.put("/api/roadmap", body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      showAvisosModal("Sucesso", "Roadmap atualizado com sucesso!");
      // Adiar o fechamento para garantir que o modal apareça
      setTimeout(() => {
        onSave();
        onClose();
      }, 1000); // 1 segundo para exibir o modal de sucesso

    } catch (error: any) {
      console.error("Erro ao atualizar roadmap:", error);
      alert(
        "Erro ao atualizar roadmap: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Definição dos tipos personalizados para o ReactFlow
  const nodeTypes = React.useMemo(() => ({ custom: CustomNodeComponent }), []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-5 rounded shadow w-full max-w-6xl max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Editar Roadmap</h2>
        <form className="flex flex-col gap-4">
          {/* Campos Principais do Roadmap */}
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex-1">
              Nome*:
              <input
                type="text"
                className="border p-1 rounded w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="flex-1">
              NameSlug*:
              <input
                type="text"
                className="border p-1 rounded w-full"
                value={nameSlug}
                onChange={(e) => setNameSlug(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex-1">
              Image URL*:
              <input
                type="text"
                className="border p-1 rounded w-full"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />
            </label>
            <label className="flex-1">
              Image Alt*:
              <input
                type="text"
                className="border p-1 rounded w-full"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </label>
          </div>

          {/* Gerenciamento de Nodes */}
          <div className="border p-3 rounded">
            <h3 className="font-bold mb-2">Gerenciar Nós</h3>
            <label className="block mb-2">
              Selecionar Nó:
              <select
                value={selectedNodeId || ""}
                onChange={handleNodeSelection}
                className="border p-1 rounded w-full mt-1"
              >
                <option value="">-- Selecione um Nó --</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {(node.data as unknown as CustomNodeData).name}
                  </option>
                ))}
              </select>
            </label>

            {selectedNodeId && (
              <div className="mt-4">
                {/* Renomear Nó */}
                <div className="mb-4">
                  <h4 className="font-semibold">Renomear Nó</h4>
                  <input
                    type="text"
                    className="border p-1 rounded w-full mt-1"
                    value={renameNode}
                    onChange={(e) => setRenameNode(e.target.value)}
                    placeholder="Novo nome do nó"
                  />
                  <button
                    type="button"
                    onClick={handleRenameNode}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Salvar Renomeação
                  </button>
                </div>

                {/* Ver e Gerenciar Conteúdos */}
                <div className="mb-4">
                  <h4 className="font-semibold">Conteúdos do Nó</h4>
                  {viewContents && viewContents.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {viewContents.map((content) => (
                        <li key={content._id} className="mb-2">
                          <strong>{content.type}:</strong> {content.title} (
                          <a
                            href={content.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {content.url}
                          </a>
                          )
                          <div className="mt-1 flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditContent(content)}
                              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteContent(content._id!)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Excluir
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Nenhum conteúdo disponível.</p>
                  )}

                  {/* Formulários para Adicionar Novo Conteúdo */}
                  <div className="mt-4">
                    <h5 className="font-semibold">Adicionar Novo Conteúdo</h5>
                    <div className="flex flex-col md:flex-row gap-2 mt-2">
                      <select
                        value={newContent.type}
                        onChange={(e) =>
                          setNewContent((prev) => ({
                            ...prev,
                            type: e.target.value as "vídeo" | "website",
                          }))
                        }
                        className="border p-1 rounded w-full md:w-auto"
                      >
                        <option value="vídeo">Vídeo</option>
                        <option value="website">Website</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Título do conteúdo"
                        className="border p-1 rounded w-full md:flex-1"
                        value={newContent.title}
                        onChange={(e) =>
                          setNewContent((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="text"
                        placeholder="URL do conteúdo"
                        className="border p-1 rounded w-full md:flex-1"
                        value={newContent.url}
                        onChange={(e) =>
                          setNewContent((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        onClick={handleAddContent}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Se o conteúdo para editar estiver selecionado */}
          {editContent && (
            <div className="border p-3 rounded mb-4">
              <h4 className="font-semibold">Editar Conteúdo</h4>
              <label className="block mb-2">
                Tipo:
                <select
                  value={editContent.type}
                  onChange={(e) =>
                    setEditContent((prev) =>
                      prev ? { ...prev, type: e.target.value as "vídeo" | "website" } : prev
                    )
                  }
                  className="border p-1 rounded w-full mt-1"
                >
                  <option value="vídeo">Vídeo</option>
                  <option value="website">Website</option>
                </select>
              </label>
              <label className="block mb-2">
                Título:
                <input
                  type="text"
                  className="border p-1 rounded w-full mt-1"
                  value={editContent.title}
                  onChange={(e) =>
                    setEditContent((prev) =>
                      prev ? { ...prev, title: e.target.value } : prev
                    )
                  }
                />
              </label>
              <label className="block mb-2">
                URL:
                <input
                  type="text"
                  className="border p-1 rounded w-full mt-1"
                  value={editContent.url}
                  onChange={(e) =>
                    setEditContent((prev) =>
                      prev ? { ...prev, url: e.target.value } : prev
                    )
                  }
                />
              </label>
              <button
                type="button"
                onClick={handleSaveEditContent}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Salvar Alterações
              </button>
              <button
                type="button"
                onClick={() => setEditContent(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 ml-2"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Adicionar novos nodes */}
          <div className="border p-3 rounded">
            <h3 className="font-bold">Adicionar Novo Nó</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <label className="flex-1">
                Nome do Nó*:
                <input
                  type="text"
                  className="border p-1 rounded w-full"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                />
              </label>
              <label className="flex-1">
                Descrição do Nó:
                <textarea
                  className="border p-1 rounded w-full"
                  value={nodeDescription}
                  onChange={(e) => setNodeDescription(e.target.value)}
                />
              </label>
            </div>

            <h4 className="font-semibold mt-4">Conteúdos do Nó</h4>
            {nodeContents.length > 0 && (
              <ul className="list-disc pl-5">
                {nodeContents.map((c, idx) => (
                  <li key={idx}>
                    {c.type}: {c.title} ({c.url})
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col md:flex-row gap-2 mt-2">
              <select
                value={contentType}
                onChange={(e) =>
                  setContentType(e.target.value as "vídeo" | "website")
                }
                className="border p-1 rounded w-full md:w-auto"
              >
                <option value="vídeo">Vídeo</option>
                <option value="website">Website</option>
              </select>
              <input
                type="text"
                placeholder="Título do conteúdo"
                className="border p-1 rounded w-full md:flex-1"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="URL do conteúdo"
                className="border p-1 rounded w-full md:flex-1"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
              />
              <button
                type="button"
                onClick={addContentToNewNode}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Adicionar Conteúdo
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={insertNode}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Inserir Nó
              </button>
            </div>
          </div>

          {/* ReactFlow para editar conexões */}
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

          {/* Botões de ação no rodapé */}
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
              onClick={handleUpdateRoadmap}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Salvar Alterações
            </button>
          </div>
        </form>

        <AvisosModal
          messages={localAvisos}
          isOpen={isAvisosModalOpen}
          onClose={closeAvisosModal}
        />
      </div>
    </div>
  );
};

export default EditRoadmapModal;
