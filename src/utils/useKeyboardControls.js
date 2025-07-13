import { useEffect, useCallback } from 'react';

const useKeyboardControls = ({
  onStepForward,
  onStepBackward,
  onPlay,
  onPause,
  isPlaying,
  canStepForward,
  canStepBackward,
  isCalculating,
  enabled = true
}) => {
  const handleKeyDown = useCallback((event) => {
    // Don't handle keyboard events if controls are disabled or calculating
    if (!enabled || isCalculating) return;
    
    // Don't handle keyboard events if user is typing in an input field
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
    
    switch (event.key) {
      case 'ArrowRight':
      case 'l':
        event.preventDefault();
        if (canStepForward) {
          onStepForward();
        }
        break;
        
      case 'ArrowLeft':
      case 'h':
        event.preventDefault();
        if (canStepBackward) {
          onStepBackward();
        }
        break;
        
      case ' ':
        event.preventDefault();
        if (isPlaying) {
          onPause();
        } else {
          onPlay();
        }
        break;
        
      case 'r':
        // Reset functionality could be added here if needed
        break;
        
      default:
        break;
    }
  }, [
    enabled,
    isCalculating,
    canStepForward,
    canStepBackward,
    isPlaying,
    onStepForward,
    onStepBackward,
    onPlay,
    onPause
  ]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);

  return null;
};

export default useKeyboardControls; 