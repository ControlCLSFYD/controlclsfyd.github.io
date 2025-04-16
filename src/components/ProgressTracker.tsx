
import React from 'react';
import { Progress } from './ui/progress';

interface ProgressTrackerProps {
  value: number;
  className?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ value, className = '' }) => {
  // Cap the value between 0-100
  const cappedValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      <Progress 
        value={cappedValue} 
        className="h-1 bg-black border border-terminal-green"
        indicatorClassName="bg-terminal-green" 
      />
    </div>
  );
};

export default ProgressTracker;
