import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';

const RecursionTreeVisualization = ({ 
  treeData, 
  currentStep, 
  algorithmType,
  isVisible = true,
  executionTrace = []
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Get container width for full-width tree
  const getContainerWidth = () => {
    if (containerRef.current) {
      return containerRef.current.offsetWidth - 32; // Account for padding
    }
    return 1200; // Default fallback width
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
          return node.status === 'base' ? 'fill-surface-100 stroke-border-dark' : 'fill-success-100 stroke-success-600';
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
          return node.status === 'base' ? 'fill-text-primary' : 'fill-success-700';
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
    const levelHeight = containerWidth < 640 ? 80 : 100; // Smaller spacing on mobile
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
        const padding = containerWidth < 640 ? 40 : 80; // Smaller padding on mobile
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
  const [positionedData, setPositionedData] = React.useState(null);
  
  React.useEffect(() => {
    if (treeData?.nodes) {
      const result = positionNodesFullWidth(treeData.nodes, treeData.edges);
      setPositionedData(result);
    }
  }, [treeData]);

  // Recalculate positions on window resize
  React.useEffect(() => {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-border gap-3">
        <div className="flex items-center space-x-3">
          <Icon name="GitBranch" size={20} className="text-primary" />
          <h3 className="text-heading-sm text-text-primary">Recursion Tree</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-body-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-100 border border-success-600 rounded"></div>
            <span className="text-text-secondary text-xs sm:text-sm">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-100 border border-primary-600 rounded"></div>
            <span className="text-text-secondary text-xs sm:text-sm">Memoized</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent border border-accent-600 rounded"></div>
            <span className="text-text-secondary text-xs sm:text-sm">Active</span>
          </div>
        </div>
      </div>

      <div className="p-4 overflow-auto" style={{ minHeight: '400px' }}>
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

            const isMobile = currentPositionedData.containerWidth < 640;
            const edgeOffset = isMobile ? 25 : 30;
            
            return (
              <line
                key={`edge-${index}`}
                x1={fromNode.x}
                y1={fromNode.y + edgeOffset}
                x2={toNode.x}
                y2={toNode.y - edgeOffset}
                stroke="var(--color-border-dark)"
                strokeWidth="2"
                className="transition-educational"
              />
            );
          })}

          {/* Render nodes */}
          {currentPositionedData.positioned?.map((node) => {
            const nodeTrace = executionTrace.find(step => step.nodeId === node.id);
            if (!nodeTrace || nodeTrace.step > currentStep) return null;

            const nodeResult = getNodeResult(node);
            const hasResult = nodeResult !== null && nodeResult !== undefined;
            
            // Always show f(n)=result format when result is available
            const displayText = hasResult ? `f(${node.value})=${nodeResult}` : `f(${node.value})`;
            
            const isMobile = currentPositionedData.containerWidth < 640;
            const nodeRadius = isMobile ? 25 : 30;
            const fontSize = isMobile ? 'text-xs' : 'text-sm';
            
            return (
              <g key={node.id} className="transition-educational">
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius}
                  className={`${getNodeColor(node)} stroke-2 transition-educational`}
                />
                
                {/* Function call text */}
                <text
                  x={node.x}
                  y={node.y + (isMobile ? 3 : 5)}
                  textAnchor="middle"
                  className={`${fontSize} font-medium ${getTextColor(node)}`}
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

export default RecursionTreeVisualization;