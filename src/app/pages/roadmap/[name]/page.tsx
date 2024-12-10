'use client';

import React, { useMemo } from 'react';
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
} from '@xyflow/react';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { FaArrowLeft } from "react-icons/fa6";
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import MaterialsModal from '../../../components/MaterialsModal';

import '@xyflow/react/dist/style.css';
import { usePathname, useRouter } from "@/src/navigation";

const mockVideos = [
    {
        name: "Expressões albébricas",
        url: "https://www.youtube.com/embed/8NNA-8rimNs?si=YQbZAqUFA3SehgEo",
    },
    {
        name: "Área de figuras planas",
        url: "https://www.youtube.com/embed/th5k6bzSDTA?si=zWEtDT9wAqadCbFc",
    },
];

const mockWebsites = [
    {
      name: "Elementos químicos",
      url: "https://www.todamateria.com.br/elementos-quimicos/",
    },
    {
      name: "Animais extintos",
      url: "https://www.todamateria.com.br/animais-extintos/",
    }
];

const mockNodes: Node[] = [
    {
        id: '1',
        type: 'custom',
        data: { label: 'Números' },
        position: { x: 250, y: 5 },
        style: { border: '1px solid #42b48c' },
    },
    {
        id: '2',
        type: 'custom',
        data: { label: 'Álgebra' },
        position: { x: 100, y: 100 },
        style: { border: '1px solid #42b48c' },
    },
    {
        id: '3',
        type: 'custom',
        data: { label: 'Geometria' },
        position: { x: 400, y: 100 },
        style: { border: '1px solid #FA8F32' },
    },
    {
        id: '4',
        type: 'custom',
        data: { label: 'Trigonometria' },
        position: { x: 400, y: 200 },
        style: { border: '1px solid gray' },
    },
    {
        id: '5',
        type: 'custom',
        data: { label: 'Probabilidade' },
        position: { x: 100, y: 200 },
        style: { border: '1px solid #42b48c' },
    },
    {
        id: '6',
        type: 'custom',
        data: { label: 'Gráficos' },
        position: { x: 100, y: 300 },
        style: { border: '1px solid gray' },
    },
    {
        id: '7',
        type: 'custom',
        data: { label: 'Funções' },
        position: { x: 400, y: 300 },
        style: { border: '1px solid gray' },
    },
];

const mockEdges: Edge[] = [
    { id: '1-2', source: '1', target: '2' },
    { id: '1-3', source: '1', target: '3' },
    { id: '3-4', source: '3', target: '4' },
    { id: '2-5', source: '2', target: '5' },
    { id: '5-6', source: '5', target: '6' },
    { id: '4-7', source: '4', target: '7' },
];

const mapNames: Record<string, string> = {
    biologia: 'Biologia',
    quimica: 'Química',
    matematica: 'Matemática',
    sociologia: 'Sociologia',
    portugues: 'Português',
    none: 'Não encontrado',
};

export default function Roadmap() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
    const [videosUrls, setVideosUrls] = React.useState<{ name: string; url: string }[]>([]);
    const [websitesUrls, setWebsitesUrls] = React.useState<{ name: string; url: string }[]>([]);
    const [nodes, setNodes, onNodesChange] = useNodesState(mockNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(mockEdges);
    const router = useRouter();
    const pathname = usePathname();
    const title = pathname ? pathname.split('/').pop() || 'none' : 'none';

    React.useEffect(() => {
        // Simula carregamento
        setLoading(false);
        setVideosUrls(mockVideos);
        setWebsitesUrls(mockWebsites);
    }, []);

    const handleNodeClick = (event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    };

    const handleMenuClose = () => {
        setSelectedNode(null);
    };

    const handleNavigation = () => {
        router.back();
    };

    // Definição do componente de nó customizado dentro do Roadmap
    const CustomNode = ({ id, data, style }: NodeProps) => {
        return (
            <div
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        // Simula o clique no nó ao pressionar Enter
                        const syntheticMouseEvent = {} as React.MouseEvent; 
                        const nodeObj: Node = { id, data, position: { x: 0, y: 0 } };
                        handleNodeClick(syntheticMouseEvent, nodeObj);
                    }
                }}
                className="custom-node"
                style={{
                    ...style,
                    padding: '10px',
                    background: '#fff',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    textAlign: 'center',
                }}
            >
                {data.label}
                <Handle type="source" position={Position.Right} />
                <Handle type="target" position={Position.Left} />
            </div>
        );
    };

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

    return (
        <div className="mt-24 mb-5 mx-auto" style={{ width: '90vw', height: '80vh' }}>
            {loading ? (
                <div className="transition-opacity duration-500 opacity-100">
                    <LoadingOverlay />
                </div>
            ) : (
                <div className="flex flex-col gap-7" style={{ width: '100%', height: '100%' }}>
                    <div className="flex flex-wrap xs:flex-nowrap justify-center xs:justify-between items-center text-center xs:text-left">
                        <div className="flex items-center mb-5 xs:mb-0">
                            <button
                                className="h-12 w-12 flex justify-center items-center hover:bg-black/5 rounded-full transition duration-500"
                                onClick={handleNavigation}
                                aria-label="Voltar para Roadmaps"
                            >
                                <FaArrowLeft size={24} color={'var(--action)'} />
                            </button>
                            <h2 className="ml-3">{mapNames[title]}</h2>
                        </div>
                        <FormControl sx={{ minWidth: '250px' }} size="small">
                            <InputLabel id="legenda-de-cores" sx={{ color: 'var(--primary)' }}>
                                Legenda de Cores
                            </InputLabel>
                            <Select
                                labelId="legenda-de-cores"
                                label="Legenda de Cores"
                                id="lista-cores"
                                value=""
                                aria-label="Legenda de Cores"
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'var(--primary) !important',
                                    },
                                    backgroundColor: 'var(--background) !important',
                                    color: 'var(--primary)',
                                    '& .MuiSvgIcon-root': {
                                        color: 'var(--primary)',
                                    },
                                }}
                            >
                                <MenuItem value="green">
                                    <span style={{ color: '#42b48c' }}>Verde</span>&nbsp;
                                    <span>(Concluído)</span>
                                </MenuItem>
                                <MenuItem value="orange">
                                    <span style={{ color: '#FA8F32' }}>Laranja</span>&nbsp;
                                    <span>(Aprendendo)</span>
                                </MenuItem>
                                <MenuItem value="gray">
                                    <span style={{ color: 'gray' }}>Cinza</span>&nbsp;
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
                        style={{ backgroundColor: '#F7F9FB' }}
                    >
                        <Controls showInteractive={false} />
                        <Background />
                    </ReactFlow>
                </div>
            )}

            <MaterialsModal
                isOpen={!!selectedNode}
                onClose={handleMenuClose}
                title={typeof selectedNode?.data.label === 'string' ? selectedNode.data.label : ''}
                videos={videosUrls}
                websites={websitesUrls}
            />
        </div>
    );
}
