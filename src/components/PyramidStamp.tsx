
import React, { useEffect, useState } from 'react';

const PyramidStamp: React.FC = () => {
  const [heartPosition, setHeartPosition] = useState(0);
  
  // Animation for floating heart
  useEffect(() => {
    const animateHeart = () => {
      const floatRange = 2; // Reduced from 5 to make float more subtle
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
      <div className="relative w-6 h-8 text-terminal-green"> {/* Reduced from w-12 h-16 */}
        {/* Heart - animated to float up and down */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2" 
          style={{ 
            transform: `translate(-50%, ${heartPosition}px)`,
            top: '-2px' // Adjusted to match smaller size
          }}
        >
          {/* Pixelated heart with Chi Rho */}
          <div className="grid grid-cols-5 gap-0"> {/* Reduced from grid-cols-7 */}
            {/* Row 1 */}
            <div className="w-1 h-1"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1"></div>
            
            {/* Row 2 */}
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            
            {/* Row 3 */}
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            
            {/* Row 4 */}
            <div className="w-1 h-1"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1"></div>
            
            {/* Row 5 - Chi Rho symbol */}
            <div className="w-1 h-1"></div>
            <div className="w-1 h-1"></div>
            <div className="w-1 h-1 bg-terminal-green"></div>
            <div className="w-1 h-1"></div>
            <div className="w-1 h-1"></div>
          </div>
        </div>
        
        {/* Pyramid base - static and longer */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          {/* Top row of pyramid */}
          <div className="flex justify-center">
            <div className="w-5 h-0.5 border-t border-terminal-green"></div>
          </div>
          
          {/* Middle rows - made longer */}
          <div className="relative h-3"> {/* Reduced height for a longer look */}
            <div className="absolute left-0 top-0 h-full w-0.5 bg-terminal-green transform -skew-x-12"></div>
            <div className="absolute right-0 top-0 h-full w-0.5 bg-terminal-green transform skew-x-12"></div>
          </div>
          
          {/* Bottom row of pyramid - made wider */}
          <div className="w-8 h-0.5 bg-terminal-green"></div>
        </div>
      </div>
    </div>
  );
};

export default PyramidStamp;
