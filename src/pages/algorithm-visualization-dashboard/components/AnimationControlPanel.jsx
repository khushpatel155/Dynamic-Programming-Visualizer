import React from 'react';
import Button from '../../../components/ui/Button';


const AnimationControlPanel = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  currentStep,
  totalSteps,
  animationSpeed,
  onSpeedChange,
  canStepForward,
  canStepBackward,
  isCalculating
}) => {
  const speedOptions = [
    { value: 'slow', label: 'Slow', duration: '800ms' },
    { value: 'normal', label: 'Normal', duration: '400ms' },
    { value: 'fast', label: 'Fast', duration: '200ms' }
  ];

  const progressPercentage = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="bg-surface border border-border rounded-lg shadow-educational p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playback Controls */}
        <div className="space-y-4">
          <h3 className="text-heading-sm text-text-primary">Playback Controls</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={onStepBackward}
              iconName="ChevronLeft"
              disabled={!canStepBackward || isCalculating}
              size="sm"
            />
            <Button
              variant="primary"
              onClick={isPlaying ? onPause : onPlay}
              iconName={isPlaying ? "Pause" : "Play"}
              iconPosition="left"
              disabled={isCalculating}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="secondary"
              onClick={onStepForward}
              iconName="ChevronRight"
              disabled={!canStepForward || isCalculating}
              size="sm"
            />
            <Button
              variant="outline"
              onClick={onReset}
              iconName="RotateCcw"
              disabled={isCalculating}
              size="sm"
            />
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-4">
          <h3 className="text-heading-sm text-text-primary">Animation Speed</h3>
          <div className="flex space-x-2">
            {speedOptions.map((speed) => (
              <button
                key={speed.value}
                onClick={() => onSpeedChange(speed.value)}
                disabled={isCalculating}
                className={`px-3 py-2 rounded-lg text-body-sm transition-educational ${
                  animationSpeed === speed.value
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-surface-100 text-text-secondary hover:bg-surface-200'
                } ${isCalculating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {speed.label}
              </button>
            ))}
          </div>
          <p className="text-caption text-text-muted">
            Current: {speedOptions.find(s => s.value === animationSpeed)?.duration}
          </p>
        </div>

        {/* Progress Status */}
        <div className="space-y-4">
          <h3 className="text-heading-sm text-text-primary">Progress Status</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-body-sm text-text-secondary mb-2">
                <span>Step Progress</span>
                <span>{currentStep + 1} / {totalSteps}</span>
              </div>
              <div className="w-full bg-surface-200 rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-educational"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-body-sm">
              <div className={`w-3 h-3 rounded-full ${
                isPlaying ? 'bg-success animate-pulse' : 'bg-surface-200'
              }`}></div>
              <span className="text-text-secondary">
                {isPlaying ? 'Playing' : isCalculating ? 'Calculating' : 'Paused'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationControlPanel;