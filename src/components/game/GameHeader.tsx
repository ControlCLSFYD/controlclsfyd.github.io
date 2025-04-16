
import React from 'react';
import TypewriterText from '../TypewriterText';
import CountdownTimer from '../CountdownTimer';

interface GameHeaderProps {
  level: number;
  isActive: boolean;
  timerDuration: number;
  onTimeUp?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  level, 
  isActive, 
  timerDuration,
  onTimeUp
}) => {
  return (
    <div className="flex justify-between items-center h-[40px] mb-4">
      <TypewriterText 
        text={`LEVEL ${level}`} 
        className="text-xl"
      />
      {isActive && (
        <CountdownTimer 
          initialTime={timerDuration}
          isActive={isActive}
          onTimeUp={onTimeUp}
        />
      )}
    </div>
  );
};

export default GameHeader;
