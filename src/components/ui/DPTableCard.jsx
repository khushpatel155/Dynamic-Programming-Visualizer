import React from 'react';
import Icon from '../AppIcon';

const DPTableCard = ({ 
  tableData, 
  currentStep, 
  algorithmType,
  executionTrace = [],
  title,
  columns,
  getCellValue,
  getCellColor,
  showScrollIndicator = true,
  scrollMessage = ''
}) => {
  if (!tableData && !executionTrace.length) {
    return (
      <div className="bg-surface border border-border rounded-lg shadow-educational">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name={algorithmType === 'tabulation' ? 'Table' : 'Database'} size={20} className="text-primary" />
            <h3 className="text-heading-sm text-text-primary">
              {algorithmType === 'tabulation' ? 'DP Table' : 'Memoization Cache'}
            </h3>
          </div>
        </div>
        <div className="p-6 flex items-center justify-center">
          <p className="text-text-secondary">Click "Start Visualization" to see the {algorithmType === 'tabulation' ? 'DP table' : 'memoization cache'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg shadow-educational">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name={algorithmType === 'tabulation' ? 'Table' : 'Database'} size={20} className="text-primary" />
          <h3 className="text-heading-sm text-text-primary">
            {algorithmType === 'tabulation' ? 'DP Table' : 'Memoization Cache'}
          </h3>
        </div>
        <div className="flex items-center space-x-4 text-body-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
            <span className="text-text-secondary">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 border border-green-400 rounded"></div>
            <span className="text-text-secondary">Computed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-400 rounded"></div>
            <span className="text-text-secondary">Reused</span>
          </div>
        </div>
      </div>

      <div className="p-3">
        {/* Centered table container */}
        <div className="flex justify-center">
          <div className="border border-border-light rounded-lg overflow-hidden">
            <div className="min-w-0">
              {columns.map((column, columnIndex) => (
                <div 
                  key={columnIndex} 
                  className={`flex border-b border-border-light bg-surface-50 ${columnIndex === columns.length - 1 ? 'border-b-0' : ''}`}
                >
                  <div className="flex-shrink-0 w-20 text-center text-body-sm font-medium text-text-secondary py-2 px-2 border-r border-border-light bg-surface-50">
                    {column.header}
                  </div>
                  {column.cells.map((cell, cellIndex) => {
                    const value = cell.getValue ? cell.getValue(cellIndex) : cell.value;
                    const colorClass = cell.getColor ? cell.getColor(cellIndex) : cell.colorClass;
                    
                    return (
                      <div
                        key={cellIndex}
                        className={`flex-shrink-0 w-20 text-center py-2 px-2 border-r border-border-light last:border-r-0 border-2 transition-educational font-mono text-body-sm ${colorClass}`}
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        {showScrollIndicator && scrollMessage && (
          <div className="text-center text-body-sm text-text-secondary mt-2">
            <Icon name="ArrowLeftRight" size={16} className="inline mr-1" />
            {scrollMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default DPTableCard; 