import React, { useState } from 'react';
import InputPanel from '../../../components/ui/InputPanel';
import AlgorithmSelectionPanel from '../../../components/ui/AlgorithmSelectionPanel';
import { commonAlgorithms } from '../../../utils/algorithmDefinitions';

const HouseRobberInputPanel = ({ 
  inputValues, 
  onInputChange, 
  onCalculate, 
  isCalculating, 
  selectedAlgorithm, 
  onAlgorithmChange 
}) => {
  const [inputString, setInputString] = useState(inputValues.join(', '));
  const [inputError, setInputError] = useState('');

  const inputConfig = {
    label: 'House Values (comma-separated)',
    inputId: 'house-values-input',
    inputType: 'text',
    inputValue: inputString,
    placeholder: 'e.g., 2, 7, 9, 3, 1',
    description: `Rob houses: [${inputValues.join(', ')}] - Maximum without adjacent houses`
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputString(value);
    setInputError('');
    
    if (value.trim() === '') {
      onInputChange([]);
      return;
    }

    try {
      // Parse comma-separated values
      const values = value.split(',').map(v => {
        const trimmed = v.trim();
        if (trimmed === '') return null;
        const num = parseInt(trimmed);
        if (isNaN(num)) throw new Error('Invalid number');
        return num;
      }).filter(v => v !== null);

      if (values.length === 0) {
        setInputError('Please enter at least one house value');
        return;
      }

      if (values.some(v => v < 0)) {
        setInputError('House values must be non-negative');
        return;
      }

      if (values.length > 7) {
        setInputError('Please enter no more than 7 house values for better visualization');
        return;
      }

      onInputChange(values);
    } catch (error) {
      setInputError('Please enter valid numbers separated by commas');
    }
  };

  const handleCalculate = () => {
    if (!inputValues || inputValues.length === 0) {
      setInputError('Please enter house values');
      return;
    }

    if (inputValues.some(v => v < 0)) {
      setInputError('House values must be non-negative');
      return;
    }

    if (inputValues.length > 7) {
      setInputError('Please enter no more than 7 house values');
      return;
    }

    setInputError('');
    onCalculate();
  };

  const handlePresetExample = (example) => {
    const exampleString = example.join(', ');
    setInputString(exampleString);
    setInputError('');
    onInputChange(example);
  };

  const examples = [
    { name: 'Simple Example', values: [2, 7, 9, 3] },
    { name: 'Even Distribution', values: [5, 5, 5, 5] },
    { name: 'Increasing Values', values: [1, 2, 3, 4] },
    { name: 'Edge Case', values: [10, 1, 1, 10] }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg shadow-educational p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <InputPanel
            inputConfig={inputConfig}
            onInputChange={handleInputChange}
            onCalculate={handleCalculate}
            isCalculating={isCalculating}
            inputError={inputError}
            setInputError={setInputError}
          >
          {/* Example Presets */}
          <div className="space-y-2">
            <label className="block text-body-sm font-medium text-text-primary">
              Quick Examples
            </label>
            <div className="grid grid-cols-2 gap-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetExample(example.values)}
                  disabled={isCalculating}
                  className="px-3 py-2 text-body-sm bg-surface-100 hover:bg-surface-200 border border-border rounded-md transition-colors disabled:opacity-50"
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>
          </InputPanel>
        </div>

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

export default HouseRobberInputPanel;