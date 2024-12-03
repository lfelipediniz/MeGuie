"use client";

import React from 'react';
import {
    Background,
    ReactFlow,
    useNodesState,
    useEdgesState,
    Controls,
    Node,
    Edge,
} from '@xyflow/react';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { FaArrowLeft } from "react-icons/fa6";
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import MaterialsModal from '../../../components/MaterialsModal';
 
import '@xyflow/react/dist/style.css';
import { usePathname, useRouter } from "@/src/navigation";
 
const mockNodes: Node[] = [
    {
        id: '1',
        data: { label: 'Números' },
        position: { x: 250, y: 5 },
        style: {border: '1px solid #42b48c'}
    },
    { 
        id: '2',
        data: { label: 'Álgebra' },
        position: { x: 100, y: 100 },
        style: {border: '1px solid #42b48c'}
    },
    { 
        id: '3', 
        data: { label: 'Geometria' }, 
        position: { x: 400, y: 100 },
        style: {border: '1px solid #FA8F32'}
    },
    { 
        id: '4',
        data: { label: 'Trigonometria' },
        position: { x: 400, y: 200 }
    },
    { 
        id: '5',
        data: { label: 'Probabilidade' },
        position: { x: 100, y: 200 },
        style: {border: '1px solid #42b48c'}
    },
    {
        id: '6',
        data: { label: 'Gráficos' },
        position: { x: 100, y: 300 },
        style: {border: '1px solid #42b48c'}
    },
    { 
        id: '7',
        data: { label: 'Funções' },
        position: { x: 400, y: 300 }
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

const mockVideos = [
    {
        name: "Vídeo 1",
        url: "https://www.youtube.com/embed/McYeq8uRtRQ?si=NVEP1cCTnL152-b6",
    },
    {
        name: "Vídeo 1",
        url: "https://www.youtube.com/embed/McYeq8uRtRQ?si=NVEP1cCTnL152-b6",
    },
]

const mockWebsites = [
    {
      name: "Conteúdo 1",
      url: "https://www.todamateria.com.br/elementos-quimicos/",
    },
    {
      name: "Conteúdo 2",
      url: "https://www.todamateria.com.br/animais-extintos/",
    }
  ];
 
const emptyNode: Node[] = [];
const emptyEdge: Edge[] = [];

const mapNames: Record<string, string> = {
    'biologia': 'Biologia',
    'quimica': 'Química',
    'matematica': 'Matemática',
    'sociologia': 'Sociologia',
    'portugues': 'Português',
    'none': 'Não encontrado',
}; // todo: will be stored in backend !!

export default function Roadmap() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [nodes, setNodes, onNodesChange] = useNodesState(emptyNode);
    const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdge);
    const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
    const [videosUrls, setVideosUrls] = React.useState<{ name: string; url: string }[]>([]);
    const [websitesUrls, setWebsitesUrls] = React.useState<{ name: string; url: string }[]>([]);
    const router = useRouter();
    const pathname = usePathname();
    const title = pathname.split('/').pop() || 'none';

    // todo:
    // render styles conditionally -> will need backend.

    React.useEffect(() => {
        const request = async () => {
            try {
                setLoading(true);
                // todo
                // const res = await axios.get('');
                // setEdges(res.data.edges);
                // setNodes(res.data.nodes);
            } catch (err) {
                console.error(err);
                alert('Erro inesperado ao obter roadmap.');
            } finally {
                setLoading(false);
            }
        }
        // request();
        // currently using mock data
        setNodes(mockNodes);
        setEdges(mockEdges);
        // setTitle(mockTitle);
        setVideosUrls(mockVideos);
        setWebsitesUrls(mockWebsites);
    }, []);

    const handleNodeClick = (event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }

    const handleMenuClose = () => {
        setSelectedNode(null);
    }

    const handleNavigation = () => {
        router.back()
    }

    return (
        <div className="mt-24 mb-5 mx-auto" style={{width: '90vw', height: '80vh'}}>
            {loading ? (
                <div className="transition-opacity duration-500 opacity-100">
                    <LoadingOverlay />
                </div>
            ) 
            :
            <div className="flex flex-col gap-7" style={{width: '100%', height: '100%'}}>
                <div className="flex flex-wrap xs:flex-nowrap justify-center xs:justify-between items-center text-center xs:text-left">
                    <div className="flex items-center mb-5 xs:mb-0">
                        <button 
                            className="h-12 w-12 flex justify-center items-center hover:bg-black/5 rounded-full transition duration-500"
                            onClick={handleNavigation}
                            aria-label="Voltar para Roadmaps"
                        >
                            <FaArrowLeft size={24} color={"var(--marine)"} />
                        </button>
                        <h2 className="ml-3">
                            {mapNames[title]}
                        </h2>
                    </div>
                    <FormControl
                        style={{minWidth: '250px'}} 
                        size="small"
                    >
                        <InputLabel id="legenda-de-cores">
                            Legenda de Cores
                        </InputLabel>
                        <Select
                            labelId="legenda-de-cores"
                            label="Legenda de Cores"
                            id="lista-cores"
                            value=""
                            aria-label="Legenda de Cores"
                        >
                            <MenuItem value="green">
                                <span style={{color: '#42b48c'}}>Verde</span>&nbsp;
                                <span>(Concluído)</span>
                            </MenuItem>
                            <MenuItem value="orange">
                                <span style={{color: '#FA8F32'}}>Laranja</span>&nbsp;
                                <span>(Aprendendo)</span>
                            </MenuItem>
                            <MenuItem value="gray">
                                <span style={{color: 'gray'}}>Cinza</span>&nbsp;
                                <span>(Não Iniciada)</span>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {
                !pathname.includes('matematica') ? (
                    <span className='text-center'>
                        Roadmap em produção!
                    </span> // todo: remove later!
                ) :
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodesConnectable={false}
                    nodesDraggable={false}
                    onNodeClick={handleNodeClick}
                    fitView
                    style={{ backgroundColor: "#F7F9FB" }}
                >
                    <Controls showInteractive={false}/>
                    <Background />
                </ReactFlow>
                }
            </div>
            }
            <MaterialsModal 
                isOpen={selectedNode ? true : false}
                onClose={handleMenuClose}
                title={selectedNode?.data.label as string ?? ''}
                videos={videosUrls}
                websites={websitesUrls}
            />
        </div>
    );
};