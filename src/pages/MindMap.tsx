
import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Position,
  useReactFlow,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PlusCircle, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from 'react-router-dom';

const MindMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setNodes } = useReactFlow();
  const topic = location.state?.topic || 'My Topic';

  // Initialize with center node
  const initialNodes: Node[] = [
    {
      id: 'center',
      type: 'mindMap',
      data: { label: topic },
      position: { x: 0, y: 0 },
      style: {
        width: 150,
        height: 60,
        backgroundColor: 'rgba(200, 213, 187, 0.8)',
        border: '1px solid #C8D5BB',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  ];

  const [nodes, setLocalNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedNodes = localStorage.getItem('mindmap-nodes');
    const savedEdges = localStorage.getItem('mindmap-edges');
    
    if (savedNodes && savedEdges) {
      setLocalNodes(JSON.parse(savedNodes));
      setEdges(JSON.parse(savedEdges));
    }
  }, []);

  // Save to localStorage whenever nodes or edges change
  useEffect(() => {
    localStorage.setItem('mindmap-nodes', JSON.stringify(nodes));
    localStorage.setItem('mindmap-edges', JSON.stringify(edges));
  }, [nodes, edges]);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const addChildNode = useCallback((parentNode: Node) => {
    const newId = `node-${nodes.length + 1}`;
    const parentPosition = parentNode.position;
    const angle = Math.random() * 2 * Math.PI;
    const distance = 200;
    
    const newNode: Node = {
      id: newId,
      type: 'mindMap',
      data: { label: 'New Idea' },
      position: {
        x: parentPosition.x + Math.cos(angle) * distance,
        y: parentPosition.y + Math.sin(angle) * distance,
      },
      style: {
        width: 120,
        height: 50,
        backgroundColor: 'rgba(159, 158, 161, 0.7)',
        border: '1px solid #9F9EA1',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'spawn 0.3s ease-out',
      },
    };

    const newEdge: Edge = {
      id: `edge-${edges.length + 1}`,
      source: parentNode.id,
      target: newId,
      style: { stroke: '#C8D5BB' },
      animated: true,
    };

    setLocalNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  }, [nodes, edges, setLocalNodes, setEdges]);

  const deleteNode = useCallback((nodeId: string) => {
    if (nodeId === 'center') return;
    setLocalNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setLocalNodes, setEdges]);

  const MindMapNode = ({ id, data }: { id: string, data: any }) => (
    <div className="group relative">
      <div className="min-w-[100px] px-4 py-2 text-nezu-500 font-light text-center">
        {data.label}
      </div>
      
      <div className="absolute -right-10 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 bg-white/80 hover:bg-white"
          onClick={() => addChildNode(nodes.find(n => n.id === id)!)}
        >
          <PlusCircle className="h-4 w-4 text-nezu-400" />
        </Button>
        {id !== 'center' && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 bg-white/80 hover:bg-white"
            onClick={() => deleteNode(id)}
          >
            <Trash2 className="h-4 w-4 text-nezu-400" />
          </Button>
        )}
      </div>
    </div>
  );

  const nodeTypes = {
    mindMap: MindMapNode,
  };

  return (
    <div className="w-screen h-screen bg-[#221F26]">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-50 bg-white/10 hover:bg-white/20 text-white"
        onClick={() => {
          localStorage.removeItem('mindmap-nodes');
          localStorage.removeItem('mindmap-edges');
          navigate('/');
        }}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
        minZoom={0.5}
        maxZoom={2}
        fitView
        className="bg-[#221F26]"
      >
        <Controls className="bg-white/80 border border-nezumi-300/20 rounded-lg" />
        <MiniMap 
          className="bg-white/10 border border-white/20 rounded-lg" 
          nodeColor="#C8D5BB"
          maskColor="rgba(34, 31, 38, 0.8)"
        />
        <Background color="#FFFFFF" variant={BackgroundVariant.Dots} />
      </ReactFlow>

      <style>
        {`
          @keyframes spawn {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MindMap;
