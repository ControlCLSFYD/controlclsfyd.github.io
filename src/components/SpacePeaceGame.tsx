import React, { useState, useEffect, useRef } from 'react';
import SpacewarGame from './SpacewarGame';
import { BaseGameProps } from '../interfaces/GameInterfaces';

const SECRET_PATTERN = "pspspspspspspspspspspsps"; // 22 characters
const PATTERN_SEGMENT = "psps"; // 4 characters

const SpacePeaceGame: React.FC<BaseGameProps> = (props) => {
  const [secretBuffer, setSecretBuffer] = useState("");
  const [patternCount, setPatternCount] = useState(0);
  const [consecutivePatternCount, setConsecutivePatternCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showPurr, setShowPurr] = useState(false);
  const [showLargePurr, setShowLargePurr] = useState(false);
  const [showTear, setShowTear] = useState(false);
  const purrRef = useRef<HTMLDivElement>(null);
  const tearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key.length === 1) { // Only process single characters
        // Add the new key to our buffer
        const newBuffer = secretBuffer + key;
        
        // Check if the buffer ends with the pattern segment
        if (newBuffer.endsWith(PATTERN_SEGMENT)) {
          setConsecutivePatternCount(prev => prev + 1);
          
          if (consecutivePatternCount === 1) {
            setShowPurr(true);
            setTimeout(() => setShowPurr(false), 1500);
          }
          
          setPatternCount(prev => prev + 1);
          
          // Check if we've reached 8 repetitions for the tear animation
          if (patternCount === 8) {
            setShowTear(true);
            setShowLargePurr(true);
          }
          
          // Check if we've reached the total needed count (12 repetitions)
          if (patternCount === 11) {
            console.log("Secret pattern completed 12 times!");
            setGameWon(true);
            
            // Trigger game completion after a short delay
            setTimeout(() => {
              if (props.onGameComplete) {
                props.onGameComplete();
              }
            }, 800);
          }
        } else if (!newBuffer.endsWith(PATTERN_SEGMENT.substring(0, newBuffer.length % PATTERN_SEGMENT.length))) {
          // Reset consecutive count if pattern is broken
          setConsecutivePatternCount(0);
        }
        
        // Keep buffer at reasonable size
        if (newBuffer.length > 50) {
          setSecretBuffer(newBuffer.substring(newBuffer.length - 50));
        } else {
          setSecretBuffer(newBuffer);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [secretBuffer, consecutivePatternCount, patternCount, props]);

  return (
    <div className="relative">
      <SpacewarGame {...props} forceWin={gameWon} />
      
      {/* Small purr text */}
      {showPurr && (
        <div 
          ref={purrRef}
          className="absolute text-terminal-green text-xs opacity-70 animate-pulse"
          style={{ bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}
        >
          purrr
        </div>
      )}
      
      {/* Tear animation */}
      {showTear && (
        <div 
          ref={tearRef}
          className="absolute bg-terminal-green rounded-full opacity-70"
          style={{ 
            width: '4px', 
            height: '8px', 
            top: '50%', 
            left: '50%',
            animation: 'tearDrop 3s ease-in infinite'
          }}
        />
      )}
      
      {/* Large PURR text */}
      {showLargePurr && (
        <div 
          className="absolute text-terminal-green text-lg font-bold opacity-80"
          style={{ bottom: '15px', left: '50%', transform: 'translateX(-50%)' }}
        >
          PURR
        </div>
      )}
      
      <style jsx>{`
        @keyframes tearDrop {
          0% { transform: translate(-50%, -50%); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translate(-50%, 100px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SpacePeaceGame;
