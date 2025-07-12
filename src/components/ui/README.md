# Reusable UI Components

This directory contains reusable UI components that are shared across different problem visualizations in the DP Visualizer application.

## Components

### DPTableCard
A reusable component for displaying dynamic programming tables and memoization caches.

**Props:**
- `tableData` - The data to display in the table
- `currentStep` - Current animation step
- `algorithmType` - Type of algorithm ('tabulation' or 'memoization')
- `executionTrace` - Array of execution steps for animation
- `columns` - Array of column definitions
- `showScrollIndicator` - Whether to show horizontal scroll indicator
- `scrollMessage` - Custom scroll message

**Usage:**
```jsx
<DPTableCard
  tableData={tableData}
  currentStep={currentStep}
  algorithmType="tabulation"
  executionTrace={executionTrace}
  columns={columns}
  showScrollIndicator={true}
  scrollMessage="Scroll to see all values"
/>
```

### AlgorithmSelectionCard
A reusable card component for algorithm selection.

**Props:**
- `algorithm` - Algorithm object with id, name, description, timeComplexity, spaceComplexity, icon
- `isSelected` - Whether this algorithm is currently selected
- `isDisabled` - Whether the card is disabled
- `onClick` - Click handler function

### AlgorithmSelectionPanel
A panel component that contains a grid of algorithm selection cards.

**Props:**
- `algorithms` - Array of algorithm objects
- `selectedAlgorithm` - Currently selected algorithm ID
- `onAlgorithmChange` - Handler for algorithm selection changes
- `isDisabled` - Whether the panel is disabled

### InputPanel
A reusable input panel component with validation and error handling.

**Props:**
- `inputConfig` - Configuration object for the input field
- `onInputChange` - Input change handler
- `onCalculate` - Calculate button click handler
- `isCalculating` - Whether calculation is in progress
- `inputError` - Error message to display
- `setInputError` - Function to set error message
- `children` - Additional content to render below the input

## Utilities

### algorithmDefinitions.js
Contains common algorithm definitions and utility functions.

**Exports:**
- `commonAlgorithms` - Array of algorithm objects for recursive, memoization, and tabulation
- `getCellColor` - Function to determine cell color based on execution state

## Benefits

1. **Consistency** - All problem visualizations use the same UI components
2. **Maintainability** - Changes to UI logic only need to be made in one place
3. **Reusability** - Easy to add new problem types using existing components
4. **Type Safety** - Consistent prop interfaces across components
5. **Performance** - Shared components can be optimized once for all use cases 