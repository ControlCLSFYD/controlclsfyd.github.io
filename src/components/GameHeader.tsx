
import React from 'react';
import TypewriterText from './TypewriterText';
import CountdownTimer from './CountdownTimer';
import ProgressTracker from './ProgressTracker';

interface GameHeaderProps {
  level: number;
  isActive: boolean;
  timerDuration: number;
  progress?: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  level, 
  isActive, 
  timerDuration,
  progress = 0 
}) => {
  return (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between items-center h-[40px] mb-2">
        <TypewriterText 
          text={`LEVEL ${level}`} 
          className="text-xl"
        />
        {isActive && (
          <CountdownTimer 
            initialTime={timerDuration}
            isActive={isActive}
          />
        )}
      </div>
      
      {/* Small progress tracker at the bottom */}
      <ProgressTracker value={progress} className="mt-1" />
    </div>
  );
};

export default GameHeader;
