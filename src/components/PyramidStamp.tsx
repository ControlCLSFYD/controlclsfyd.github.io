
import React, { useEffect, useState } from 'react';

/**
 * A small pyramid stamp with a floating heart that appears at the bottom of the page
 */
const PyramidStamp: React.FC = () => {
  const [yOffset, setYOffset] = useState(0);
  
  useEffect(() => {
    // Create smooth up and down floating animation
    let animationFrame: number;
    let startTime: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Simple sine wave animation for smooth up and down floating
      const newYOffset = Math.sin(elapsed / 1000) * 3; // 3px max displacement
      setYOffset(newYOffset);
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <div className="fixed bottom-2 left-0 right-0 flex justify-center items-end pointer-events-none z-10" style={{ opacity: 0.8 }}>
      <div className="relative w-16 h-16">
        {/* Base pyramid (static) */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <div 
            className="w-12 h-8 border-terminal-green"
            style={{
              borderStyle: 'solid',
              borderWidth: '0 1px 1px 1px',
              borderBottomWidth: '1px',
              background: 'transparent',
              clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
            }}
          />
        </div>
        
        {/* Floating heart with Chi Rho */}
        <div 
          className="absolute bottom-2 left-0 right-0 flex justify-center"
          style={{ transform: `translateY(${-4 + yOffset}px)` }}
        >
          <div className="relative">
            {/* Heart shape */}
            <div 
              className="w-5 h-4 bg-transparent border border-terminal-green"
              style={{
                clipPath: 'polygon(50% 0%, 100% 35%, 80% 100%, 50% 80%, 20% 100%, 0% 35%)',
                background: 'transparent'
              }}
            />
            
            {/* Chi Rho symbol (simplified) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-terminal-green text-xs" style={{ fontSize: '6px', marginTop: '-1px' }}>✝</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PyramidStamp;
