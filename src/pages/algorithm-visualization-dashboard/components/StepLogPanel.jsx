import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const StepLogPanel = ({ 
  stepLog = [], 
  currentStep, 
  algorithmType,
  isCollapsed = false,
  onToggleCollapse 
}) => {
  const logContainerRef = useRef(null);

  // Show only steps up to current step for progressive display
  const visibleSteps = stepLog.slice(0, currentStep + 1);

  // Auto-scroll to bottom when new steps are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [visibleSteps]);

  const getStepIcon = (type) => {
    switch (type) {
      case 'function_call':
        return 'ArrowRight';
      case 'base_case':
        return 'CheckCircle';
      case 'computation':
        return 'Calculator';
      case 'cache_hit':
        return 'Database';
      case 'cache_store':
        return 'Save';
      case 'initialization':
        return 'Settings';
      case 'return':
        return 'ArrowUp';
      default:
        return 'Info';
    }
  };

  const getStepColor = (type) => {
    switch (type) {
      case 'function_call':
        return 'text-primary';
      case 'base_case':
        return 'text-success-600';
      case 'computation':
        return 'text-accent-600';
      case 'cache_hit':
        return 'text-primary-600';
      case 'cache_store':
        return 'text-secondary-600';
      case 'initialization':
        return 'text-warning-600';
      case 'return':
        return 'text-success-600';
      default:
        return 'text-text-secondary';
    }
  };

  if (isCollapsed) {
    return (
      <div className="bg-surface border border-border rounded-lg shadow-educational">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-50 transition-educational"
        >
          <div className="flex items-center space-x-3">
            <Icon name="FileText" size={20} className="text-primary" />
            <h3 className="text-heading-sm text-text-primary">Step Log</h3>
            <span className="text-body-sm text-text-secondary">
              ({visibleSteps.length} / {stepLog.length} steps)
            </span>
          </div>
          <Icon name="ChevronUp" size={20} className="text-text-secondary" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg shadow-educational">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-heading-sm text-text-primary">Step Log</h3>
          <span className="text-body-sm text-text-secondary">
            ({visibleSteps.length} / {stepLog.length} steps)
          </span>
        </div>
          <Button
            variant="ghost"
            onClick={onToggleCollapse}
            iconName="ChevronDown"
            size="sm"
            className="text-text-secondary hover:text-text-primary"
          />
      </div>

      {/* Log Content */}
      <div className="max-h-80 overflow-y-auto" ref={logContainerRef}>
        {visibleSteps.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="FileText" size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-body-md text-text-secondary mb-2">No steps logged yet</p>
            <p className="text-body-sm text-text-muted">
              Start the algorithm visualization to see step-by-step execution details.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {visibleSteps.map((logEntry, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-educational ${
                  index === currentStep 
                    ? 'bg-accent-50 border-accent-200' :'bg-surface-50 border-border-light hover:bg-surface-100'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-surface border border-border-dark flex-shrink-0 mt-1">
                  <span className="text-caption font-mono text-text-secondary">
                    {logEntry.step + 1}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon 
                      name={getStepIcon(logEntry.type)} 
                      size={16} 
                      className={getStepColor(logEntry.type)} 
                    />
                    <code className="text-body-sm font-mono text-text-primary">
                      {logEntry.action}
                    </code>
                  </div>
                  <p className="text-body-sm text-text-secondary">
                    {logEntry.description}
                  </p>
                </div>
                
                <span className="text-caption text-text-muted font-mono flex-shrink-0 mt-1">
                  {logEntry.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-surface-50">
        <div className="flex items-center space-x-4 text-body-sm text-text-secondary">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} />
            <span>Progress: {visibleSteps.length} / {stepLog.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Layers" size={16} />
            <span>Algorithm: {algorithmType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepLogPanel;