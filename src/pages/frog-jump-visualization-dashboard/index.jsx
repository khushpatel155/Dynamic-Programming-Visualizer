import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ApplicationHeader from '../../components/ui/ApplicationHeader';
import ResponsiveLayoutManager from '../../components/ui/ResponsiveLayoutManager';
import FrogJumpInputPanel from './components/FrogJumpInputPanel';
import FrogJumpTreeVisualization from './components/FrogJumpTreeVisualization';
import FrogJumpTableVisualization from './components/FrogJumpTableVisualization';
import AnimationControlPanel from '../algorithm-visualization-dashboard/components/AnimationControlPanel';
import StepLogPanel from '../algorithm-visualization-dashboard/components/StepLogPanel';
import AlgorithmCodeDisplay from '../../components/ui/AlgorithmCodeDisplay';

const FrogJumpVisualizationDashboard = () => {
  // Core state management
  const [inputValues, setInputValues] = useState([10, 5, 20, 0, 15]);
  const [kValue, setKValue] = useState(2);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('recursive');
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  
  // Visualization data
  const [treeData, setTreeData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [stepLog, setStepLog] = useState([]);
  const [executionTrace, setExecutionTrace] = useState([]);
  
  // UI state
  const [helpOverlayOpen, setHelpOverlayOpen] = useState(false);
  const [stepLogCollapsed, setStepLogCollapsed] = useState(false);

  // Animation interval reference
  const [animationInterval, setAnimationInterval] = useState(null);

  // Speed mapping
  const speedMap = {
    slow: 800,
    normal: 400,
    fast: 200
  };

  // Frog Jump algorithm simulation functions
  const simulateRecursive = (heights, k) => {
    const trace = [];
    const nodes = new Map();
    const edges = [];
    let stepCounter = 0;
    
    const minEnergy = (index, depth = 0, parentId = null) => {
      const nodeId = `minEnergy${index}_${stepCounter++}`;
      const node = {
        id: nodeId,
        index,
        height: heights[index],
        depth,
        x: 0,
        y: 0,
        status: 'pending',
        result: null,
        step: trace.length,
        choice: null
      };
      
      nodes.set(nodeId, node);
      trace.push({
        step: trace.length,
        action: `minEnergy(${index})`,
        description: `Calculate minimum energy to reach step ${index} (height: ${heights[index]})`,
        type: 'function_call',
        nodeId,
        index,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
      
      if (parentId) {
        edges.push({ from: parentId, to: nodeId });
      }
      
      // Base case: starting position
      if (index === 0) {
        const result = 0;
        node.result = result;
        node.status = 'base';
        node.choice = 'none';
        trace.push({
          step: trace.length,
          action: `return ${result}`,
          description: 'Base case: No energy needed to stay at starting position',
          type: 'return',
          nodeId,
          index,
          timestamp: `00:00.${(trace.length + 1) * 100}`
        });
        return result;
      }
      
      // Recursive case: try all possible jumps from previous k steps
      let minCost = Infinity;
      let bestJump = -1;
      
      for (let j = Math.max(0, index - k); j < index; j++) {
        const jumpCost = Math.abs(heights[index] - heights[j]);
        const totalCost = minEnergy(j, depth + 1, nodeId) + jumpCost;
        
        if (totalCost < minCost) {
          minCost = totalCost;
          bestJump = j;
        }
      }
      
      node.result = minCost;
      node.status = 'completed';
      node.choice = bestJump;
      
      trace.push({
        step: trace.length,
        action: `return ${minCost}`,
        description: `At step ${index}: minimum energy = ${minCost} (best jump from step ${bestJump})`,
        type: 'return',
        nodeId,
        index,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
      
      return minCost;
    };
    
    minEnergy(heights.length - 1);
    return { trace, nodes: Array.from(nodes.values()), edges };
  };

  const simulateMemoization = (heights, k) => {
    const trace = [];
    const nodes = new Map();
    const edges = [];
    const memo = new Map();
    let stepCounter = 0;
    
    const minEnergy = (index, depth = 0, parentId = null) => {
      const nodeId = `minEnergy${index}_${stepCounter++}`;
      const node = {
        id: nodeId,
        index,
        height: heights[index],
        depth,
        x: 0,
        y: 0,
        status: 'pending',
        result: null,
        step: trace.length,
        choice: null
      };
      
      nodes.set(nodeId, node);
      trace.push({
        step: trace.length,
        action: `minEnergy(${index})`,
        description: `Calculate minimum energy to reach step ${index} (height: ${heights[index]})`,
        type: 'function_call',
        nodeId,
        index,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
      
      if (parentId) {
        edges.push({ from: parentId, to: nodeId });
      }
      
      // Check memo
      if (memo.has(index)) {
        node.result = memo.get(index);
        node.status = 'memoized';
        trace.push({
          step: trace.length,
          action: `return ${memo.get(index)} (cached)`,
          description: `Cache hit: minEnergy(${index}) = ${memo.get(index)}`,
          type: 'cache_hit',
          nodeId,
          index,
          timestamp: `00:00.${(trace.length + 1) * 100}`
        });
        return memo.get(index);
      }
      
      // Base case: starting position
      if (index === 0) {
        const result = 0;
        node.result = result;
        node.status = 'base';
        node.choice = 'none';
        memo.set(index, result);
        trace.push({
          step: trace.length,
          action: `return ${result}`,
          description: 'Base case: No energy needed to stay at starting position',
          type: 'return',
          nodeId,
          index,
          timestamp: `00:00.${(trace.length + 1) * 100}`
        });
        return result;
      }
      
      // Recursive case: try all possible jumps from previous k steps
      let minCost = Infinity;
      let bestJump = -1;
      
      for (let j = Math.max(0, index - k); j < index; j++) {
        const jumpCost = Math.abs(heights[index] - heights[j]);
        const totalCost = minEnergy(j, depth + 1, nodeId) + jumpCost;
        
        if (totalCost < minCost) {
          minCost = totalCost;
          bestJump = j;
        }
      }
      
      node.result = minCost;
      node.status = 'completed';
      node.choice = bestJump;
      memo.set(index, minCost);
      
      trace.push({
        step: trace.length,
        action: `return ${minCost}`,
        description: `At step ${index}: minimum energy = ${minCost} (best jump from step ${bestJump})`,
        type: 'return',
        nodeId,
        index,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
      
      return minCost;
    };
    
    minEnergy(heights.length - 1);
    return { trace, nodes: Array.from(nodes.values()), edges, memo };
  };

  const simulateTabulation = (heights, k) => {
    const trace = [];
    const n = heights.length;
    const dp = new Array(n).fill(Infinity);
    
    trace.push({
      step: trace.length,
      action: 'Initialize DP table',
      description: `Initialize dp array with ${n} cells, all set to Infinity`,
      type: 'initialization',
      index: -1,
      timestamp: `00:00.${(trace.length + 1) * 100}`
    });
    
    // Set base case: starting position
    dp[0] = 0;
    trace.push({
      step: trace.length,
      action: `dp[0] = 0`,
      description: 'Base case: No energy needed to stay at starting position',
      type: 'initialization',
      index: 0,
      timestamp: `00:00.${(trace.length + 1) * 100}`
    });
    
    // Fill DP table from left to right
    for (let i = 1; i < n; i++) {
      let minCost = Infinity;
      let bestJump = -1;
      
      // Try all possible jumps from previous k steps
      for (let j = Math.max(0, i - k); j < i; j++) {
        const jumpCost = Math.abs(heights[i] - heights[j]);
        const totalCost = dp[j] + jumpCost;
        
        if (totalCost < minCost) {
          minCost = totalCost;
          bestJump = j;
        }
      }
      
      dp[i] = minCost;
      
      trace.push({
        step: trace.length,
        action: `dp[${i}] = min over j ∈ [${Math.max(0, i - k)}, ${i - 1}] of (dp[j] + abs(${heights[i]} - ${heights[bestJump]}))`,
        description: `Step ${i}: minimum energy = ${minCost} (best jump from step ${bestJump})`,
        type: 'computation',
        index: i,
        choice: bestJump,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
    }
    
    return { trace, dp, heights };
  };

  // Position nodes for tree visualization
  const positionNodes = (nodes, edges) => {
    const positioned = nodes.map(node => ({ ...node }));
    
    // Group nodes by depth
    const depths = new Map();
    positioned.forEach(node => {
      if (!depths.has(node.depth)) {
        depths.set(node.depth, []);
      }
      depths.get(node.depth).push(node);
    });
    
    // Position nodes with full width utilization
    const levelHeight = 80;
    
    depths.forEach((nodesAtDepth, depth) => {
      const y = 50 + depth * levelHeight;
      
      if (nodesAtDepth.length === 1) {
        // Single node - center it
        nodesAtDepth[0].x = 400; // Center position
        nodesAtDepth[0].y = y;
      } else {
        // Multiple nodes - distribute across full width
        const spacing = 800 / (nodesAtDepth.length + 1);
        
        nodesAtDepth.forEach((node, index) => {
          node.x = spacing * (index + 1);
          node.y = y;
        });
      }
    });
    
    return positioned;
  };

  // Handle input changes
  const handleInputChange = (values) => {
    setInputValues(values);
    handleReset();
  };

  // Handle k value changes
  const handleKChange = (k) => {
    setKValue(k);
    handleReset();
  };

  // Handle algorithm selection
  const handleAlgorithmChange = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    handleReset();
  };

  // Start calculation and visualization
  const handleCalculate = () => {
    if (!inputValues || inputValues.length === 0 || isCalculating) return;
    
    setIsCalculating(true);
    setCurrentStep(0);
    
    let simulationResult;
    
    try {
      switch (selectedAlgorithm) {
        case 'recursive':
          simulationResult = simulateRecursive(inputValues, kValue);
          break;
        case 'memoization':
          simulationResult = simulateMemoization(inputValues, kValue);
          break;
        case 'tabulation':
          simulationResult = simulateTabulation(inputValues, kValue);
          break;
        default:
          throw new Error('Unknown algorithm');
      }
      
      setExecutionTrace(simulationResult.trace);
      setTotalSteps(simulationResult.trace.length);
      
      if (selectedAlgorithm === 'tabulation') {
        setTableData({ dp: simulationResult.dp, heights: simulationResult.heights });
        setTreeData(null);
      } else {
        const positionedNodes = positionNodes(simulationResult.nodes, simulationResult.edges);
        setTreeData({
          nodes: positionedNodes,
          edges: simulationResult.edges
        });
        setTableData(simulationResult.memo ? { 
          memo: simulationResult.memo, 
          heights: inputValues 
        } : null);
      }
      
      setStepLog(simulationResult.trace);
      
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Update visualization based on current step
  useEffect(() => {
    if (executionTrace.length > 0 && treeData) {
      const updatedNodes = treeData.nodes.map(node => {
        const nodeStep = executionTrace.find(step => step.nodeId === node.id);
        if (!nodeStep) return node;
        
        if (nodeStep.step <= currentStep) {
          const returnStep = executionTrace.find(step => 
            step.nodeId === node.id && step.type === 'return'
          );
          const cacheHitStep = executionTrace.find(step => 
            step.nodeId === node.id && step.type === 'cache_hit'
          );
          
          if (cacheHitStep && cacheHitStep.step <= currentStep) {
            return { ...node, status: 'memoized' };
          } else if (returnStep && returnStep.step <= currentStep) {
            return { ...node, status: 'completed' };
          }
          return { ...node, status: 'active' };
        }
        
        return { ...node, status: 'pending' };
      });
      
      setTreeData(prev => ({ ...prev, nodes: updatedNodes }));
    }
  }, [currentStep, executionTrace]);

  // Animation controls
  const handlePlay = () => {
    if (totalSteps === 0) return;
    
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speedMap[animationSpeed]);
    
    setAnimationInterval(interval);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (animationInterval) {
      clearInterval(animationInterval);
      setAnimationInterval(null);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setExecutionTrace([]);
    setTreeData(null);
    setTableData(null);
    setStepLog([]);
    if (animationInterval) {
      clearInterval(animationInterval);
      setAnimationInterval(null);
    }
  };

  const handleStepForward = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSpeedChange = (speed) => {
    setAnimationSpeed(speed);
    if (isPlaying) {
      handlePause();
      setTimeout(() => handlePlay(), 100);
    }
  };

  // Cleanup animation interval on unmount
  useEffect(() => {
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [animationInterval]);

  // Determine layout based on algorithm
  const showRecursionTree = selectedAlgorithm !== 'tabulation';
  const showDPTable = selectedAlgorithm === 'memoization' || selectedAlgorithm === 'tabulation';

  return (
    <>
      <Helmet>
        <title>Frog Jump with K Distances Visualization Dashboard - DP Visualizer</title>
        <meta name="description" content="Interactive dashboard for visualizing frog jump dynamic programming algorithm through step-by-step demonstrations" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <ApplicationHeader />
        
        <ResponsiveLayoutManager algorithmType={selectedAlgorithm}>
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
              
              {/* Problem Description */}
              <div className="mb-8 bg-surface border border-border rounded-lg shadow-educational p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-heading-lg font-medium text-text-primary mb-3">Frog Jump with K Distances</h2>
                    <p className="text-body-md text-text-secondary">
                      A frog starts from the 0th step and wants to reach the last step. From step i, it can jump to any step j where i &lt; j &le; i + k. The cost of jumping from step i to step j is |heights[i] - heights[j]|. Find the minimum total cost to reach the last step.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-heading-sm font-medium text-text-primary">Example 1</h3>
                      <div className="bg-surface-50 border border-border rounded-lg p-4">
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Input:</strong> heights = [10, 5, 20, 0, 15], k = 2</p>
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Output:</strong> 15</p>
                        <p className="text-body-sm text-text-secondary"><strong>Explanation:</strong> Path: 0 → 2 → 4, Cost: |10-20| + |20-15| = 10 + 5 = 15</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-heading-sm font-medium text-text-primary">Example 2</h3>
                      <div className="bg-surface-50 border border-border rounded-lg p-4">
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Input:</strong> heights = [15, 4, 1, 14, 15], k = 3</p>
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Output:</strong> 2</p>
                        <p className="text-body-sm text-text-secondary"><strong>Explanation:</strong> Path: 0 → 3 → 4, Cost: |15-14| + |14-15| = 1 + 1 = 2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* C++ Code Implementation */}
              <div className="mb-8">
                <AlgorithmCodeDisplay problemType="frog-jump" selectedAlgorithm={selectedAlgorithm} />
              </div>

              {/* Input and Algorithm Selection Panel */}
              <div className="mb-6">
                <FrogJumpInputPanel
                  inputValues={inputValues}
                  kValue={kValue}
                  onInputChange={handleInputChange}
                  onKChange={handleKChange}
                  onCalculate={handleCalculate}
                  isCalculating={isCalculating}
                  selectedAlgorithm={selectedAlgorithm}
                  onAlgorithmChange={handleAlgorithmChange}
                />
              </div>

              {/* Animation Control Panel */}
              <div className="mb-6">
                <AnimationControlPanel
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onReset={handleReset}
                  onStepForward={handleStepForward}
                  onStepBackward={handleStepBackward}
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  animationSpeed={animationSpeed}
                  onSpeedChange={handleSpeedChange}
                  canStepForward={currentStep < totalSteps - 1}
                  canStepBackward={currentStep > 0}
                  isCalculating={isCalculating}
                />
              </div>

              {/* Visualization Panels */}
              <div className="space-y-6">
                
                {/* Recursion Tree - Full Width */}
                {showRecursionTree && (
                  <div className="w-full">
                    <FrogJumpTreeVisualization
                      treeData={treeData}
                      currentStep={currentStep}
                      algorithmType={selectedAlgorithm}
                      isVisible={showRecursionTree}
                      executionTrace={executionTrace}
                      heights={inputValues}
                      k={kValue}
                    />
                  </div>
                )}

                {/* DP Table - Full Width Below Tree */}
                {showDPTable && (
                  <div className="w-full">
                    <FrogJumpTableVisualization
                      tableData={tableData}
                      currentStep={currentStep}
                      algorithmType={selectedAlgorithm}
                      inputValues={inputValues}
                      executionTrace={executionTrace}
                    />
                  </div>
                )}

                {/* Step Log */}
                <div className="w-full">
                  <StepLogPanel
                    stepLog={stepLog}
                    currentStep={currentStep}
                    isCollapsed={stepLogCollapsed}
                    onToggleCollapse={() => setStepLogCollapsed(!stepLogCollapsed)}
                  />
                </div>
              </div>
            </div>
        </ResponsiveLayoutManager>
      </div>
    </>
  );
};

export default FrogJumpVisualizationDashboard; 