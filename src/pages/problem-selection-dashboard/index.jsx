import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ApplicationHeader from '../../components/ui/ApplicationHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const ProblemSelectionDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const problems = [
    {
      id: 'fibonacci',
      name: 'Fibonacci Sequence',
      difficulty: 'Easy',
      description: 'Classic introduction to dynamic programming with overlapping subproblems',
      problemDescription: {
        description: 'The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1. The sequence follows the pattern: F(n) = F(n-1) + F(n-2), where F(0) = 0 and F(1) = 1.',
        examples: [
          {
            title: 'Example 1',
            input: 'n = 5',
            output: 'F(5) = 5',
            explanation: 'F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5'
          },
          {
            title: 'Example 2', 
            input: 'n = 7',
            output: 'F(7) = 13',
            explanation: 'F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8, F(7)=13'
          }
        ]
      },
      route: '/algorithm-visualization-dashboard',
      complexity: {
        time: 'O(2^n) → O(n)',
        space: 'O(n)'
      },
      concepts: ['Recursion', 'Memoization', 'Tabulation'],
      icon: 'TrendingUp',
      color: 'bg-blue-500',
      accentColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      id: 'house-robber',
      name: 'House Robber',
      difficulty: 'Medium',
      description: 'Optimal decision making with constraints - rob houses without adjacent selection',
      problemDescription: {
        description: 'Given an array of house values, find the maximum amount of money you can rob without robbing two adjacent houses. Each house contains a non-negative amount of money.',
        examples: [
          {
            title: 'Example 1',
            input: '[2, 7, 9, 3, 1]',
            output: '12',
            explanation: 'Rob houses 0, 2, 4: 2 + 9 + 1 = 12'
          },
          {
            title: 'Example 2',
            input: '[5, 5, 5, 5, 5]',
            output: '15',
            explanation: 'Rob houses 0, 2, 4: 5 + 5 + 5 = 15'
          }
        ]
      },
      route: '/house-robber-visualization-dashboard',
      complexity: {
        time: 'O(2^n) → O(n)',
        space: 'O(n)'
      },
      concepts: ['Recursion', 'Memoization', 'Tabulation'],
      icon: 'Home',
      color: 'bg-green-500',
      accentColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-700'
    },
    {
      id: 'frog-jump',
      name: 'Frog Jump with K Distances',
      difficulty: 'Medium',
      description: 'Minimum energy path finding with variable jump distances',
      problemDescription: {
        description: 'A frog starts from the 0th step and wants to reach the last step. From step i, it can jump to any step j where i &lt; j &le; i + k. The cost of jumping from step i to step j is |heights[i] - heights[j]|. Find the minimum total cost to reach the last step.',
        examples: [
          {
            title: 'Example 1',
            input: 'heights = [10, 5, 20, 0, 15], k = 2',
            output: '15',
            explanation: 'Path: 0 → 2 → 4, Cost: |10-20| + |20-15| = 10 + 5 = 15'
          },
          {
            title: 'Example 2',
            input: 'heights = [15, 4, 1, 14, 15], k = 3',
            output: '2',
            explanation: 'Path: 0 → 3 → 4, Cost: |15-14| + |14-15| = 1 + 1 = 2'
          }
        ]
      },
      route: '/frog-jump-visualization-dashboard',
      complexity: {
        time: 'O(k^n) → O(n×k)',
        space: 'O(n)'
      },
      concepts: ['Recursion', 'Memoization', 'Tabulation'],
      icon: 'Zap',
      color: 'bg-purple-500',
      accentColor: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700'
    }
  ];

  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const handleProblemSelect = (route) => {
    navigate(route);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>Dynamic Programming Visualizer - Problem Selection</title>
        <meta name="description" content="Interactive platform for learning dynamic programming through visual algorithm demonstrations" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <ApplicationHeader />
        
        <div className="pt-16">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-medium text-text-primary mb-4">
                Dynamic Programming Visualizer
              </h1>
              <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                Master dynamic programming concepts through interactive visualizations. 
                Choose a problem below to explore recursion, memoization, and tabulation approaches.
              </p>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-8 bg-surface border border-border rounded-lg shadow-educational p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="block text-body-sm font-medium text-text-primary mb-2">
                    Search Problems
                  </label>
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="md:w-48">
                  <label htmlFor="difficulty" className="block text-body-sm font-medium text-text-primary mb-2">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty === 'all' ? 'All Difficulties' : difficulty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 1D DP Problems Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-text-primary mb-6">
                1D DP Problems
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filteredProblems.map((problem) => (
                <div
                  key={problem.id}
                    className="relative bg-surface border border-border rounded-lg shadow-educational hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-[1.025] focus-within:scale-[1.025] flex flex-col h-full"
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${problem.name}`}
                    onClick={(e) => {
                      // Prevent double navigation if button is clicked
                      if (e.target.closest('button')) return;
                      handleProblemSelect(problem.route);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleProblemSelect(problem.route);
                      }
                    }}
                >
                  {/* Problem Header */}
                  <div className={`${problem.accentColor} p-6 border-b border-border h-56 flex flex-col`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${problem.color}`}>
                        <Icon name={problem.icon} size={24} className="text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-body-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <h3 className="text-heading-md font-medium text-text-primary mb-2">
                      {problem.name}
                    </h3>
                    <p className="text-body-sm text-text-secondary flex-1">
                      {problem.description}
                    </p>
                  </div>

                  {/* Problem Details */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    {/* Complexity Info */}
                    <div className="space-y-2">
                      <h4 className="text-body-sm font-medium text-text-primary">Complexity</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-surface-100 text-text-secondary rounded text-caption font-mono">
                          Time: {problem.complexity.time}
                        </span>
                        <span className="px-2 py-1 bg-surface-100 text-text-secondary rounded text-caption font-mono">
                          Space: {problem.complexity.space}
                        </span>
                      </div>
                    </div>

                    {/* Key Concepts */}
                    <div className="space-y-2">
                      <h4 className="text-body-sm font-medium text-text-primary">Key Concepts</h4>
                      <div className="flex flex-wrap gap-2">
                        {problem.concepts.map((concept, index) => (
                          <span 
                            key={index}
                            className={`px-2 py-1 rounded text-caption font-medium ${problem.textColor} ${problem.accentColor}`}
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button - Pushed to bottom */}
                    <div className="mt-auto pt-4">
                      <Button
                        variant="primary"
                        onClick={() => handleProblemSelect(problem.route)}
                        iconName="Play"
                        iconPosition="left"
                        fullWidth
                        className="group-hover:shadow-lg"
                          tabIndex={-1}
                      >
                        Start Visualization
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProblems.length === 0 && (
              <div className="text-center py-16">
                <Icon name="Search" size={48} className="text-text-muted mx-auto mb-4" />
                <h3 className="text-heading-md text-text-primary mb-2">No problems found</h3>
                <p className="text-body-md text-text-secondary">
                  Try adjusting your search terms or difficulty filter
                </p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemSelectionDashboard;