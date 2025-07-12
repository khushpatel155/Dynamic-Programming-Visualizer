import React, { useState } from 'react';
import InputPanel from '../../../components/ui/InputPanel';
import AlgorithmSelectionPanel from '../../../components/ui/AlgorithmSelectionPanel';
import { commonAlgorithms } from '../../../utils/algorithmDefinitions';

const FibonacciInputPanel = ({ 
  inputValue, 
  onInputChange, 
  onCalculate, 
  isCalculating, 
  selectedAlgorithm, 
  onAlgorithmChange 
}) => {
  const [inputError, setInputError] = useState('');

  const inputConfig = {
    label: 'Fibonacci Number (n)',
    inputId: 'fibonacci-input',
    inputType: 'number',
    inputValue,
    placeholder: 'Enter number (1-20)',
    min: '1',
    max: '20',
    description: `Calculate F(${inputValue || 'n'}) using selected algorithm`
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputError('');
    
    if (value === '') {
      onInputChange(value);
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setInputError('Please enter a valid number');
      return;
    }

    if (numValue < 1) {
      setInputError('Please enter a number > 0');
      return;
    }

    if (numValue > 20) {
      setInputError('Please enter a number ≤ 20 for better visualization');
      return;
    }

    onInputChange(value);
  };

  const handleCalculate = () => {
    if (!inputValue || inputValue === '') {
      setInputError('Please enter a number');
      return;
    }

    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 1 || numValue > 20) {
      setInputError('Please enter a valid number between 1 and 20');
      return;
    }

    setInputError('');
    onCalculate();
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-educational p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <InputPanel
          inputConfig={inputConfig}
          onInputChange={handleInputChange}
          onCalculate={handleCalculate}
          isCalculating={isCalculating}
          inputError={inputError}
          setInputError={setInputError}
        />

        {/* Algorithm Selection */}
        <AlgorithmSelectionPanel
          algorithms={commonAlgorithms}
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={onAlgorithmChange}
          isDisabled={isCalculating}
        />
      </div>
    </div>
  );
};

export default FibonacciInputPanel;