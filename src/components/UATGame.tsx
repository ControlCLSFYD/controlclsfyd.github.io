
import React, { useState, useEffect, useRef } from 'react';
import TetrisGame from './TetrisGame';
import { BaseGameProps } from '../interfaces/GameInterfaces';

const UATGame: React.FC<BaseGameProps> = (props) => {
  const [wPressCount, setWPressCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Check if 'w' key is pressed
      if (key === 'w') {
        setWPressCount(prev => {
          const newCount = prev + 1;
          
          // Check if we've reached 33 presses
          if (newCount === 33) {
            console.log("Secret key activated: UAT victory!");
            setGameWon(true);
            
            // Trigger game completion after a short delay
            setTimeout(() => {
              if (props.onGameComplete) {
                props.onGameComplete();
              }
            }, 500);
          }
          
          return newCount;
        });
      } else {
        // Reset count if any other key is pressed
        setWPressCount(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [props]);

  // Add custom styles to the container to increase mobile scaling
  useEffect(() => {
    const applyMobileScaling = () => {
      if (containerRef.current && window.innerWidth < 768) {
        // Get available height and width
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Calculate scaling factors to make game fill more of the screen
        const container = containerRef.current;
        const gameCanvas = container.querySelector('canvas');
        
        if (gameCanvas) {
          // Original dimensions
          const originalWidth = gameCanvas.width;
          const originalHeight = gameCanvas.height;
          
          // Calculate scaling to fit viewport (with margins)
          const scaleX = (viewportWidth * 0.9) / originalWidth;
          const scaleY = (viewportHeight * 0.6) / originalHeight;
          const scale = Math.min(scaleX, scaleY);
          
          // Apply scaling
          gameCanvas.style.transform = `scale(${scale})`;
          gameCanvas.style.transformOrigin = 'top center';
          gameCanvas.style.marginBottom = `${(originalHeight * scale) - originalHeight}px`;
        }
      }
    };
    
    // Apply initially and on resize
    applyMobileScaling();
    window.addEventListener('resize', applyMobileScaling);
    
    return () => window.removeEventListener('resize', applyMobileScaling);
  }, []);

  // Pass the original Tetris props along with a forced win if secret is activated
  return (
    <div ref={containerRef} className="uatGameContainer">
      <TetrisGame 
        {...props}
        forceWin={gameWon} 
      />
      
      {/* Mobile game scaling styles */}
      <style jsx>{`
        @media (max-width: 767px) {
          .uatGameContainer :global(canvas) {
            display: block;
            margin: 0 auto;
          }
          
          .uatGameContainer :global(.grid) {
            transform: scale(1.25);
            transform-origin: top center;
          }
        }
      `}</style>
    </div>
  );
};

export default UATGame;
