import React, { useState } from "react";
import axios from "axios";

interface DBRoadmap {
  _id: string;
  name: string;
  nameSlug: string;
  nodes: Array<{ _id: string; name: string; description: string; contents: any[]; position: { x: number; y: number } }>;
  edges: Array<{ source: string; target: string }>;
}

interface EditRoadmapModalProps {
  roadmap: DBRoadmap;
  onClose: () => void;
  onSave: () => void;
}

const EditRoadmapModal: React.FC<EditRoadmapModalProps> = ({ roadmap, onClose, onSave }) => {
  const [name, setName] = useState(roadmap.name);
  const [nameSlug, setNameSlug] = useState(roadmap.nameSlug);
  const [nodes, setNodes] = useState(roadmap.nodes);
  const [edges, setEdges] = useState(roadmap.edges);

  // Função para atualizar o nome do nó
  const updateNodeName = (nodeId: string, newName: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node._id === nodeId ? { ...node, name: newName } : node))
    );
  };

  // Função para adicionar um novo nó
  const addNode = () => {
    const newNode = {
      _id: Date.now().toString(), // ID temporário
      name: "Novo Nó",
      description: "",
      contents: [],
      position: { x: 100, y: 100 },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  // Função para deletar um nó
  const deleteNode = (nodeId: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node._id !== nodeId));
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  // Função para salvar as alterações
  const handleSave = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Token inválido.");
      return;
    }

    try {
      const body = {
        newName: name,
        newNameSlug: nameSlug,
        nodesToRename: nodes.map((node) => ({ nodeId: node._id, newName: node.name })),
        nodesToAdd: nodes.filter((node) => node._id.startsWith("temp_")), // Adiciona apenas nós temporários
        nodesToDelete: roadmap.nodes
          .filter((node) => !nodes.some((n) => n._id === node._id))
          .map((node) => node._id),
        edgesToAdd: edges,
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
      <div className="bg-white p-5 rounded shadow w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Editar Roadmap</h2>

        <label>
          Nome:
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Slug:
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={nameSlug}
            onChange={(e) => setNameSlug(e.target.value)}
          />
        </label>

        <h3 className="text-lg font-bold mt-4">Nós</h3>
        {nodes.map((node) => (
          <div key={node._id} className="flex items-center gap-2">
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={node.name}
              onChange={(e) => updateNodeName(node._id, e.target.value)}
            />
            <button onClick={() => deleteNode(node._id)} className="bg-red-500 text-white p-2 rounded">
              Deletar
            </button>
          </div>
        ))}

        <button onClick={addNode} className="mt-2 bg-green-500 text-white p-2 rounded">
          Adicionar Nó
        </button>

        <div className="flex justify-end gap-2 mt-4">
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
