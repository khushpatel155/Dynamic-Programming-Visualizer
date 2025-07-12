import React, { useState } from 'react';

import Button from './Button';

const ApplicationHeader = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleHelpToggle = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-header bg-surface border-b border-border shadow-educational">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-foreground"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-heading-md font-heading text-text-primary">
                DP Visualizer
              </h1>
              <p className="text-caption text-text-secondary hidden sm:block">
                Interactive Dynamic Programming Learning Tool
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={handleHelpToggle}
              iconName="HelpCircle"
              iconPosition="left"
              className="text-text-secondary hover:text-text-primary"
            >
              <span className="hidden sm:inline">Help</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => window.open('https://github.com', '_blank')}
              iconName="Github"
              className="text-text-secondary hover:text-text-primary"
            >
              <span className="hidden sm:inline">Source</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Help Overlay Trigger */}
      {isHelpOpen && (
        <div className="absolute top-full left-0 right-0 bg-surface border-b border-border shadow-educational-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-heading-sm text-text-primary">Algorithm Modes</h3>
                <p className="text-body-sm text-text-secondary">
                  Switch between recursive, memoization, and tabulation approaches to understand different DP strategies.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-heading-sm text-text-primary">Visualization Controls</h3>
                <p className="text-body-sm text-text-secondary">
                  Use play, pause, and step controls to analyze algorithm execution at your own pace.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-heading-sm text-text-primary">Color Coding</h3>
                <p className="text-body-sm text-text-secondary">
                  <span className="inline-block w-3 h-3 bg-success rounded mr-2"></span>
                  New computations
                  <br />
                  <span className="inline-block w-3 h-3 bg-primary rounded mr-2"></span>
                  Reused values
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Button
                variant="text"
                onClick={handleHelpToggle}
                iconName="X"
                iconPosition="right"
                className="text-text-secondary hover:text-text-primary"
              >
                Close Help
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ApplicationHeader;