import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const ContextualHelpOverlay = ({ isOpen, onClose, algorithmType = 'recursive' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stepLog, setStepLog] = useState([]);

  const helpContent = {
    recursive: {
      overview: {
        title: 'Recursive Approach',
        description: 'The recursive approach implements the mathematical definition of Fibonacci numbers directly.',
        keyPoints: [
          'Each function call creates two more calls (F(n-1) and F(n-2))',
          'Base cases: F(0) = 0, F(1) = 1',
          'Time complexity: O(2^n) - exponential growth',
          'Space complexity: O(n) - due to call stack depth'
        ],
        visualization: 'Watch how the same subproblems are solved multiple times, creating a binary tree of recursive calls.'
      },
      steps: [
        'Start with F(n) where n is your input',
        'Check base cases: if n ≤ 1, return n',
        'Otherwise, recursively call F(n-1) + F(n-2)',
        'Each call spawns two more calls until base cases are reached',
        'Results bubble back up through the call stack'
      ],
      tips: [
        'Notice how F(3) might be calculated multiple times',
        'The tree grows exponentially with larger inputs',
        'This approach is intuitive but inefficient for large numbers'
      ]
    },
    memoization: {
      overview: {
        title: 'Memoization (Top-Down DP)',
        description: 'Memoization optimizes recursion by caching previously computed results.',
        keyPoints: [
          'Uses a cache (usually array or map) to store computed values',
          'Before computing F(n), check if result already exists in cache',
          'Time complexity: O(n) - each subproblem solved once',
          'Space complexity: O(n) - for cache storage and call stack'
        ],
        visualization: 'Green highlights show new computations, blue shows cache hits (reused values).'
      },
      steps: [
        'Initialize cache array filled with undefined values',
        'For F(n), first check if cache[n] exists',
        'If cached, return cache[n] (blue highlight)',
        'If not cached, compute recursively and store in cache[n] (green highlight)',
        'Each subproblem is solved exactly once'
      ],
      tips: [
        'Blue cells indicate cache hits - no recomputation needed',
        'Green cells show new calculations being stored',
        'Notice how cache fills up progressively',
        'Much faster than pure recursion for larger inputs'
      ]
    },
    tabulation: {
      overview: {
        title: 'Tabulation (Bottom-Up DP)',
        description: 'Tabulation builds the solution iteratively from the bottom up.',
        keyPoints: [
          'No recursion - uses iterative approach with loops',
          'Builds solution from F(0) up to F(n)',
          'Time complexity: O(n) - single loop through values',
          'Space complexity: O(n) - for the DP table'
        ],
        visualization: 'Watch the table fill sequentially from left to right, each value building on previous ones.'
      },
      steps: [
        'Create DP table with base cases: dp[0] = 0, dp[1] = 1',
        'Iterate from i = 2 to n',
        'For each i, compute dp[i] = dp[i-1] + dp[i-2]',
        'Each computation uses previously calculated values',
        'Final answer is dp[n]'
      ],
      tips: [
        'No function calls or recursion overhead',
        'Values are computed in order of dependency',
        'Most space-efficient approach can use only two variables',
        'Easiest to understand execution flow'
      ]
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BookOpen' },
    { id: 'steps', label: 'Step Guide', icon: 'List' },
    { id: 'tips', label: 'Tips', icon: 'Lightbulb' },
    { id: 'log', label: 'Step Log', icon: 'FileText' }
  ];

  const currentContent = helpContent[algorithmType] || helpContent.recursive;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-heading-md text-text-primary mb-3">
                {currentContent.overview.title}
              </h3>
              <p className="text-body-md text-text-secondary mb-4">
                {currentContent.overview.description}
              </p>
            </div>

            <div>
              <h4 className="text-heading-sm text-text-primary mb-3">Key Characteristics</h4>
              <ul className="space-y-2">
                {currentContent.overview.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Icon name="CheckCircle" size={16} className="text-success mt-1 flex-shrink-0" />
                    <span className="text-body-sm text-text-secondary">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-start space-x-3">
                <Icon name="Eye" size={20} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <h5 className="text-body-md font-medium text-primary mb-2">Visualization Guide</h5>
                  <p className="text-body-sm text-text-secondary">
                    {currentContent.overview.visualization}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'steps':
        return (
          <div className="space-y-4">
            <h3 className="text-heading-md text-text-primary mb-4">Step-by-Step Process</h3>
            <div className="space-y-4">
              {currentContent.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-surface-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-accent text-accent-foreground rounded-full text-body-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-body-sm text-text-secondary">{step}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className="space-y-4">
            <h3 className="text-heading-md text-text-primary mb-4">Learning Tips</h3>
            <div className="space-y-4">
              {currentContent.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-warning-50 rounded-lg border border-warning-200">
                  <Icon name="Lightbulb" size={16} className="text-warning-600 mt-1 flex-shrink-0" />
                  <p className="text-body-sm text-text-secondary">{tip}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-success-50 rounded-lg border border-success-200">
              <div className="flex items-start space-x-3">
                <Icon name="Target" size={20} className="text-success-600 mt-1 flex-shrink-0" />
                <div>
                  <h5 className="text-body-md font-medium text-success-700 mb-2">Color Legend</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-success rounded"></div>
                      <span className="text-body-sm text-text-secondary">New computations being calculated</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-primary rounded"></div>
                      <span className="text-body-sm text-text-secondary">Reused values from cache/previous calculations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-accent rounded"></div>
                      <span className="text-body-sm text-text-secondary">Current step or active computation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'log':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-heading-md text-text-primary">Execution Log</h3>
              <Button
                variant="outline"
                onClick={() => setStepLog([])}
                iconName="Trash2"
                disabled={stepLog.length === 0}
              >
                Clear Log
              </Button>
            </div>
            
            {stepLog.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="FileText" size={48} className="text-text-muted mx-auto mb-4" />
                <p className="text-body-md text-text-secondary mb-2">No execution steps logged yet</p>
                <p className="text-body-sm text-text-muted">
                  Start the algorithm visualization to see step-by-step execution details here.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {stepLog.map((logEntry, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-surface-50 rounded border border-border-light">
                    <span className="text-caption text-text-muted font-mono mt-1 flex-shrink-0">
                      {String(index + 1).padStart(3, '0')}
                    </span>
                    <div className="flex-1">
                      <p className="text-body-sm text-text-primary font-mono">{logEntry.action}</p>
                      {logEntry.details && (
                        <p className="text-caption text-text-secondary mt-1">{logEntry.details}</p>
                      )}
                    </div>
                    <span className="text-caption text-text-muted flex-shrink-0">
                      {logEntry.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-overlay bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-educational-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Icon name="HelpCircle" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-heading-lg text-text-primary">Algorithm Help</h2>
              <p className="text-body-sm text-text-secondary">
                Learn about {currentContent.overview.title}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            iconName="X"
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-body-sm font-medium border-b-2 transition-educational ${
                activeTab === tab.id
                  ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border-dark'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-surface-50">
          <div className="flex items-center space-x-2 text-body-sm text-text-secondary">
            <Icon name="Info" size={16} />
            <span>Use keyboard shortcuts: ESC to close, Tab to navigate</span>
          </div>
          <Button variant="primary" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContextualHelpOverlay;