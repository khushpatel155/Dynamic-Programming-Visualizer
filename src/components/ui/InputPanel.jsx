import React from 'react';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const InputPanel = ({ 
  inputConfig,
  onInputChange,
  onCalculate,
  isCalculating,
  inputError,
  setInputError,
  children
}) => {
  const {
    label,
    inputId,
    inputType = 'text',
    inputValue,
    placeholder,
    min,
    max,
    disabled = false,
    description,
    buttonText = 'Start Visualization',
    loadingText = 'Calculating...'
  } = inputConfig;

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={inputId} className="block text-body-sm font-medium text-text-primary mb-2">
          {label}
        </label>
        <div className="space-y-2">
          <Input
            id={inputId}
            type={inputType}
            value={inputValue}
            onChange={onInputChange}
            placeholder={placeholder}
            min={min}
            max={max}
            disabled={disabled || isCalculating}
            className="w-full"
          />
          {inputError && (
            <div className="flex items-center space-x-2 text-error text-body-sm">
              <Icon name="AlertCircle" size={16} />
              <span>{inputError}</span>
            </div>
          )}
          {description && (
            <p className="text-caption text-text-muted">
              {description}
            </p>
          )}
        </div>
      </div>

      <Button
        variant="primary"
        onClick={onCalculate}
        disabled={isCalculating || inputError}
        loading={isCalculating}
        iconName="Play"
        iconPosition="left"
        fullWidth
      >
        {isCalculating ? loadingText : buttonText}
      </Button>

      {children}
    </div>
  );
};

export default InputPanel; 