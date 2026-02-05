import {useState, useCallback} from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Position,
  Background,
  Controls,
  Handle, getStraightPath, BaseEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';


const initialNodes = [
  {id: 'n1', position: {x: 0, y: 0}, sourceHandle: 'top', type: 'textUpdater', data: {label: 'Node 1'}},
  {id: 'n2', position: {x: 0, y: 200}, sourceHandle: 'top', type: 'textUpdater', data: {label: 'Node 2'}},
];
const initialEdges = [
  {id: 'n1-n2', source: 'n1', sourceHandle: 'b', target: 'n2', type: 'custom-edge',},
  {id: 'n1-n3', source: 'n1', sourceHandle: 'a', target: 'n3', type: 'custom-edge',},
];

export function CustomNode() {

  return (
    <div className="custom-node">
      <Handle
        position={Position.Top}
        type="target"
        id="a"
        style={{
          background: 'none',
          border: 'none',
          width: '12px',
          height: '12px',
          top: '-5px',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="5" fill="white" stroke="#A500DD" stroke-width="2"/>
        </svg>
      </Handle>
      <div className="custom-node__label">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.09009 9.00008C9.32519 8.33175 9.78924 7.76819 10.4 7.40921C11.0108 7.05024 11.729 6.91902 12.4273 7.03879C13.1255 7.15857 13.7589 7.52161 14.2152 8.06361C14.6714 8.60561 14.9211 9.2916 14.9201 10.0001C14.9201 12.0001 11.9201 13.0001 11.9201 13.0001M12 17H12.01M7.9 20C9.80858 20.9791 12.0041 21.2443 14.0909 20.7478C16.1777 20.2514 18.0186 19.0259 19.2818 17.2922C20.545 15.5586 21.1474 13.4308 20.9806 11.2922C20.8137 9.15366 19.8886 7.14502 18.3718 5.62824C16.855 4.11146 14.8464 3.1863 12.7078 3.01946C10.5693 2.85263 8.44147 3.45509 6.70782 4.71829C4.97417 5.98149 3.74869 7.82236 3.25222 9.90916C2.75575 11.996 3.02094 14.1915 4 16.1L2 22L7.9 20Z"
            stroke="#0A0A0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        Question
      </div>
      <div className="custom-node__content">
        What percentage does the plan cover for co-insurance on diagnostic lab services?
      </div>

      <Handle
        position={Position.Bottom}
        id="b"
        type="source"
        style={{
          background: 'none',
          border: 'none',
          width: '12px',
          height: '12px',
          bottom: '6px',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="5" fill="white" stroke="#A500DD" stroke-width="2"/>
        </svg>
      </Handle>
    </div>
  );
}

export function CustomEdge({id, sourceX, sourceY, targetX, targetY}) {
  const modifiedTargetY = targetY + 5;
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY: modifiedTargetY,
  });

  return (
    <>
      <svg style={{position: 'absolute', top: 0, left: 0}}>
        <defs>
          <marker
            className="react-flow__arrowhead"
            id="selected-marker"
            markerWidth="20"
            markerHeight="20"
            viewBox="-10 -10 20 20"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <polyline
              className="arrowclosed"
              style={{
                strokeWidth: 1,
                stroke: '#A500DD',
                fill: '#A500DD',
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
              points="-5,-4 0,0 -5,4 -5,-4"
            />
          </marker>
        </defs>
      </svg>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={'url(#selected-marker)'}
        style={{stroke: '#A500DD', strokeWidth: 2}}
      />
    </>
  );
}

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const nodeTypes = {
    textUpdater: CustomNode,
  };

  const edgeTypes = {
    'custom-edge': CustomEdge,
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const addNode = useCallback(() => {
    setNodes((nodesSnapshot) => {
      const nextIndex = nodesSnapshot.length + 1;
      const nextId = `n${nextIndex}`;

      const prevNode = nodesSnapshot[nodesSnapshot.length - 1];
      const prevId = prevNode?.id;

      const newNode = {
        id: nextId,
        type: 'textUpdater',
        position: {x: 0, y: (nextIndex - 1) * 200},
        data: {label: `Node ${nextIndex}`},

      };

      // connect from the NEW node -> PREVIOUS node
      if (prevId) {
        setEdges((edgesSnapshot) =>
          addEdge(
            {id: `${nextId}-${prevId}`, source: prevId, target: nextId, type: 'custom-edge'},
            edgesSnapshot,
          ),
        );
      }

      return [...nodesSnapshot, newNode];
    });
  }, []);

  const defaultViewport = {x: 0, y: 0, zoom: 1.5};

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <div className="header flex items-center justify-between">
        <h1 className={'logo'}>Workflow Builder</h1>
        <button className={'button'} onClick={addNode} type="button">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.665039 5.33171H9.99837M5.33171 0.665039V9.99837" stroke="#FAFAFA"
                  stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          Add Node
        </button>
      </div>
      <div className="react-flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          defaultViewport={defaultViewport}
          onInit={(reactFlowInstance) => {
            reactFlowInstance.fitView({padding: 1.5});
            reactFlowInstance.zoomTo(0.25); // 100%
          }}
        >
          <Background/>
          <Controls/>
        </ReactFlow>
      </div>
    </div>
  );
}