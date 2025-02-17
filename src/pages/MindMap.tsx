import {
  useCallback,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { PlusCircle, Trash2, RefreshCw, Sun, Moon, Edit, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NodeOptions = ({
  onEdit,
  onAdd,
  onDelete,
  show,
  setNodeColor,
}: {
  onEdit: () => void;
  onAdd: () => void;
  onDelete: () => void;
  show: boolean;
  setNodeColor: (color: string) => void;
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const colors = [
    "rgba(200, 213, 187, 0.8)", // soft green
    "rgba(155, 135, 245, 0.8)", // purple
    "rgba(254, 198, 161, 0.8)", // soft orange
    "rgba(227, 183, 249, 0.8)", // soft purple
    "rgba(173, 216, 230, 0.8)", // light blue
  ];

  const icons = [
    { id: 1, icon: <Edit className="h-3 w-3" />, action: onEdit },
    { id: 2, icon: <PlusCircle className="h-3 w-3" />, action: onAdd },
    { id: 3, icon: <Trash2 className="h-3 w-3" />, action: onDelete },
    { id: 4, icon: <Palette className="h-3 w-3" />, action: () => setShowColorPicker(prev => !prev) },
  ];

  const radius = 30;

  return (
    <>
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
      
      <AnimatePresence>
        {showColorPicker && show && (
          <motion.div 
            className="absolute left-full ml-2 top-0 bg-white/90 p-2 rounded-lg shadow-sm flex gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {colors.map((color, index) => (
              <button
                key={index}
                className="w-6 h-6 rounded-full shadow-sm transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                onClick={() => {
                  setNodeColor(color);
                  setShowColorPicker(false);
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const MindMapContext = createContext<any>(null);

const handleStyle = {
  width: 10,
  height: 10,
  backgroundColor: "#C8D5BB",
  border: "1px solid #9F9EA1",
};

const MindMapNode = ({ id, data }: { id: string; data: any }) => {
  const [showOptions, setShowOptions] = useState(false);
  const {
    editingNodeId,
    setEditingNodeId,
    updateNodeText,
    addChildNode,
    deleteNode,
    nodes,
    updateNodeColor,
  } = useContext(MindMapContext);
  const [nodeWidth, setNodeWidth] = useState(150);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const width = Math.max(150, textRef.current.scrollWidth + 48); // minimum 150px width
      setNodeWidth(width);
    }
  }, [data.label]);

  const handleMouseInteraction = useCallback((show: boolean) => {
    setShowOptions(show);
  }, []);

  return (
    <div
      className="relative cursor-move"
      style={{ width: nodeWidth }}
      onMouseEnter={() => handleMouseInteraction(true)}
      onMouseLeave={() => handleMouseInteraction(false)}
    >
      <div className="relative flex flex-col items-center min-h-[50px]">
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 !bg-nezu-400/80 hover:!bg-nezu-500/90 !border !border-nezumi-300/40"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-2 h-2 !bg-nezu-400/80 hover:!bg-nezu-500/90 !border !border-nezumi-300/40"
        />
        {editingNodeId === id ? (
          <input
            type="text"
            defaultValue={data.label}
            className="w-full px-3 py-2 text-sm bg-transparent text-nezu-500 border-none outline-none text-center"
            onBlur={(e) => updateNodeText(id, e.target.value)}
            autoFocus
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                updateNodeText(id, e.currentTarget.value);
              }
            }}
          />
        ) : (
          <div
            ref={textRef}
            className="w-full px-3 py-2 text-nezu-500 text-sm font-light text-center"
          >
            {data.label}
          </div>
        )}

        <div className="absolute -top-1 -right-1">
          <NodeOptions
            show={showOptions}
            onEdit={() => setEditingNodeId(id)}
            onAdd={() => addChildNode(nodes.find((n) => n.id === id)!)}
            onDelete={() => deleteNode(id)}
            setNodeColor={(color) => updateNodeColor(id, color)}
          />
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  mindMap: MindMapNode,
};

const MindMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setNodes } = useReactFlow();
  const topic = location.state?.topic || "My Topic";
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const initialNodes: Node[] = [
    {
      id: "center",
      type: "mindMap",
      data: { label: topic },
      position: { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        width: 150,
        height: 60,
        backgroundColor: "rgba(200, 213, 187, 0.8)",
        border: "1px solid #C8D5BB",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  ];

  const [nodes, setLocalNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const savedNodes = localStorage.getItem("mindmap-nodes");
    const savedEdges = localStorage.getItem("mindmap-edges");
    const savedTheme = localStorage.getItem("mindmap-theme");

    if (savedNodes && savedEdges) {
      setLocalNodes(JSON.parse(savedNodes));
      setEdges(JSON.parse(savedEdges));
    }
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mindmap-nodes", JSON.stringify(nodes));
    localStorage.setItem("mindmap-edges", JSON.stringify(edges));
    localStorage.setItem("mindmap-theme", JSON.stringify(isDarkMode));
  }, [nodes, edges, isDarkMode]);

  const onConnect = useCallback(
    (params: any) => {
      const connectionExists = edges.some(
        (edge) =>
          edge.source === params.source && edge.target === params.target,
      );

      if (!connectionExists) {
        setEdges((eds) =>
          addEdge(
            {
              ...params,
              type: "bezier",
              style: {
                stroke: "#47585C",
                strokeWidth: 2,
                opacity: 0.8,
              },
              animated: false,
            },
            eds,
          ),
        );
      }
    },
    [edges, setEdges],
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation();
      if (window.confirm("Do you want to remove this connection?")) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
    },
    [setEdges],
  );

  const getNodeColor = (parentNode: Node) => {
    if (parentNode.id === "center") {
      return "rgba(155, 135, 245, 0.9)";
    }

    const colors = [
      "rgba(200, 213, 187, 0.8)",
      "rgba(79, 76, 92, 0.8)",
      "rgba(242, 252, 226, 0.8)",
      "rgba(254, 198, 161, 0.8)",
      "rgba(101, 62, 120, 0.8)",
      "rgba(173, 216, 230, 0.8)",
    ];

    // Use node ID to consistently pick a color
    const colorIndex =
      parseInt(parentNode.id.replace(/\D/g, "")) % colors.length;
    return colors[colorIndex];
  };

  const determineHandlePositions = (
    parentPos: { x: number; y: number },
    childPos: { x: number; y: number },
  ) => {
    const dx = childPos.x - parentPos.x;
    const dy = childPos.y - parentPos.y;

    const parentHandle =
      Math.abs(dy) > Math.abs(dx)
        ? dy > 0
          ? Position.Bottom
          : Position.Top
        : dx > 0
          ? Position.Right
          : Position.Left;

    const childHandle =
      Math.abs(dy) > Math.abs(dx)
        ? dy > 0
          ? Position.Top
          : Position.Bottom
        : dx > 0
          ? Position.Left
          : Position.Right;

    return { parentHandle, childHandle };
  };

  const addChildNode = useCallback(
    (parentNode: Node) => {
      const newId = `node-${nodes.length + 1}`;
      const parentPosition = parentNode.position;
      const distance = 150;

      const position = {
        x: parentPosition.x,
        y: parentPosition.y + distance,
      };

      const { parentHandle, childHandle } = determineHandlePositions(
        parentPosition,
        position,
      );

      const newNode: Node = {
        id: newId,
        type: "mindMap",
        data: { label: "New Idea" },
        position: position,
        sourcePosition: parentHandle,
        targetPosition: childHandle,
        style: {
          width: 150,
          height: 60,
          backgroundColor: getNodeColor({ id: newId }),
          border: "1px solid #9F9EA1",
          borderRadius: "12px",
          padding: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.9,
        },
      };

      const newEdge: Edge = {
        id: `edge-${edges.length + 1}`,
        source: parentNode.id,
        target: newId,
        type: "bezier",
        style: {
          stroke: "#47585C",
          strokeWidth: 2,
          opacity: 0.8,
        },
        animated: false,
      };

      setLocalNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, edges, setLocalNodes, setEdges],
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      if (nodeId === "center") return;
      setLocalNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
    },
    [setLocalNodes, setEdges],
  );

  const handleRestart = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to restart? This will clear your mind map.",
      )
    ) {
      localStorage.removeItem("mindmap-nodes");
      localStorage.removeItem("mindmap-edges");
      navigate("/");
    }
  }, [navigate]);

  const updateNodeText = useCallback(
    (nodeId: string, newText: string) => {
      setLocalNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newText } }
            : node,
        ),
      );
      setEditingNodeId(null);
    },
    [setLocalNodes],
  );

  const updateNodeColor = useCallback(
    (nodeId: string, color: string) => {
      setLocalNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                style: {
                  ...node.style,
                  backgroundColor: color,
                },
              }
            : node
        )
      );
    },
    [setLocalNodes]
  );

  return (
    <div
      className={`w-screen h-screen ${isDarkMode ? "bg-[#221F26]" : "bg-[#f3f3f3]"}`}
    >
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={`${isDarkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/10 hover:bg-black/20 text-black"}`}
          onClick={handleRestart}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`${isDarkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/10 hover:bg-black/20 text-black"}`}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>

      <MindMapContext.Provider
        value={{
          editingNodeId,
          setEditingNodeId,
          updateNodeText,
          addChildNode,
          deleteNode,
          nodes,
          updateNodeColor,
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
          minZoom={0.5}
          maxZoom={2}
          fitView
          className={isDarkMode ? "bg-[#221F26]" : "bg-[#f3f3f3]"}
        >
          <Controls className="bg-white/80 border border-nezumi-300/20 rounded-lg" />
          <MiniMap
            className={
              isDarkMode
                ? "bg-white/10 border border-white/20"
                : "bg-black/5 border border-black/10"
            }
            nodeColor="#C8D5BB"
            maskColor={
              isDarkMode ? "rgba(34, 31, 38, 0.8)" : "rgba(243, 243, 243, 0.8)"
            }
          />
          <Background
            color={isDarkMode ? "#FFFFFF" : "#000000"}
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
      </MindMapContext.Provider>
    </div>
  );
};

export default MindMap;
