import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const AlgorithmControlPanel = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('recursive');
  const [inputValue, setInputValue] = useState('10');
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  const algorithms = [
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
      name: 'Memoization Optimization',
      description: 'Top-down DP approach using cache to store computed values',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      icon: 'Database'
    },
    {
      id: 'tabulation',
      name: 'Tabulation Method',
      description: 'Bottom-up DP approach building solution iteratively',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      icon: 'Table'
    }
  ];

  const speedOptions = [
    { value: 'slow', label: 'Slow', duration: '600ms' },
    { value: 'normal', label: 'Normal', duration: '300ms' },
    { value: 'fast', label: 'Fast', duration: '150ms' }
  ];

  const handleAlgorithmChange = (algorithmId) => {
    setSelectedAlgorithm(algorithmId);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 50)) {
      setInputValue(value);
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectedAlgorithmData = algorithms.find(alg => alg.id === selectedAlgorithm);

  return (
    <div className="sticky top-16 z-control-panel bg-surface border-b border-border shadow-educational">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Algorithm Selection */}
        <div className="mb-6">
          <h2 className="text-heading-sm text-text-primary mb-4">Algorithm Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {algorithms.map((algorithm) => (
              <button
                key={algorithm.id}
                onClick={() => handleAlgorithmChange(algorithm.id)}
                className={`p-4 rounded-lg border-2 text-left transition-educational ${
                  selectedAlgorithm === algorithm.id
                    ? 'border-primary bg-primary-50 shadow-educational'
                    : 'border-border bg-surface hover:border-primary-200 hover:bg-surface-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedAlgorithm === algorithm.id ? 'bg-primary text-primary-foreground' : 'bg-surface-100 text-text-secondary'
                  }`}>
                    <Icon name={algorithm.icon} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-body-md font-medium ${
                      selectedAlgorithm === algorithm.id ? 'text-primary' : 'text-text-primary'
                    }`}>
                      {algorithm.name}
                    </h3>
                    <p className="text-body-sm text-text-secondary mt-1">
                      {algorithm.description}
                    </p>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-caption px-2 py-1 rounded font-mono ${
                          selectedAlgorithm === algorithm.id ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-text-secondary'
                        }`}>
                          Time: {algorithm.timeComplexity}
                        </span>
                      <span className={`text-caption px-2 py-1 rounded font-mono ${
                        selectedAlgorithm === algorithm.id ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-text-secondary'
                      }`}>
                          Space: {algorithm.spaceComplexity}
                      </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <h3 className="text-heading-sm text-text-primary">Input Configuration</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="fibonacci-input" className="block text-body-sm text-text-secondary mb-2">
                  Fibonacci Number (n)
                </label>
                <Input
                  id="fibonacci-input"
                  type="number"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter a number (0-50)"
                  min="0"
                  max="50"
                  className="w-full"
                />
                <p className="text-caption text-text-muted mt-1">
                  Calculate F({inputValue || 'n'}) using {selectedAlgorithmData?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Animation Controls */}
          <div className="space-y-4">
            <h3 className="text-heading-sm text-text-primary">Animation Controls</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-body-sm text-text-secondary mb-2">
                  Animation Speed
                </label>
                <div className="flex space-x-2">
                  {speedOptions.map((speed) => (
                    <button
                      key={speed.value}
                      onClick={() => setAnimationSpeed(speed.value)}
                      className={`px-3 py-2 rounded-lg text-body-sm transition-educational ${
                        animationSpeed === speed.value
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-surface-100 text-text-secondary hover:bg-surface-200'
                      }`}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  onClick={handleStepBackward}
                  iconName="ChevronLeft"
                  disabled={currentStep === 0}
                />
                <Button
                  variant="primary"
                  onClick={handlePlay}
                  iconName={isPlaying ? "Pause" : "Play"}
                  iconPosition="left"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleStepForward}
                  iconName="ChevronRight"
                  disabled={currentStep >= totalSteps}
                />
                <Button
                  variant="outline"
                  onClick={handleReset}
                  iconName="RotateCcw"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Progress and Status */}
          <div className="space-y-4">
            <h3 className="text-heading-sm text-text-primary">Progress Status</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-body-sm text-text-secondary mb-2">
                  <span>Step Progress</span>
                  <span>{currentStep + 1} / {totalSteps}</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-educational"
                    style={{ width: totalSteps > 0 ? `${((currentStep + 1) / totalSteps) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
              
              <div className="p-3 bg-surface-50 rounded-lg border border-border-light">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Info" size={16} className="text-text-secondary" />
                  <span className="text-body-sm font-medium text-text-primary">Current Algorithm</span>
                </div>
                <p className="text-body-sm text-text-secondary">
                  {selectedAlgorithmData?.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-caption text-text-muted">Time Complexity:</span>
                  <span className="text-caption font-mono bg-surface text-text-primary px-2 py-1 rounded">
                    {selectedAlgorithmData?.timeComplexity}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-caption text-text-muted">Space Complexity:</span>
                  <span className="text-caption font-mono bg-surface text-text-primary px-2 py-1 rounded">
                    {selectedAlgorithmData?.spaceComplexity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmControlPanel;