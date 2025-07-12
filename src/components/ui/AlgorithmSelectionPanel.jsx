import React from 'react';
import AlgorithmSelectionCard from './AlgorithmSelectionCard';

const AlgorithmSelectionPanel = ({ 
  algorithms, 
  selectedAlgorithm, 
  onAlgorithmChange, 
  isDisabled = false 
}) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      <h3 className="text-heading-sm text-text-primary">Algorithm Selection</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {algorithms.map((algorithm) => (
          <AlgorithmSelectionCard
            key={algorithm.id}
            algorithm={algorithm}
            isSelected={selectedAlgorithm === algorithm.id}
            isDisabled={isDisabled}
            onClick={() => onAlgorithmChange(algorithm.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AlgorithmSelectionPanel; 