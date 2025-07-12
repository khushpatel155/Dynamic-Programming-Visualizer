import React from 'react';
import DPTableCard from '../../../components/ui/DPTableCard';
import { getCellColor } from '../../../utils/algorithmDefinitions';

const DPTableVisualization = ({ 
  tableData, 
  currentStep, 
  algorithmType,
  inputValue,
  executionTrace = []
}) => {
  const getCellValue = (index) => {
    if (!executionTrace.length) return '—';
    
    const relevantSteps = executionTrace.filter(step => 
      (step.index === index || step.nodeId?.includes(`f${index}`)) && 
      step.step <= currentStep
    );
    
    if (relevantSteps.length === 0) return '—';
    
    if (algorithmType === 'tabulation') {
      const computationStep = relevantSteps.find(step => 
        step.type === 'initialization' || step.type === 'computation'
      );
      if (computationStep) {
        return tableData?.dp?.[index] !== undefined ? tableData.dp[index] : '—';
      }
    } else if (algorithmType === 'memoization') {
      const returnStep = relevantSteps.find(step => 
        step.type === 'return' || step.type === 'cache_hit'
      );
      if (returnStep) {
        if (tableData?.cache?.has(index)) {
          return tableData.cache.get(index);
        }
        // Fallback calculation for display
        const fibValue = index <= 1 ? index : 
          index === 2 ? 1 : 
          index === 3 ? 2 : 
          index === 4 ? 3 : 
          index === 5 ? 5 : 
          index === 6 ? 8 : 
          index === 7 ? 13 : 
          index === 8 ? 21 : 
          index === 9 ? 34 : 
          index === 10 ? 55 : '—';
        return fibValue;
      }
    }
    
    return '—';
  };

  const maxIndex = parseInt(inputValue) || 7;
  const columnsToShow = maxIndex + 1;

  const columns = [
    {
      header: 'Fibonacci',
      cells: Array.from({ length: columnsToShow }, (_, i) => ({
        value: `F(${i})`,
        colorClass: 'bg-surface-50 text-text-secondary'
      }))
    },
    {
      header: 'Index',
      cells: Array.from({ length: columnsToShow }, (_, i) => ({
        value: i,
        colorClass: 'bg-surface-50 text-text-secondary'
      }))
    },
    {
      header: 'Value',
      cells: Array.from({ length: columnsToShow }, (_, i) => ({
        getValue: () => getCellValue(i),
        getColor: () => getCellColor(i, executionTrace, currentStep)
      }))
    }
  ];

  const scrollMessage = columnsToShow > 10 
    ? `Scroll horizontally to see all ${columnsToShow} values (F(0) to F(${columnsToShow - 1}))`
    : '';

  return (
    <DPTableCard
      tableData={tableData}
      currentStep={currentStep}
      algorithmType={algorithmType}
      executionTrace={executionTrace}
      columns={columns}
      showScrollIndicator={columnsToShow > 10}
      scrollMessage={scrollMessage}
    />
  );
};

export default DPTableVisualization;