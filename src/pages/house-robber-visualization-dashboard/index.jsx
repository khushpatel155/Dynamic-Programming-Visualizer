import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

// Import UI components
import ApplicationHeader from '../../components/ui/ApplicationHeader';
import ResponsiveLayoutManager, { VisualizationPanel } from '../../components/ui/ResponsiveLayoutManager';
import ContextualHelpOverlay from '../../components/ui/ContextualHelpOverlay';

// Import page-specific components
import HouseRobberInputPanel from './components/HouseRobberInputPanel';
import AnimationControlPanel from '../algorithm-visualization-dashboard/components/AnimationControlPanel';
import HouseRobberTreeVisualization from './components/HouseRobberTreeVisualization';
import HouseRobberTableVisualization from './components/HouseRobberTableVisualization';
import StepLogPanel from '../algorithm-visualization-dashboard/components/StepLogPanel';
import AlgorithmCodeDisplay from '../../components/ui/AlgorithmCodeDisplay';

const HouseRobberVisualizationDashboard = () => {
  // Core state management
  const [inputValues, setInputValues] = useState([2, 7, 9, 3, 1]);
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

  // House Robber algorithm simulation functions
  const simulateRecursive = (houses) => {
    const trace = [];
    const nodes = new Map();
    const edges = [];
    let stepCounter = 0;
    
    const rob = (index, depth = 0, parentId = null) => {
      if (index >= houses.length) return 0;
      
      const nodeId = `rob${index}_${stepCounter++}`;
      const node = {
        id: nodeId,
        index,
        houses: houses.slice(index),
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
        action: `rob(${index})`,
        description: `Consider houses starting at index ${index}: [${houses.slice(index).join(', ')}]`,
        type: 'function_call',
        nodeId,
        index,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
      
      if (parentId) {
        edges.push({ from: parentId, to: nodeId });
      }
      
      // Base case: last house or beyond
      if (index >= houses.length) {
        const result = 0;
        node.result = result;
        node.status = 'base';
        node.choice = 'none';
        trace.push({
          step: trace.length,
          action: `return ${result}`,
          description: 'Base case: No houses left',
          type: 'return',
          nodeId,
          index,
          timestamp: `00:00.${(trace.length + 1) * 100}`
        });
        return result;
      }
      
      // Base case: last house (can only rob this house)
      if (index === houses.length - 1) {
        const result = houses[index];
        node.result = result;
        node.status = 'base';
        node.choice = 'rob';
        trace.push({
          step: trace.length,
          action: `return ${result}`,
          description: `Base case: Last house ${index} with value ${houses[index]} (no adjacent houses)`,
          type: 'return',
          nodeId,
          index,
          timestamp: `00:00.${(trace.length + 1) * 100}`
        });
        return result;
      }
      
      // Recursive case: rob current house + rob(index + 2) vs skip + rob(index + 1)
      const robCurrent = houses[index] + rob(index + 2, depth + 1, nodeId);
      const skipCurrent = rob(index + 1, depth + 1, nodeId);
      
      const result = Math.max(robCurrent, skipCurrent);
      node.result = result;
      node.status = 'completed';
      node.choice = robCurrent > skipCurrent ? 'rob' : 'skip';
      
      trace.push({
        step: trace.length,
        action: `return ${result}`,
        description: `At index ${index}: rob(${houses[index]} + ${robCurrent - houses[index]}) vs skip(${skipCurrent}) = max(${robCurrent}, ${skipCurrent}) = ${result}`,
        type: 'return',
        nodeId,
        index,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
      
      return result;
    };
    
    rob(0);
    return { trace, nodes: Array.from(nodes.values()), edges };
  };

  const simulateMemoization = (houses) => {
    const trace = [];
    const nodes = new Map();
    const edges = [];
    const memo = new Map();
    let stepCounter = 0;
    
    const rob = (index, depth = 0, parentId = null) => {
      if (index >= houses.length) return 0;
      
      const nodeId = `rob${index}_${stepCounter++}`;
      const node = {
        id: nodeId,
        index,
        houses: houses.slice(index),
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
        action: `rob(${index})`,
        description: `Consider houses starting at index ${index}: [${houses.slice(index).join(', ')}]`,
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
          description: `Cache hit: rob(${index}) = ${memo.get(index)}`,
          type: 'cache_hit',
          nodeId,
          index,
          timestamp: `00:00.${(trace.length + 1) * 100}`
        });
        return memo.get(index);
      }
      
      // Base case: last house or beyond
      if (index >= houses.length) {
        const result = 0;
        node.result = result;
        node.status = 'base';
        node.choice = 'none';
        memo.set(index, result);
        trace.push({
          step: trace.length,
          action: `return ${result}`,
          description: 'Base case: No houses left',
          type: 'return',
          nodeId,
          index,
          timestamp: `00:00.${(trace.length + 1) * 100}`
        });
        return result;
      }
      
      // Base case: last house (can only rob this house)
      if (index === houses.length - 1) {
        const result = houses[index];
        node.result = result;
        node.status = 'base';
        node.choice = 'rob';
        memo.set(index, result);
        trace.push({
          step: trace.length,
          action: `return ${result}`,
          description: `Base case: Last house ${index} with value ${houses[index]} (no adjacent houses)`,
          type: 'return',
          nodeId,
          index,
          timestamp: `00:00.${(trace.length + 1) * 100}`
        });
        return result;
      }
      
      // Recursive case
      const robCurrent = houses[index] + rob(index + 2, depth + 1, nodeId);
      const skipCurrent = rob(index + 1, depth + 1, nodeId);
      
      const result = Math.max(robCurrent, skipCurrent);
      node.result = result;
      node.status = 'completed';
      node.choice = robCurrent > skipCurrent ? 'rob' : 'skip';
      memo.set(index, result);
      
      trace.push({
        step: trace.length,
        action: `return ${result}`,
        description: `At index ${index}: rob(${houses[index]} + ${robCurrent - houses[index]}) vs skip(${skipCurrent}) = max(${robCurrent}, ${skipCurrent}) = ${result}`,
        type: 'return',
        nodeId,
        index,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
      
      return result;
    };
    
    rob(0);
    return { trace, nodes: Array.from(nodes.values()), edges, memo };
  };

  const simulateTabulation = (houses) => {
    const trace = [];
    const n = houses.length;
    const dp = new Array(n).fill(0); // Only n cells needed
    
    trace.push({
      step: trace.length,
      action: 'Initialize DP table',
      description: `Initialize dp array with ${n} cells, all set to 0`,
      type: 'initialization',
      index: -1,
      timestamp: `00:00.${(trace.length + 1) * 100}`
    });
    
    // Set base case: last house
    dp[n - 1] = houses[n - 1];
    trace.push({
      step: trace.length,
      action: `dp[${n - 1}] = ${houses[n - 1]}`,
      description: `Base case: Last house ${n - 1} with value ${houses[n - 1]} (no adjacent houses)`,
      type: 'initialization',
      index: n - 1,
      timestamp: `00:00.${(trace.length + 1) * 100}`
    });
    
    // Fill DP table from right to left (excluding last house which is already set)
    for (let i = n - 2; i >= 0; i--) {
      const robCurrent = houses[i] + (i + 2 < n ? dp[i + 2] : 0);
      const skipCurrent = dp[i + 1];
      dp[i] = Math.max(robCurrent, skipCurrent);
      
      trace.push({
        step: trace.length,
        action: `dp[${i}] = max(${houses[i]} + ${i + 2 < n ? `dp[${i + 2}]` : '0'}, dp[${i + 1}])`,
        description: `House ${i}: rob(${houses[i]} + ${i + 2 < n ? dp[i + 2] : 0}) vs skip(${dp[i + 1]}) = max(${robCurrent}, ${skipCurrent}) = ${dp[i]}`,
        type: 'computation',
        index: i,
        choice: robCurrent > skipCurrent ? 'rob' : 'skip',
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
    }
    
    return { trace, dp, houses };
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
          simulationResult = simulateRecursive(inputValues);
          break;
        case 'memoization':
          simulationResult = simulateMemoization(inputValues);
          break;
        case 'tabulation':
          simulationResult = simulateTabulation(inputValues);
          break;
        default:
          throw new Error('Unknown algorithm');
      }
      
      setExecutionTrace(simulationResult.trace);
      setTotalSteps(simulationResult.trace.length);
      
      if (selectedAlgorithm === 'tabulation') {
        setTableData({ dp: simulationResult.dp, houses: simulationResult.houses });
        setTreeData(null);
      } else {
        const positionedNodes = positionNodes(simulationResult.nodes, simulationResult.edges);
        setTreeData({
          nodes: positionedNodes,
          edges: simulationResult.edges
        });
        setTableData(simulationResult.memo ? { 
          memo: simulationResult.memo, 
          houses: inputValues 
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
        <title>House Robber Visualization Dashboard - DP Visualizer</title>
        <meta name="description" content="Interactive dashboard for visualizing house robber dynamic programming algorithm through step-by-step demonstrations" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <ApplicationHeader />
        
        <ResponsiveLayoutManager algorithmType={selectedAlgorithm}>
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
              
              {/* Problem Description */}
              <div className="mb-8 bg-surface border border-border rounded-lg shadow-educational p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-heading-lg font-medium text-text-primary mb-3">House Robber</h2>
                    <p className="text-body-md text-text-secondary">
                      Given an array of house values, find the maximum amount of money you can rob without robbing two adjacent houses. Each house contains a non-negative amount of money.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-heading-sm font-medium text-text-primary">Example 1</h3>
                      <div className="bg-surface-50 border border-border rounded-lg p-4">
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Input:</strong> [2, 7, 9, 3, 1]</p>
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Output:</strong> 12</p>
                        <p className="text-body-sm text-text-secondary"><strong>Explanation:</strong> Rob houses 0, 2, 4: 2 + 9 + 1 = 12</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-heading-sm font-medium text-text-primary">Example 2</h3>
                      <div className="bg-surface-50 border border-border rounded-lg p-4">
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Input:</strong> [5, 5, 5, 5, 5]</p>
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Output:</strong> 15</p>
                        <p className="text-body-sm text-text-secondary"><strong>Explanation:</strong> Rob houses 0, 2, 4: 5 + 5 + 5 = 15</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* C++ Code Implementation */}
              <div className="mb-8">
                <AlgorithmCodeDisplay problemType="house-robber" selectedAlgorithm={selectedAlgorithm} />
              </div>
              
              {/* Input and Algorithm Selection Panel */}
              <div className="mb-6">
                <HouseRobberInputPanel
                  inputValues={inputValues}
                  onInputChange={handleInputChange}
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

              {/* Visualization Area */}
              <div className="flex gap-6 mb-6">
                {/* Recursion Tree */}
                {showRecursionTree && (
                  <div className="w-full">
                    <VisualizationPanel title="Recursion Tree Visualization">
                      <HouseRobberTreeVisualization
                        treeData={treeData}
                        currentStep={currentStep}
                        algorithmType={selectedAlgorithm}
                        isVisible={showRecursionTree}
                        executionTrace={executionTrace}
                        houses={inputValues}
                      />
                    </VisualizationPanel>
                  </div>
                )}
              </div>
              {/* DP Table (always after tree) */}
              {showDPTable && (
                <div className="mb-6">
                  <VisualizationPanel title="Dynamic Programming Table">
                    <HouseRobberTableVisualization
                      tableData={tableData}
                      currentStep={currentStep}
                      algorithmType={selectedAlgorithm}
                      inputValues={inputValues}
                      executionTrace={executionTrace}
                    />
                  </VisualizationPanel>
                </div>
              )}

              {/* Step Log Panel */}
              <div>
                <StepLogPanel
                  stepLog={stepLog}
                  currentStep={currentStep}
                  algorithmType={selectedAlgorithm}
                  isCollapsed={stepLogCollapsed}
                  onToggleCollapse={() => setStepLogCollapsed(!stepLogCollapsed)}
                />
            </div>
          </div>
        </ResponsiveLayoutManager>

        {/* Help Overlay */}
        <ContextualHelpOverlay
          isOpen={helpOverlayOpen}
          onClose={() => setHelpOverlayOpen(false)}
          algorithmType={selectedAlgorithm}
        />
      </div>
    </>
  );
};

export default HouseRobberVisualizationDashboard;