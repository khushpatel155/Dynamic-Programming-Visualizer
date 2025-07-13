import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

// Import UI components
import ApplicationHeader from '../../components/ui/ApplicationHeader';
import ResponsiveLayoutManager, { VisualizationPanel, ControlPanel } from '../../components/ui/ResponsiveLayoutManager';
import ContextualHelpOverlay from '../../components/ui/ContextualHelpOverlay';

// Import page-specific components
import FibonacciInputPanel from './components/FibonacciInputPanel';
import AnimationControlPanel from './components/AnimationControlPanel';
import RecursionTreeVisualization from './components/RecursionTreeVisualization';
import DPTableVisualization from './components/DPTableVisualization';
import StepLogPanel from './components/StepLogPanel';
import AlgorithmCodeDisplay from '../../components/ui/AlgorithmCodeDisplay';

// Import utilities
import useKeyboardControls from '../../utils/useKeyboardControls';

const AlgorithmVisualizationDashboard = () => {
  // Core state management
  const [inputValue, setInputValue] = useState('5');
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

  // Algorithm simulation functions
  const simulateRecursive = (n) => {
    const trace = [];
    const nodes = new Map();
    const edges = [];
    let stepCounter = 0;
    
    const fibonacci = (num, depth = 0, parentId = null) => {
      const nodeId = `f${num}_${stepCounter++}`;
      const node = {
        id: nodeId,
        value: num,
        depth,
        x: 0, // Will be positioned later
        y: 0,
        status: 'pending',
        result: null,
        step: trace.length
      };
      
      nodes.set(nodeId, node);
      trace.push({
        step: trace.length,
        action: `fibonacci(${num})`,
        description: `Call fibonacci(${num})`,
        type: 'function_call',
        nodeId,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
      
      if (parentId) {
        edges.push({ from: parentId, to: nodeId });
      }
      
      if (num <= 1) {
        node.result = num;
        node.status = 'base';
        trace.push({
          step: trace.length,
          action: `return ${num}`,
          description: `Base case: F(${num}) = ${num}`,
          type: 'return',
          nodeId,
          timestamp: `00:00.${(trace.length + 1) * 100}`
        });
        return num;
      }
      
      const left = fibonacci(num - 1, depth + 1, nodeId);
      const right = fibonacci(num - 2, depth + 1, nodeId);
      const result = left + right;
      
      node.result = result;
      node.status = 'completed';
      trace.push({
        step: trace.length,
        action: `return ${result}`,
        description: `F(${num}) = F(${num-1}) + F(${num-2}) = ${left} + ${right} = ${result}`,
        type: 'return',
        nodeId,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
      
      return result;
    };
    
    fibonacci(n);
    return { trace, nodes: Array.from(nodes.values()), edges };
  };

  const simulateMemoization = (n) => {
    const trace = [];
    const nodes = new Map();
    const edges = [];
    const cache = new Map();
    let stepCounter = 0;
    
    const fibonacci = (num, depth = 0, parentId = null) => {
      const nodeId = `f${num}_${stepCounter++}`;
      const node = {
        id: nodeId,
        value: num,
        depth,
        x: 0,
        y: 0,
        status: 'pending',
        result: null,
        step: trace.length
      };
      
      nodes.set(nodeId, node);
      trace.push({
        step: trace.length,
        action: `fibonacci(${num})`,
        description: `Call fibonacci(${num})`,
        type: 'function_call',
        nodeId,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
      
      if (parentId) {
        edges.push({ from: parentId, to: nodeId });
      }
      
      if (cache.has(num)) {
        node.result = cache.get(num);
        node.status = 'memoized';
        trace.push({
          step: trace.length,
          action: `return ${cache.get(num)} (cached)`,
          description: `Cache hit: F(${num}) = ${cache.get(num)}`,
          type: 'cache_hit',
          nodeId,
          timestamp: `00:00.${(trace.length + 1) * 100}`
        });
        return cache.get(num);
      }
      
      if (num <= 1) {
        node.result = num;
        node.status = 'base';
        cache.set(num, num);
        trace.push({
          step: trace.length,
          action: `return ${num}`,
          description: `Base case: F(${num}) = ${num}`,
          type: 'return',
          nodeId,
          timestamp: `00:00.${(trace.length + 1) * 100}`
        });
        return num;
      }
      
      const left = fibonacci(num - 1, depth + 1, nodeId);
      const right = fibonacci(num - 2, depth + 1, nodeId);
      const result = left + right;
      
      node.result = result;
      node.status = 'completed';
      cache.set(num, result);
      trace.push({
        step: trace.length,
        action: `return ${result}`,
        description: `F(${num}) = F(${num-1}) + F(${num-2}) = ${left} + ${right} = ${result}`,
        type: 'return',
        nodeId,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
      
      return result;
    };
    
    fibonacci(n);
    return { trace, nodes: Array.from(nodes.values()), edges, cache };
  };

  const simulateTabulation = (n) => {
    const trace = [];
    const dp = new Array(n + 1).fill(null);
    
    // Initialize base cases
    if (n >= 0) {
      dp[0] = 0;
      trace.push({
        step: trace.length,
        action: `dp[0] = 0`,
        description: `Initialize base case: F(0) = 0`,
        type: 'initialization',
        index: 0,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
    }
    
    if (n >= 1) {
      dp[1] = 1;
      trace.push({
        step: trace.length,
        action: `dp[1] = 1`,
        description: `Initialize base case: F(1) = 1`,
        type: 'initialization',
        index: 1,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
    }
    
    // Fill the DP table
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      trace.push({
        step: trace.length,
        action: `dp[${i}] = dp[${i-1}] + dp[${i-2}]`,
        description: `F(${i}) = F(${i-1}) + F(${i-2}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`,
        type: 'computation',
        index: i,
        timestamp: `00:00.${(trace.length + 1) * 100}`
      });
    }
    
    return { trace, dp };
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
    
    // Position nodes
    const width = 800;
    const height = 500;
    const levelHeight = 80;
    
    depths.forEach((nodesAtDepth, depth) => {
      const y = 50 + depth * levelHeight;
      const spacing = width / (nodesAtDepth.length + 1);
      
      nodesAtDepth.forEach((node, index) => {
        node.x = spacing * (index + 1);
        node.y = y;
      });
    });
    
    return positioned;
  };

  // Handle input changes
  const handleInputChange = (value) => {
    setInputValue(value);
    handleReset();
  };

  // Handle algorithm selection
  const handleAlgorithmChange = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    handleReset();
  };

  // Start calculation and visualization
  const handleCalculate = () => {
    if (!inputValue || isCalculating) return;
    
    setIsCalculating(true);
    setCurrentStep(0);
    
    const n = parseInt(inputValue);
    let simulationResult;
    
    try {
      switch (selectedAlgorithm) {
        case 'recursive':
          simulationResult = simulateRecursive(n);
          break;
        case 'memoization':
          simulationResult = simulateMemoization(n);
          break;
        case 'tabulation':
          simulationResult = simulateTabulation(n);
          break;
        default:
          throw new Error('Unknown algorithm');
      }
      
      setExecutionTrace(simulationResult.trace);
      setTotalSteps(simulationResult.trace.length);
      
      if (selectedAlgorithm === 'tabulation') {
        setTableData({ dp: simulationResult.dp, n });
        setTreeData(null);
      } else {
        const positionedNodes = positionNodes(simulationResult.nodes, simulationResult.edges);
        setTreeData({
          nodes: positionedNodes,
          edges: simulationResult.edges
        });
        setTableData(simulationResult.cache ? { cache: simulationResult.cache, n } : null);
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

  // Keyboard controls
  useKeyboardControls({
    onStepForward: handleStepForward,
    onStepBackward: handleStepBackward,
    onPlay: handlePlay,
    onPause: handlePause,
    isPlaying,
    canStepForward: currentStep < totalSteps - 1,
    canStepBackward: currentStep > 0,
    isCalculating,
    enabled: totalSteps > 0
  });

  // Determine layout based on algorithm
  const showRecursionTree = selectedAlgorithm !== 'tabulation';
  const showDPTable = selectedAlgorithm !== 'recursive' || selectedAlgorithm === 'memoization';

  return (
    <>
      <Helmet>
        <title>Algorithm Visualization Dashboard - DP Visualizer</title>
        <meta name="description" content="Interactive dashboard for visualizing dynamic programming algorithms through step-by-step demonstrations" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <ApplicationHeader />
        
        <ResponsiveLayoutManager algorithmType={selectedAlgorithm}>
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
              
              {/* Problem Description */}
              <div className="mb-6 bg-surface border border-border rounded-lg shadow-educational p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-heading-lg font-medium text-text-primary mb-3">Fibonacci Sequence</h2>
                    <p className="text-body-md text-text-secondary">
                      The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1. The sequence follows the pattern: F(n) = F(n-1) + F(n-2), where F(0) = 0 and F(1) = 1.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-heading-sm font-medium text-text-primary">Example 1</h3>
                      <div className="bg-surface-50 border border-border rounded-lg p-4">
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Input:</strong> n = 5</p>
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Output:</strong> F(5) = 5</p>
                        <p className="text-body-sm text-text-secondary"><strong>Explanation:</strong> F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-heading-sm font-medium text-text-primary">Example 2</h3>
                      <div className="bg-surface-50 border border-border rounded-lg p-4">
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Input:</strong> n = 7</p>
                        <p className="text-body-sm text-text-secondary mb-2"><strong>Output:</strong> F(7) = 13</p>
                        <p className="text-body-sm text-text-secondary"><strong>Explanation:</strong> F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8, F(7)=13</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* C++ Code Implementation */}
              <div className="mb-6">
                <AlgorithmCodeDisplay problemType="fibonacci" selectedAlgorithm={selectedAlgorithm} />
              </div>
              
              {/* Input and Algorithm Selection Panel */}
              <div className="mb-6">
                <FibonacciInputPanel
                  inputValue={inputValue}
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
              <div className="mb-6">
                
                {/* Recursion Tree - Full Width */}
                {showRecursionTree && (
                  <div className="w-full mb-6">
                    <VisualizationPanel title="Recursion Tree Visualization">
                      <RecursionTreeVisualization
                        treeData={treeData}
                        currentStep={currentStep}
                        algorithmType={selectedAlgorithm}
                        isVisible={showRecursionTree}
                        executionTrace={executionTrace}
                      />
                    </VisualizationPanel>
                  </div>
                )}

                {/* DP Table - Full Width Below Tree */}
                {(selectedAlgorithm === 'memoization' || selectedAlgorithm === 'tabulation') && (
                  <div className="w-full mb-6">
                    <VisualizationPanel title="Dynamic Programming Table">
                      <DPTableVisualization
                        tableData={tableData}
                        currentStep={currentStep}
                        algorithmType={selectedAlgorithm}
                        inputValue={inputValue}
                        executionTrace={executionTrace}
                      />
                    </VisualizationPanel>
                  </div>
                )}
              </div>

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

export default AlgorithmVisualizationDashboard;