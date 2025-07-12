import React from 'react';
import DPTableCard from '../../../components/ui/DPTableCard';
import { getCellColor } from '../../../utils/algorithmDefinitions';

const HouseRobberTableVisualization = ({ 
  tableData, 
  currentStep, 
  algorithmType, 
  inputValues, 
  executionTrace 
}) => {
  const getCellValue = (index) => {
    if (!executionTrace.length || !tableData) return '—';
    
    const relevantSteps = executionTrace.filter(step => 
      step.index === index && step.step <= currentStep
    );
    
    if (relevantSteps.length === 0) return '—';

    if (algorithmType === 'tabulation') {
      return tableData.dp?.[index] !== undefined ? tableData.dp[index] : '—';
    } else if (algorithmType === 'memoization') {
      // Check if there's a return or cache_hit step for this index
      const returnStep = relevantSteps.find(step => 
        step.type === 'return' || step.type === 'cache_hit'
      );
      
      if (returnStep && tableData.memo?.has(index)) {
        return tableData.memo.get(index);
      }
    }
    
    return '—';
  };

  const n = inputValues?.length || 0;

  const columns = [
    {
      header: 'Houses',
      cells: Array.from({ length: n }, (_, i) => ({
        value: inputValues[i],
        colorClass: 'bg-surface-50 text-text-secondary'
      }))
    },
    {
      header: 'Index',
      cells: Array.from({ length: n }, (_, i) => ({
        value: i,
        colorClass: 'bg-surface-50 text-text-secondary'
      }))
    },
    {
      header: algorithmType === 'tabulation' ? 'DP' : 'Memo',
      cells: Array.from({ length: n }, (_, i) => ({
        getValue: () => getCellValue(i),
        getColor: () => getCellColor(i, executionTrace, currentStep)
      }))
    }
  ];

  const scrollMessage = n > 10 ? `Scroll horizontally to see all ${n} values` : '';

  return (
    <DPTableCard
      tableData={tableData}
      currentStep={currentStep}
      algorithmType={algorithmType}
      executionTrace={executionTrace}
      columns={columns}
      showScrollIndicator={n > 10}
      scrollMessage={scrollMessage}
    />
  );
};

export default HouseRobberTableVisualization;