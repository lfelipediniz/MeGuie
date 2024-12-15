import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";

interface DBNode {
  _id: string;
  name: string;
  description: string;
  contents: any[];
  position: { x: number; y: number };
}

interface DBEdge {
  source: string;
  target: string;
}

interface DBRoadmap {
  _id: string;
  name: string;
  nameSlug: string;
  nodes: DBNode[];
  edges: DBEdge[];
}

interface EditRoadmapModalProps {
  roadmap: DBRoadmap;
  onClose: () => void;
  onSave: () => void;
}

const EditRoadmapModal: React.FC<EditRoadmapModalProps> = ({ roadmap, onClose, onSave }) => {
  const [name, setName] = useState(roadmap.name);
  const [nameSlug, setNameSlug] = useState(roadmap.nameSlug);

  // Inicializar os nós com IDs e posições corretas
  const [nodes, setNodes, onNodesChange] = useNodesState(
    roadmap.nodes.map((node) => ({
      id: node._id,
      data: { label: node.name },
      position: node.position,
    }))
  );

  // Inicializar as conexões com IDs únicos e fontes/destinos corretos
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // Criar um mapa de nomes para IDs
    const nameToIdMap = new Map<string, string>();
    roadmap.nodes.forEach((node) => {
      nameToIdMap.set(node.name, node._id);
    });

    const initialEdges = roadmap.edges.map((edge, index) => ({
      id: `${edge.source}-${edge.target}-${index}`,
      source: nameToIdMap.get(edge.source) || edge.source,
      target: nameToIdMap.get(edge.target) || edge.target,
    }));

    setEdges(initialEdges);
  }, [roadmap.edges, roadmap.nodes]);

  // Função para adicionar uma nova conexão (edge)
  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  // Função para salvar as alterações
  const handleSave = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Token inválido.");
      return;
    }

    try {
      const updatedNodes = nodes.map((node) => ({
        _id: node.id,
        name: node.data.label,
        description: "",
        contents: [],
        position: node.position,
      }));

      const updatedEdges = edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
      }));

      const body = {
        newName: name,
        newNameSlug: nameSlug,
        nodesToRename: updatedNodes.map((node) => ({ nodeId: node._id, newName: node.name })),
        nodesToAdd: updatedNodes.filter((node) => node._id.startsWith("temp_")),
        nodesToDelete: roadmap.nodes
          .filter((node) => !updatedNodes.some((n) => n._id === node._id))
          .map((node) => node._id),
        edgesToAdd: updatedEdges,
      };

      await axios.put(`/api/roadmap/updateRoadmap?id=${roadmap._id}`, body, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      alert("Roadmap atualizado com sucesso!");
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar roadmap:", error);
      alert("Erro ao atualizar roadmap.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-5 rounded shadow w-full max-w-4xl h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Editar Roadmap</h2>

        <label className="block mb-2">
          Nome:
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="block mb-4">
          Slug:
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={nameSlug}
            onChange={(e) => setNameSlug(e.target.value)}
          />
        </label>

        <h3 className="text-lg font-bold mb-2">Editar Conexões</h3>

        <div className="border rounded h-[60vh] mb-4">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoadmapModal;
