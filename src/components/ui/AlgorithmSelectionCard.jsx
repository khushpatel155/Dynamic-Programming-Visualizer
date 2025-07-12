import React from 'react';
import Icon from '../AppIcon';

const AlgorithmSelectionCard = ({ 
  algorithm, 
  isSelected, 
  isDisabled = false, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`p-4 rounded-lg border-2 text-left transition-educational ${
        isSelected
          ? 'border-primary bg-primary-50 shadow-educational'
          : 'border-border bg-surface hover:border-primary-200 hover:bg-surface-50'
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${
          isSelected 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-surface-100 text-text-secondary'
        }`}>
          <Icon name={algorithm.icon} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-body-md font-medium ${
            isSelected ? 'text-primary' : 'text-text-primary'
          }`}>
            {algorithm.name}
          </h4>
          <p className="text-body-sm text-text-secondary mt-1">
            {algorithm.description}
          </p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center space-x-2">
              <span className={`text-caption px-2 py-1 rounded font-mono ${
                isSelected 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-surface-100 text-text-secondary'
              }`}>
                Time: {algorithm.timeComplexity}
              </span>
              <span className={`text-caption px-2 py-1 rounded font-mono ${
                isSelected 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-surface-100 text-text-secondary'
              }`}>
                Space: {algorithm.spaceComplexity}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default AlgorithmSelectionCard; 