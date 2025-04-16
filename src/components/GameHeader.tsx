
import React from 'react';
import TypewriterText from './TypewriterText';
import CountdownTimer from './CountdownTimer';

interface GameHeaderProps {
  level: number;
  isActive: boolean;
  timerDuration: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ level, isActive, timerDuration }) => {
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
        />
      )}
    </div>
  );
};

export default GameHeader;
