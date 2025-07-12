import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';

const FrogJumpTreeVisualization = ({ 
  treeData, 
  currentStep, 
  algorithmType, 
  isVisible, 
  executionTrace, 
  heights,
  k
}) => {
  const svgRef = useRef();
  const containerRef = useRef();

  // Get container width for full-width tree
  const getContainerWidth = () => {
    if (containerRef.current) {
      return containerRef.current.offsetWidth - 32; // Account for padding
    }
    return 1200; // Default fallback width
  };

  // Enhanced positioning function for full-width tree
  const positionNodesFullWidth = (nodes, edges) => {
    const positioned = nodes.map(node => ({ ...node }));
    const containerWidth = getContainerWidth();
    
    // Group nodes by depth
    const depths = new Map();
    positioned.forEach(node => {
      if (!depths.has(node.depth)) {
        depths.set(node.depth, []);
      }
      depths.get(node.depth).push(node);
    });
    
    // Calculate SVG height based on depth
    const maxDepth = Math.max(...depths.keys());
    const levelHeight = 100;
    const svgHeight = Math.max(400, (maxDepth + 1) * levelHeight + 100);
    
    // Position nodes with full width utilization
    depths.forEach((nodesAtDepth, depth) => {
      const y = 60 + depth * levelHeight;
      
      if (nodesAtDepth.length === 1) {
        // Single node - center it
        nodesAtDepth[0].x = containerWidth / 2;
        nodesAtDepth[0].y = y;
      } else {
        // Multiple nodes - distribute across full width
        const padding = 80; // Minimum padding from edges
        const availableWidth = containerWidth - (2 * padding);
        const spacing = availableWidth / (nodesAtDepth.length - 1);
        
        nodesAtDepth.forEach((node, index) => {
          node.x = padding + (index * spacing);
          node.y = y;
        });
      }
    });
    
    return { positioned, svgHeight, containerWidth };
  };

  // Update positioning when tree data changes
  const [positionedData, setPositionedData] = useState(null);
  
  useEffect(() => {
    if (treeData?.nodes) {
      const result = positionNodesFullWidth(treeData.nodes, treeData.edges);
      setPositionedData(result);
    }
  }, [treeData]);

  // Recalculate positions on window resize
  useEffect(() => {
    const handleResize = () => {
      if (treeData?.nodes) {
        const result = positionNodesFullWidth(treeData.nodes, treeData.edges);
        setPositionedData(result);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [treeData]);

  const shouldShowEdge = (edge) => {
    if (!executionTrace.length) return false;
    
    const fromTrace = executionTrace.find(step => step.nodeId === edge.from);
    const toTrace = executionTrace.find(step => step.nodeId === edge.to);
    
    return fromTrace && toTrace && 
           fromTrace.step <= currentStep && 
           toTrace.step <= currentStep;
  };

  const getNodeColor = (node) => {
    if (!executionTrace.length) return 'fill-surface stroke-border';
    
    const nodeTrace = executionTrace.find(step => step.nodeId === node.id);
    if (!nodeTrace || nodeTrace.step > currentStep) {
      return 'fill-surface stroke-border';
    }
    
    const returnTrace = executionTrace.find(step => 
      step.nodeId === node.id && 
      (step.type === 'return' || step.type === 'cache_hit') &&
      step.step <= currentStep
    );
    
    if (returnTrace) {
      switch (returnTrace.type) {
        case 'cache_hit':
          return 'fill-primary-100 stroke-primary-600';
        case 'return':
          return 'fill-success-100 stroke-success-600';
        default:
          return 'fill-success-100 stroke-success-600';
      }
    }
    
    return 'fill-accent stroke-accent-600';
  };

  const getTextColor = (node) => {
    if (!executionTrace.length) return 'fill-text-secondary';
    
    const nodeTrace = executionTrace.find(step => step.nodeId === node.id);
    if (!nodeTrace || nodeTrace.step > currentStep) {
      return 'fill-text-secondary';
    }
    
    const returnTrace = executionTrace.find(step => 
      step.nodeId === node.id && 
      (step.type === 'return' || step.type === 'cache_hit') &&
      step.step <= currentStep
    );
    
    if (returnTrace) {
      switch (returnTrace.type) {
        case 'cache_hit':
          return 'fill-primary-700';
        case 'return':
          return 'fill-success-700';
        default:
          return 'fill-success-700';
      }
    }
    
    return 'fill-accent-foreground';
  };

  const getNodeResult = (node) => {
    if (!executionTrace.length) return null;
    
    const nodeTrace = executionTrace.find(step => step.nodeId === node.id);
    if (!nodeTrace || nodeTrace.step > currentStep) return null;
    
    // Only show result when the node has actually returned
    const returnTrace = executionTrace.find(step => 
      step.nodeId === node.id && 
      (step.type === 'return' || step.type === 'cache_hit') &&
      step.step <= currentStep
    );
    
    if (returnTrace && node.result !== null && node.result !== undefined) {
      return node.result;
    }
    
    return null;
  };

  const getEdgeLabel = (edge) => {
    // Check if this edge represents a jump choice
    const fromNode = treeData.nodes.find(n => n.id === edge.from);
    const toNode = treeData.nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return null;
    
    // Determine jump distance and cost
    const jumpDistance = toNode.index - fromNode.index;
    const jumpCost = Math.abs(heights[toNode.index] - heights[fromNode.index]);
    
    return `${jumpDistance} (${jumpCost})`;
  };

  if (!isVisible || !treeData) {
    return (
      <div className="bg-surface border border-border rounded-lg shadow-educational">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="GitBranch" size={20} className="text-primary" />
            <h3 className="text-heading-sm text-text-primary">Recursion Tree</h3>
          </div>
        </div>
        <div className="p-4 flex items-center justify-center" style={{ minHeight: '400px' }}>
          <p className="text-text-secondary">Click "Start Visualization" to see the recursion tree</p>
        </div>
      </div>
    );
  }

  const currentPositionedData = positionedData || { positioned: treeData.nodes, svgHeight: 500, containerWidth: 1200 };

  return (
    <div ref={containerRef} className="bg-surface border border-border rounded-lg shadow-educational">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="GitBranch" size={20} className="text-primary" />
          <h3 className="text-heading-sm text-text-primary">Recursion Tree</h3>
        </div>
        <div className="flex items-center space-x-4 text-body-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-100 border border-success-600 rounded"></div>
            <span className="text-text-secondary">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-100 border border-primary-600 rounded"></div>
            <span className="text-text-secondary">Memoized</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent border border-accent-600 rounded"></div>
            <span className="text-text-secondary">Active</span>
          </div>
        </div>
      </div>

      <div className="p-4 overflow-auto" style={{ minHeight: '400px' }}>
        {/* Heights display */}
        <div className="mb-4 text-center">
          <p className="text-body-md font-medium text-text-primary">
            Heights: [{heights.join(', ')}] | Max Jump: {k}
          </p>
        </div>

        <svg
          ref={svgRef}
          width="100%"
          height={currentPositionedData.svgHeight}
          viewBox={`0 0 ${currentPositionedData.containerWidth} ${currentPositionedData.svgHeight}`}
          className="w-full h-full"
        >
          {/* Render edges */}
          {treeData.edges?.map((edge, index) => {
            const fromNode = currentPositionedData.positioned.find(n => n.id === edge.from);
            const toNode = currentPositionedData.positioned.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode || !shouldShowEdge(edge)) return null;

            const edgeLabel = getEdgeLabel(edge);

            return (
              <g key={`edge-${index}`}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y + 30}
                  x2={toNode.x}
                  y2={toNode.y - 30}
                  stroke="var(--color-border-dark)"
                  strokeWidth="2"
                  className="transition-educational"
                />
                {edgeLabel && (
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2}
                    textAnchor="middle"
                    className="text-xs font-medium fill-primary-600"
                    dy="-5"
                  >
                    {edgeLabel}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render nodes */}
          {currentPositionedData.positioned?.map((node) => {
            const nodeTrace = executionTrace.find(step => step.nodeId === node.id);
            if (!nodeTrace || nodeTrace.step > currentStep) return null;

            const nodeResult = getNodeResult(node);
            const hasResult = nodeResult !== null && nodeResult !== undefined;
            
            // Always show solve(index)=result format when result is available
            const displayText = hasResult ? `solve(${node.index})=${nodeResult}` : `solve(${node.index})`;
            
            return (
              <g key={node.id} className="transition-educational">
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="30"
                  className={`${getNodeColor(node)} stroke-2 transition-educational`}
                />
                
                {/* Function call text */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className={`text-sm font-medium ${getTextColor(node)}`}
                >
                  {displayText}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default FrogJumpTreeVisualization; 