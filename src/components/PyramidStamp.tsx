
import React, { useEffect, useState } from 'react';

const PyramidStamp: React.FC = () => {
  const [heartPosition, setHeartPosition] = useState(0);
  
  // Animation for floating heart
  useEffect(() => {
    const animateHeart = () => {
      const floatRange = 3; // Reduced float range
      const duration = 2000; // milliseconds for a complete cycle
      
      const animation = (timestamp: number) => {
        // Calculate position based on time
        const position = Math.sin((timestamp % duration) / duration * Math.PI * 2) * floatRange;
        setHeartPosition(position);
        requestAnimationFrame(animation);
      };
      
      const animationFrame = requestAnimationFrame(animation);
      return () => cancelAnimationFrame(animationFrame);
    };
    
    return animateHeart();
  }, []);

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <div className="relative w-8 h-12 text-terminal-green">
        {/* Heart - animated to float up and down */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2" 
          style={{ 
            transform: `translate(-50%, ${heartPosition}px)`,
            top: '-4px'
          }}
        >
          {/* Smaller, pixelated heart */}
          <div className="grid grid-cols-5 gap-0">
            {/* Reduced heart grid to match image */}
            <div className="w-1 h-1"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1"></div>
            
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            
            <div className="w-1 h-1"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1"></div>
          </div>
        </div>
        
        {/* Pyramid base - static and slightly longer */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          {/* Top row of pyramid */}
          <div className="flex justify-center">
            <div className="w-6 h-0.5 border-t border-terminal-green"></div>
          </div>
          
          {/* Middle rows with slight extension */}
          <div className="relative h-4">
            <div className="absolute left-0 top-0 h-full w-0.5 bg-terminal-green transform -skew-x-12"></div>
            <div className="absolute right-0 top-0 h-full w-0.5 bg-terminal-green transform skew-x-12"></div>
          </div>
          
          {/* Bottom row of pyramid extended */}
          <div className="w-8 h-0.5 bg-terminal-green"></div>
        </div>
      </div>
    </div>
  );
};

export default PyramidStamp;
