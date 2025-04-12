
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface GameControlsProps {
  handleLeftButton: () => void;
  handleRightButton: () => void;
  handleButtonUp: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  handleLeftButton, 
  handleRightButton, 
  handleButtonUp 
}) => {
  return (
    <div className="mt-4 w-full max-w-[600px]">
      <div className="grid grid-cols-2 gap-4">
        <button
          onTouchStart={handleLeftButton}
          onTouchEnd={handleButtonUp}
          className="py-6 px-4 bg-gray-800 rounded-lg flex items-center justify-center border border-terminal-green h-24"
        >
          <ArrowLeft size={32} color="#D6BCFA" />
        </button>
        <button
          onTouchStart={handleRightButton}
          onTouchEnd={handleButtonUp}
          className="py-6 px-4 bg-gray-800 rounded-lg flex items-center justify-center border border-terminal-green h-24"
        >
          <ArrowRight size={32} color="#D6BCFA" />
        </button>
      </div>
    </div>
  );
};

export default GameControls;
