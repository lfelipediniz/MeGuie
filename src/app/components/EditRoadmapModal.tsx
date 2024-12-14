// src/components/EditRoadmapModal.tsx

import React, { useState, FormEvent, useEffect, useCallback } from "react";
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
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const onConnect = useCallback(
    (params: any) => setEdges((eds: any[]) => addEdge(params, eds)),
    []
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Função personalizada para renderizar os nós no ReactFlow
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

  const nodeTypes = { custom: CustomNode };

  // Inicializar os nós e edges com os dados do roadmap
  useEffect(() => {
    const initializedNodes = roadmap.nodes.map((node, index) => ({
      id: node.name, // Usando node.name como ID
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

    const initializedEdges = roadmap.edges.map((edge, index) => ({
      id: `e${index}-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: "default",
    }));

    setNodes(initializedNodes);
    setEdges(initializedEdges);
  }, [roadmap.nodes, roadmap.edges, setNodes, setEdges]);

  // Função para salvar as alterações
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
      const updatedNodes = nodes.map((n: any) => ({
        name: n.data.name || n.id,
        description: n.data.description || "",
        contents: n.data.contents || [],
        position: { x: n.position.x, y: n.position.y },
      }));

      const updatedEdges = edges.map((e: any) => ({
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
      }));

      const updatedRoadmap: DBRoadmap = {
        ...roadmap,
        name,
        nameSlug,
        imageURL,
        imageAlt,
        nodes: updatedNodes,
        edges: updatedEdges,
      };

      await axios.put(`/api/roadmap/${roadmap.nameSlug}`, updatedRoadmap, {
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-5 rounded shadow w-full max-w-6xl max-h-[90vh] overflow-auto">
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
      </div>
    </div>
  );
};

export default EditRoadmapModal;
