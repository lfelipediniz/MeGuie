// src/components/EditRoadmapModal.tsx

import React, { useState, FormEvent, useEffect, useCallback } from "react";
import axios from "axios";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Handle,
  Position,
  Node,
  Edge,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FaPencilAlt } from "react-icons/fa"; // Import do ícone de lápis

interface DBContent {
  _id: string;
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

interface EditRoadmapModalProps {
  roadmap: DBRoadmap;
  onClose: () => void;
  onSave: () => void; // Callback para recarregar os roadmaps após salvar
}

const EditRoadmapModal: React.FC<EditRoadmapModalProps> = ({
  roadmap,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(roadmap.name);
  const [nameSlug, setNameSlug] = useState(roadmap.nameSlug);
  const [imageURL, setImageURL] = useState(roadmap.imageURL);
  const [imageAlt, setImageAlt] = useState(roadmap.imageAlt);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedNode, setSelectedNode] = useState<DBNode | null>(null);
  const [newContent, setNewContent] = useState<DBContent>({
    _id: '',
    type: 'vídeo',
    title: '',
    url: '',
  });

  // Função personalizada para renderizar os nós no ReactFlow
  const CustomNode = ({ id, data }: any) => {
    const { label } = data;

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Evita que o clique selecione o nó
      const nodeData = roadmap.nodes.find((n) => n._id === id);
      if (nodeData) {
        setSelectedNode(nodeData);
      }
    };

    return (
      <div
        style={{
          position: "relative", // Para posicionar o ícone de edição
          background: "white",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid gray",
          cursor: "pointer",
        }}
      >
        {/* Ícone de Edição */}
        <FaPencilAlt
          onClick={handleEditClick}
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            background: "white",
            borderRadius: "50%",
            border: "1px solid gray",
            padding: "5px",
            cursor: "pointer",
            color: "#555",
          }}
          title="Editar Nó"
        />
        {/* Conteúdo do Nó */}
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

  const nodeTypes = { custom: CustomNode };

  // Inicializar os nós e edges com os dados do roadmap
  useEffect(() => {
    const initializedNodes = roadmap.nodes.map((node) => ({
      id: node._id, // Usando node._id como ID
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

    const initializedEdges = roadmap.edges.map((edge) => ({
      id: edge._id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: "default",
    }));

    setNodes(initializedNodes);
    setEdges(initializedEdges);
  }, [roadmap.nodes, roadmap.edges, setNodes, setEdges]);

  // Handler para seleção de nó (não mais necessário se usamos o ícone de edição)
  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    // Opcional: você pode usar isso para selecionar o nó ao clicar no nó, não apenas no ícone
    // const nodeData = roadmap.nodes.find((n) => n._id === node.id);
    // if (nodeData) {
    //   setSelectedNode(nodeData);
    // }
  };

  // Função para salvar as alterações gerais do roadmap
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Token inválido.");
      setIsSaving(false);
      return;
    }

    try {
      // Preparar os campos gerais para atualização
      const roadmapUpdateFields: Partial<DBRoadmap> = {};

      if (name !== roadmap.name) roadmapUpdateFields.name = name;
      if (nameSlug !== roadmap.nameSlug) roadmapUpdateFields.nameSlug = nameSlug;
      if (imageURL !== roadmap.imageURL) roadmapUpdateFields.imageURL = imageURL;
      if (imageAlt !== roadmap.imageAlt) roadmapUpdateFields.imageAlt = imageAlt;

      // Preparar a estrutura de atualização de nós e conteúdos
      const nodesToUpdate = nodes.map((n: any) => ({
        nodeId: n.id, // Usando _id como nodeId
        contentsToUpdate: (n.data.contents || []).map((content: DBContent) => ({
          contentId: content._id,
          type: content.type,
          title: content.title,
          url: content.url,
        })),
        // contentsToDelete: [], // Se houver deletos globais
      }));

      const updatedData = {
        ...roadmapUpdateFields,
        nodes: nodesToUpdate,
        // edges: updatedEdges, // Se for necessário atualizar as edges
      };

      await axios.put(`/api/roadmap/${roadmap.nameSlug}`, updatedData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      alert("Roadmap atualizado com sucesso.");
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Erro ao atualizar roadmap:", error);
      alert(
        "Erro ao atualizar roadmap: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Função para deletar o roadmap
  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar este roadmap?")) return;

    setIsDeleting(true);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Token inválido.");
      setIsDeleting(false);
      return;
    }

    try {
      await axios.delete(`/api/roadmap/${roadmap.nameSlug}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      alert("Roadmap deletado com sucesso.");
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Erro ao deletar roadmap:", error);
      alert(
        "Erro ao deletar roadmap: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Funções para gerenciar edição de nós e conteúdos

  // Atualizar propriedades do nó selecionado
  const handleNodeChange = (
    field: keyof Omit<DBNode, '_id' | 'contents' | 'position'>,
    value: string
  ) => {
    if (selectedNode) {
      setSelectedNode({
        ...selectedNode,
        [field]: value,
      });
    }
  };

  // Atualizar propriedades de um conteúdo específico
  const handleContentChange = (
    contentId: string,
    field: keyof Omit<DBContent, '_id'>,
    value: string
  ) => {
    if (selectedNode) {
      const updatedContents = selectedNode.contents.map((content) =>
        content._id === contentId ? { ...content, [field]: value } : content
      );
      setSelectedNode({
        ...selectedNode,
        contents: updatedContents,
      });
    }
  };

  // Adicionar um novo conteúdo
  const handleAddContent = () => {
    if (newContent.title.trim() === '' || newContent.url.trim() === '') {
      alert('Título e URL do conteúdo são obrigatórios.');
      return;
    }

    const contentToAdd: DBContent = {
      ...newContent,
      _id: new Date().getTime().toString(), // ID temporário; idealmente, o backend deve gerar
    };

    setSelectedNode({
      ...selectedNode!,
      contents: [...(selectedNode?.contents || []), contentToAdd],
    });

    // Resetar o formulário de novo conteúdo
    setNewContent({
      _id: '',
      type: 'vídeo',
      title: '',
      url: '',
    });
  };

  // Excluir um conteúdo
  const handleContentDelete = (contentId: string) => {
    if (selectedNode) {
      const confirmDelete = confirm('Tem certeza que deseja deletar este conteúdo?');
      if (!confirmDelete) return;

      const updatedContents = selectedNode.contents.filter((content) => content._id !== contentId);
      setSelectedNode({
        ...selectedNode,
        contents: updatedContents,
      });
    }
  };

  // Salvar as alterações do nó para o estado principal e para o backend
  const handleNodeUpdate = async (e: FormEvent, nodeId: string) => {
    e.preventDefault();

    if (!selectedNode) return;

    setIsSaving(true);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Token inválido.");
      setIsSaving(false);
      return;
    }

    try {
      // Preparar as alterações para a API
      const roadmapUpdate = {
        nodes: [
          {
            nodeId: selectedNode._id,
            contentsToUpdate: selectedNode.contents.map((content) => ({
              contentId: content._id,
              type: content.type,
              title: content.title,
              url: content.url,
            })),
            // contentsToDelete: [...], // Adicione IDs de conteúdos a serem deletados, se aplicável
          },
        ],
        // Atualizações gerais podem ser incluídas aqui, se necessário
      };

      await axios.put(`/api/roadmap/${roadmap.nameSlug}`, roadmapUpdate, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      alert("Nó atualizado com sucesso.");

      // Atualizar o estado local dos nós
      const updatedNodes = nodes.map((n: any) => {
        if (n.id === selectedNode._id) { // Usando _id para correspondência
          return {
            ...n,
            data: {
              ...n.data,
              name: selectedNode.name,
              description: selectedNode.description,
              contents: selectedNode.contents,
            },
          };
        }
        return n;
      });

      setNodes(updatedNodes);
      setSelectedNode(null);
      onSave(); // Callback para recarregar os roadmaps, se necessário
    } catch (error: any) {
      console.error("Erro ao atualizar nó:", error);
      alert(
        "Erro ao atualizar nó: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-5 rounded shadow w-full max-w-6xl max-h-[90vh] overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖️
        </button>
        <h2 className="text-2xl font-bold mb-4">Editar Roadmap</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Informações Básicas */}
          <div className="flex flex-col gap-2">
            <label>
              Nome:
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Name Slug:
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={nameSlug}
                onChange={(e) => setNameSlug(e.target.value)}
                required
              />
            </label>
            <label>
              Image URL:
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />
            </label>
            <label>
              Image Alt:
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </label>
          </div>

          {/* ReactFlow para Edição de Nós e Edges */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Editar Nós e Conexões</h3>
            <div
              style={{
                width: "100%",
                height: "60vh",
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
                onNodeClick={onNodeClick} // Opcional: para selecionar o nó ao clicar no nó inteiro
              >
                <Controls />
                <Background />
              </ReactFlow>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Deletar Roadmap
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[var(--action)] text-white hover:opacity-90"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </form>

        {/* Painel de Edição do Nó Selecionado */}
        {selectedNode && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h3 className="text-lg font-semibold mb-2">Editar Nó: {selectedNode.name}</h3>
            <form
              onSubmit={(e) => handleNodeUpdate(e, selectedNode._id)}
              className="flex flex-col gap-4"
            >
              <label>
                Nome:
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  value={selectedNode.name}
                  onChange={(e) => handleNodeChange('name', e.target.value)}
                  required
                />
              </label>
              <label>
                Descrição:
                <textarea
                  className="border p-2 rounded w-full"
                  value={selectedNode.description}
                  onChange={(e) => handleNodeChange('description', e.target.value)}
                />
              </label>
              
              <div className="mt-4">
                <h4 className="text-md font-semibold">Conteúdos</h4>
                {selectedNode.contents.map((content) => (
                  <div key={content._id} className="border p-2 rounded mb-2 bg-white">
                    <label>
                      Tipo:
                      <select
                        value={content.type}
                        onChange={(e) => handleContentChange(content._id, 'type', e.target.value)}
                        className="border p-1 rounded w-full"
                        required
                      >
                        <option value="vídeo">Vídeo</option>
                        <option value="website">Website</option>
                      </select>
                    </label>
                    <label>
                      Título:
                      <input
                        type="text"
                        className="border p-1 rounded w-full"
                        value={content.title}
                        onChange={(e) => handleContentChange(content._id, 'title', e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      URL:
                      <input
                        type="text"
                        className="border p-1 rounded w-full"
                        value={content.url}
                        onChange={(e) => handleContentChange(content._id, 'url', e.target.value)}
                        required
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleContentDelete(content._id)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Excluir Conteúdo
                    </button>
                  </div>
                ))}

                <h4 className="text-md font-semibold mt-4">Adicionar Novo Conteúdo</h4>
                <div className="flex flex-col gap-2">
                  <label>
                    Tipo:
                    <select
                      value={newContent.type}
                      onChange={(e) =>
                        setNewContent({ ...newContent, type: e.target.value as "vídeo" | "website" })
                      }
                      className="border p-1 rounded w-full"
                      required
                    >
                      <option value="vídeo">Vídeo</option>
                      <option value="website">Website</option>
                    </select>
                  </label>
                  <label>
                    Título:
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={newContent.title}
                      onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    URL:
                    <input
                      type="text"
                      className="border p-1 rounded w-full"
                      value={newContent.url}
                      onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                      required
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleAddContent}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Adicionar Conteúdo
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:opacity-90"
                >
                  Salvar Alterações do Nó
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRoadmapModal;
