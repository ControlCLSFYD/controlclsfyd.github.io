
import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface MobileControlsProps {
  onDirectionPress: (direction: 'up' | 'left' | 'right' | 'down', pressed: boolean) => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({ onDirectionPress }) => {
  // Helper function to handle touch events
  const handleTouchStart = (direction: 'up' | 'left' | 'right' | 'down') => {
    onDirectionPress(direction, true);
  };

  const handleTouchEnd = (direction: 'up' | 'left' | 'right' | 'down') => {
    onDirectionPress(direction, false);
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-20">
      <div className="grid grid-cols-3 gap-2">
        {/* Up Button */}
        <div className="col-start-2">
          <button
            className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center border-2 border-terminal-green text-terminal-green"
            onTouchStart={() => handleTouchStart('up')}
            onTouchEnd={() => handleTouchEnd('up')}
            onMouseDown={() => handleTouchStart('up')}
            onMouseUp={() => handleTouchEnd('up')}
            onMouseLeave={() => handleTouchEnd('up')}
          >
            <ArrowUp size={24} />
          </button>
        </div>
        
        {/* Left Button */}
        <div className="col-start-1 row-start-2">
          <button
            className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center border-2 border-terminal-green text-terminal-green"
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={() => handleTouchEnd('left')}
            onMouseDown={() => handleTouchStart('left')}
            onMouseUp={() => handleTouchEnd('left')}
            onMouseLeave={() => handleTouchEnd('left')}
          >
            <ArrowLeft size={24} />
          </button>
        </div>
        
        {/* Right Button */}
        <div className="col-start-3 row-start-2">
          <button
            className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center border-2 border-terminal-green text-terminal-green"
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={() => handleTouchEnd('right')}
            onMouseDown={() => handleTouchStart('right')}
            onMouseUp={() => handleTouchEnd('right')}
            onMouseLeave={() => handleTouchEnd('right')}
          >
            <ArrowRight size={24} />
          </button>
        </div>
        
        {/* Down Button */}
        <div className="col-start-2 row-start-3">
          <button
            className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center border-2 border-terminal-green text-terminal-green"
            onTouchStart={() => handleTouchStart('down')}
            onTouchEnd={() => handleTouchEnd('down')}
            onMouseDown={() => handleTouchStart('down')}
            onMouseUp={() => handleTouchEnd('down')}
            onMouseLeave={() => handleTouchEnd('down')}
          >
            <ArrowDown size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;
