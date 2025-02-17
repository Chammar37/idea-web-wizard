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
import { PlusCircle, Trash2, RefreshCw, Sun, Moon, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const NodeOptions = ({ onEdit, onAdd, onDelete, show }: { 
  onEdit: () => void;
  onAdd: () => void;
  onDelete: () => void;
  show: boolean;
}) => {
  const icons = [
    { id: 1, icon: <Edit className="h-3 w-3" />, action: onEdit },
    { id: 2, icon: <PlusCircle className="h-3 w-3" />, action: onAdd },
    { id: 3, icon: <Trash2 className="h-3 w-3" />, action: onDelete },
  ];

  const radius = 30;

  return (
    <AnimatePresence>
      {show && icons.map((item, index) => {
        const angle = (index / (icons.length - 1)) * Math.PI * 0.5;
        const x = Math.cos(angle) * radius;
        const y = -Math.sin(angle) * radius;

        return (
          <motion.button
            key={item.id}
            className="absolute w-6 h-6 bg-white/90 hover:bg-white text-nezu-400 rounded-full flex items-center justify-center shadow-sm"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x, y, opacity: 1 }}
            exit={{ x: 0, y: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            onClick={item.action}
          >
            {item.icon}
          </motion.button>
        );
      })}
    </AnimatePresence>
  );
};

const MindMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setNodes } = useReactFlow();
  const topic = location.state?.topic || 'My Topic';
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

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

  useEffect(() => {
    const savedNodes = localStorage.getItem('mindmap-nodes');
    const savedEdges = localStorage.getItem('mindmap-edges');
    const savedTheme = localStorage.getItem('mindmap-theme');
    
    if (savedNodes && savedEdges) {
      setLocalNodes(JSON.parse(savedNodes));
      setEdges(JSON.parse(savedEdges));
    }
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mindmap-nodes', JSON.stringify(nodes));
    localStorage.setItem('mindmap-edges', JSON.stringify(edges));
    localStorage.setItem('mindmap-theme', JSON.stringify(isDarkMode));
  }, [nodes, edges, isDarkMode]);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const getNodeColor = (parentNode: Node) => {
    const colors = [
      'rgba(200, 213, 187, 0.8)',
      'rgba(155, 135, 245, 0.8)',
      'rgba(242, 252, 226, 0.8)',
      'rgba(254, 198, 161, 0.8)',
      'rgba(227, 183, 249, 0.8)',
      'rgba(173, 216, 230, 0.8)',
    ];

    if (parentNode.id === 'center') return colors[1];

    let currentNode = parentNode;
    let layer = 0;
    while (currentNode) {
      const parentEdge = edges.find(e => e.target === currentNode.id);
      if (!parentEdge) break;
      layer++;
      currentNode = nodes.find(n => n.id === parentEdge.source)!;
    }

    return colors[(layer + 1) % colors.length] || colors[colors.length - 1];
  };

  const addChildNode = useCallback((parentNode: Node) => {
    const newId = `node-${nodes.length + 1}`;
    const parentPosition = parentNode.position;
    const angle = Math.random() * 2 * Math.PI;
    const distance = 200;
    
    const position = {
      x: parentPosition.x + Math.cos(angle) * distance,
      y: parentPosition.y + Math.sin(angle) * distance,
    };
    
    const newNode: Node = {
      id: newId,
      type: 'mindMap',
      data: { label: 'New Idea' },
      position: parentPosition,
      style: {
        width: 120,
        height: 50,
        backgroundColor: getNodeColor(parentNode),
        border: '1px solid #9F9EA1',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
      },
    };

    const newEdge: Edge = {
      id: `edge-${edges.length + 1}`,
      source: parentNode.id,
      target: newId,
      style: { stroke: '#C8D5BB', opacity: 0.8 },
      animated: true,
    };

    setLocalNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);

    setTimeout(() => {
      setLocalNodes((nds) =>
        nds.map((node) =>
          node.id === newId
            ? {
                ...node,
                position,
                style: {
                  ...node.style,
                  transition: 'all 0.5s ease-out',
                },
              }
            : node
        )
      );
    }, 50);
  }, [nodes, edges, setLocalNodes, setEdges]);

  const deleteNode = useCallback((nodeId: string) => {
    if (nodeId === 'center') return;
    setLocalNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setLocalNodes, setEdges]);

  const handleRestart = useCallback(() => {
    if (window.confirm('Are you sure you want to restart? This will clear your mind map.')) {
      localStorage.removeItem('mindmap-nodes');
      localStorage.removeItem('mindmap-edges');
      navigate('/');
    }
  }, [navigate]);

  const updateNodeText = useCallback((nodeId: string, newText: string) => {
    setLocalNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newText } }
          : node
      )
    );
    setEditingNodeId(null);
  }, [setLocalNodes]);

  const MindMapNode = ({ id, data }: { id: string, data: any }) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
      <div 
        className="group relative"
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
      >
        {editingNodeId === id ? (
          <input
            type="text"
            defaultValue={data.label}
            className="w-full px-2 py-1 text-sm bg-transparent text-nezu-500 border-none outline-none"
            onBlur={(e) => updateNodeText(id, e.target.value)}
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                updateNodeText(id, e.currentTarget.value);
              }
            }}
          />
        ) : (
          <div className="min-w-[100px] px-4 py-2 text-nezu-500 font-light text-center cursor-move">
            {data.label}
          </div>
        )}
        
        <div className="absolute -right-8 top-1/2 -translate-y-1/2">
          <NodeOptions 
            show={showOptions}
            onEdit={() => setEditingNodeId(id)}
            onAdd={() => addChildNode(nodes.find(n => n.id === id)!)}
            onDelete={() => id !== 'center' && deleteNode(id)}
          />
        </div>
      </div>
    );
  };

  const nodeTypes = {
    mindMap: MindMapNode,
  };

  return (
    <div className={`w-screen h-screen ${isDarkMode ? 'bg-[#221F26]' : 'bg-[#f3f3f3]'}`}>
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={`${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}
          onClick={handleRestart}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-black'}`}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>

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
        className={isDarkMode ? 'bg-[#221F26]' : 'bg-[#f3f3f3]'}
      >
        <Controls className="bg-white/80 border border-nezumi-300/20 rounded-lg" />
        <MiniMap 
          className={isDarkMode ? 'bg-white/10 border border-white/20' : 'bg-black/5 border border-black/10'} 
          nodeColor="#C8D5BB"
          maskColor={isDarkMode ? "rgba(34, 31, 38, 0.8)" : "rgba(243, 243, 243, 0.8)"}
        />
        <Background 
          color={isDarkMode ? "#FFFFFF" : "#000000"} 
          variant={BackgroundVariant.Dots} 
        />
      </ReactFlow>
    </div>
  );
};

export default MindMap;
