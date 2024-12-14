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
import { FaArrowLeft } from "react-icons/fa6";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import MaterialsModal from "../../../components/MaterialsModal";
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


  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setLoading(false);
      return;
    }

    if (!slug || slug === "none") {
      // Se não tiver slug válido, tratar como erro
      setLoading(false);
      return;
    }

    // Buscar dados do roadmap via slug
    axios.get(`/api/roadmap/${slug}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .then(response => {
      const data: IRoadmap = response.data;
      setRoadmapData(data);

      const convertedEdges: Edge[] = data.edges.map((edgeData, index) => ({
        id: `${edgeData.source}-${edgeData.target}-${index}`,
        source: edgeData.source,
        target: edgeData.target,
        sourceHandle: edgeData.sourceHandle,
        targetHandle: edgeData.targetHandle,
      }));

      const handleUsage = convertedEdges.reduce((acc: Record<string, string[]>, edge) => {
        if (edge.source && edge.sourceHandle) {
          acc[edge.source] = acc[edge.source] || [];
          if (!acc[edge.source].includes(edge.sourceHandle)) {
            acc[edge.source].push(edge.sourceHandle);
          }
        }
        if (edge.target && edge.targetHandle) {
          acc[edge.target] = acc[edge.target] || [];
          if (!acc[edge.target].includes(edge.targetHandle)) {
            acc[edge.target].push(edge.targetHandle);
          }
        }
        return acc;
      }, {});

      const convertedNodes: Node[] = data.nodes.map((nodeData, index) => {
        const borderColor = "gray";
        return {
          id: nodeData.name,
          type: "custom",
          data: {
            label: nodeData.name,
            usedHandles: handleUsage[nodeData.name] || [],
          },
          position: { x: nodeData.position.x, y: nodeData.position.y },
          style: { border: `1px solid ${borderColor}` },
        };
      });

      setNodes(convertedNodes);
      setEdges(convertedEdges);
    })
    .catch(error => {
      console.error("Erro ao carregar roadmap:", error);
      // redirecionar para 404 caso não encontre
      // router.push('/404');
    })
    .finally(() => {
      setLoading(false);
    });
  }, [slug]);

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    if (!roadmapData) return;
  
    const nodeData = roadmapData.nodes.find((n) => n.name === node.data.label);
    if (nodeData) {
      setSelectedNode(node);
      setSelectedNodeData(nodeData);  // Armazena o nodeData corretamente
  
      const videos = nodeData.contents
        .filter((c) => c.type === "vídeo")
        .map((c) => ({ _id: c._id.toString(), name: c.title, url: c.url }));
  
      const websites = nodeData.contents
        .filter((c) => c.type === "website")
        .map((c) => ({ _id: c._id.toString(), name: c.title, url: c.url }));
  
      setVideosUrls(videos);
      setWebsitesUrls(websites);
    } else {
      setSelectedNodeData(null);
      setVideosUrls([]);
      setWebsitesUrls([]);
    }
  };
  
  

  const handleMenuClose = () => {
    setSelectedNode(null);
    setSelectedNodeData(null);
  };  

  const handleNavigation = () => {
    router.back();
  };

  const CustomNode = ({ id, data }: NodeProps) => {
    const { label, style, usedHandles = [] } = data as {
      label: string;
      style?: React.CSSProperties;
      usedHandles: string[];
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
        {usedHandles.includes("topSource") && (
          <Handle
            type="source"
            position={Position.Top}
            id="topSource"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          />
        )}
        {usedHandles.includes("bottomSource") && (
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottomSource"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          />
        )}
        {usedHandles.includes("leftSource") && (
          <Handle
            type="source"
            position={Position.Left}
            id="leftSource"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          />
        )}
        {usedHandles.includes("rightSource") && (
          <Handle
            type="source"
            position={Position.Right}
            id="rightSource"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          />
        )}

        {usedHandles.includes("topTarget") && (
          <Handle
            type="target"
            position={Position.Top}
            id="topTarget"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          />
        )}
        {usedHandles.includes("bottomTarget") && (
          <Handle
            type="target"
            position={Position.Bottom}
            id="bottomTarget"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          />
        )}
        {usedHandles.includes("leftTarget") && (
          <Handle
            type="target"
            position={Position.Left}
            id="leftTarget"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          />
        )}
        {usedHandles.includes("rightTarget") && (
          <Handle
            type="target"
            position={Position.Right}
            id="rightTarget"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          />
        )}
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
      ) : (
        roadmapData ? (
          <div className="flex flex-col gap-7" style={{ width: "100%", height: "100%" }}>
            <div className="flex flex-wrap xs:flex-nowrap justify-center xs:justify-between items-center text-center xs:text-left">
              <div className="flex items-center mb-5 xs:mb-0">
                <button
                  className="h-12 w-12 flex justify-center items-center hover:bg-black/5 rounded-full transition duration-500"
                  onClick={handleNavigation}
                  aria-label="Voltar para Roadmaps"
                >
                  <FaArrowLeft size={24} color={"var(--action)"} />
                </button>
                <h2 className="ml-3">{roadmapData.name}</h2>
              </div>
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
                    <span style={{ color: "#FA8F32" }}>Laranja</span>&nbsp;
                    <span>(Em progresso)</span>
                  </MenuItem>
                  <MenuItem value="gray">
                    <span style={{ color: "gray" }}>Cinza</span>&nbsp;
                    <span>(Não Iniciada)</span>
                  </MenuItem>
                </Select>
              </FormControl>
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
        )
      )}

      <MaterialsModal
        isOpen={!!selectedNode}
        onClose={handleMenuClose}
        title={typeof selectedNode?.data.label === 'string' ? selectedNode.data.label : ""}
        videos={videosUrls}
        websites={websitesUrls}
        roadmapId={roadmapData?._id}  // Passe o ID do roadmap
        nodeId={selectedNodeData?._id}
      />

    </div>
  );
}
