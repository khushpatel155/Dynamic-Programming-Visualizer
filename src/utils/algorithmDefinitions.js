export const commonAlgorithms = [
  {
    id: 'recursive',
    name: 'Recursive Approach',
    description: 'Basic recursive implementation',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(n)',
    icon: 'GitBranch'
  },
  {
    id: 'memoization',
    name: 'Memoization (Top-Down)',
    description: 'Recursive with caching',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) (recursive stack) + O(n) (DP array)',
    icon: 'Database'
  },
  {
    id: 'tabulation',
    name: 'Tabulation (Bottom-Up)',
    description: 'Iterative DP approach',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    icon: 'Table'
  }
];

export const getAlgorithmsForProblem = (problemType) => {
  switch (problemType) {
    case 'frog-jump':
      return [
        {
          id: 'recursive',
          name: 'Recursive Approach',
          description: 'Basic recursive implementation with exponential time complexity',
          timeComplexity: 'O(k^n)',
          spaceComplexity: 'O(n)',
          icon: 'GitBranch'
        },
        {
          id: 'memoization',
          name: 'Memoization (Top-Down)',
          description: 'Top-down DP approach using cache + recursion stack',
          timeComplexity: 'O(n×k)',
          spaceComplexity: 'O(n) (recursive stack) + O(n) (DP array)',
          icon: 'Database'
        },
        {
          id: 'tabulation',
          name: 'Tabulation (Bottom-Up)',
          description: 'Bottom-up DP approach building solution iteratively',
          timeComplexity: 'O(n×k)',
          spaceComplexity: 'O(n)',
          icon: 'Table'
        }
      ];
    case 'house-robber':
      return [
        {
          id: 'recursive',
          name: 'Recursive Approach',
          description: 'Basic recursive implementation with exponential time complexity',
          timeComplexity: 'O(2^n)',
          spaceComplexity: 'O(n)',
          icon: 'GitBranch'
        },
        {
          id: 'memoization',
          name: 'Memoization (Top-Down)',
          description: 'Top-down DP approach using cache + recursion stack',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n) (recursive stack) + O(n) (DP array)',
          icon: 'Database'
        },
        {
          id: 'tabulation',
          name: 'Tabulation (Bottom-Up)',
          description: 'Bottom-up DP approach building solution iteratively',
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          icon: 'Table'
        }
      ];
    default: // fibonacci
      return commonAlgorithms;
  }
};

export const getCellColor = (index, executionTrace, currentStep) => {
  if (!executionTrace.length) return 'bg-gray-50 text-gray-400 border-gray-200';
  
  const relevantSteps = executionTrace.filter(step => 
    (step.index === index || step.nodeId?.includes(`f${index}`)) && 
    step.step <= currentStep
  );
  
  if (relevantSteps.length === 0) {
    return 'bg-gray-50 text-gray-400 border-gray-200'; // Pending
  }
  
  const latestStep = relevantSteps[relevantSteps.length - 1];
  
  if (latestStep.step === currentStep) {
    return 'bg-amber-100 text-amber-800 border-amber-400'; // Current
  }
  
  switch (latestStep.type) {
    case 'cache_hit':
      return 'bg-blue-100 text-blue-800 border-blue-400'; // Reused
    case 'initialization':
    case 'computation':
    case 'return':
      return 'bg-green-100 text-green-800 border-green-400'; // Computed
    default:
      return 'bg-gray-50 text-gray-400 border-gray-200'; // Pending
  }
}; 