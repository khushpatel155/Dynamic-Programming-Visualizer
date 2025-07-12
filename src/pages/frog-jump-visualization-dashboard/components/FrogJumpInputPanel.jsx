import React, { useState } from 'react';
import InputPanel from '../../../components/ui/InputPanel';
import AlgorithmSelectionPanel from '../../../components/ui/AlgorithmSelectionPanel';
import { getAlgorithmsForProblem } from '../../../utils/algorithmDefinitions';

const FrogJumpInputPanel = ({ 
  inputValues, 
  kValue,
  onInputChange, 
  onKChange,
  onCalculate, 
  isCalculating, 
  selectedAlgorithm, 
  onAlgorithmChange 
}) => {
  const [inputString, setInputString] = useState(inputValues.join(', '));
  const [inputError, setInputError] = useState('');

  const inputConfig = {
    label: 'Step Heights (comma-separated)',
    inputId: 'heights-input',
    inputType: 'text',
    inputValue: inputString,
    placeholder: 'e.g., 10, 5, 20, 0, 15',
    description: `Current heights: [${inputValues.join(', ')}] | Max Jump: ${kValue}`
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
        setInputError('Please enter at least one height value');
        return;
      }

      if (values.length > 7) {
        setInputError('Please enter no more than 7 height values for better visualization');
        return;
      }

      // Check if current k value is valid for the new array size
      if (kValue > values.length) {
        setInputError(`K (${kValue}) cannot be greater than array size (${values.length}). Please reduce K.`);
        return;
      }
      
      onInputChange(values);
    } catch (error) {
      setInputError('Please enter valid numbers separated by commas');
    }
  };

  const handleKChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 4) {
      // Check if k is not greater than array size
      if (inputValues.length > 0 && value > inputValues.length) {
        setInputError(`K cannot be greater than array size (${inputValues.length})`);
        return;
      }
      onKChange(value);
      setInputError('');
    } else {
      setInputError('K must be between 1 and 4');
    }
  };

  const handleCalculate = () => {
    if (!inputValues || inputValues.length === 0) {
      setInputError('Please enter height values');
      return;
    }

    if (kValue < 1 || kValue > 4) {
      setInputError('K must be between 1 and 4');
      return;
    }

    if (kValue > inputValues.length) {
      setInputError(`K cannot be greater than array size (${inputValues.length})`);
      return;
    }

    if (inputValues.length > 7) {
      setInputError('Please enter no more than 7 height values');
      return;
    }

    setInputError('');
    onCalculate();
  };

  const handlePresetExample = (example) => {
    const exampleString = example.heights.join(', ');
    setInputString(exampleString);
    setInputError('');
    onInputChange(example.heights);
    onKChange(example.k);
  };

  const examples = [
    { name: 'Example 1', heights: [10, 5, 20, 0], k: 2 },
    { name: 'Example 2', heights: [15, 4, 1, 14], k: 3 },
    { name: 'Simple Case', heights: [1, 2, 3, 4], k: 2 },
    { name: 'Equal Heights', heights: [5, 5, 5, 5], k: 3 }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg shadow-educational p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          {/* K Value Input */}
          <div className="space-y-2">
            <label htmlFor="k-input" className="block text-body-sm font-medium text-text-primary">
              Maximum Jump Distance (k)
            </label>
            <input
              id="k-input"
              type="number"
              min="1"
              max="4"
              value={kValue}
              onChange={handleKChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-body-sm text-text-secondary">
              Frog can jump up to {kValue} steps at a time
            </p>
          </div>

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
                    onClick={() => handlePresetExample(example)}
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
          algorithms={getAlgorithmsForProblem('frog-jump')}
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={onAlgorithmChange}
          isDisabled={isCalculating}
        />
      </div>
    </div>
  );
};

export default FrogJumpInputPanel; 