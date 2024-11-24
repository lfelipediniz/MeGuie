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
import LoadingOverlay from '../../components/LoadingOverlay';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import MaterialsModal from '../../components/MaterialsModal';
 
import '@xyflow/react/dist/style.css';
 
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

const mockTitle = 'Matemática';

const mockVideos = [
    'aaaa',
    'bbbb',
]

const mockPdfs = [
    'aaaa',
    'bbbb',
]
 
const emptyNode: Node[] = [];
const emptyEdge: Edge[] = [];

export default function Roadmap() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [nodes, setNodes, onNodesChange] = useNodesState(emptyNode);
    const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdge);
    const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
    const [title, setTitle] = React.useState<string>('');
    const [videosUrls, setVideosUrls] = React.useState<string[]>([]);
    const [pdfsUrls, setPdfsUrls] = React.useState<string[]>([]);
 
    // todo:
    // render styles conditionally -> will need backend?

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
        setTitle(mockTitle);
        setVideosUrls(mockVideos);
        setPdfsUrls(mockPdfs);
    }, []);

    const handleNodeClick = (event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }

    const handleMenuClose = () => {
        setSelectedNode(null);
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
                        <ArrowBackIcon />
                        <h2 className="ml-3">{title}</h2>
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
            </div>
            }
            <MaterialsModal 
                isOpen={selectedNode ? true : false}
                onClose={handleMenuClose}
                title={selectedNode?.data.label as string ?? ''}
                videos={videosUrls}
                pdfs={pdfsUrls}
            />
        </div>
    );
};