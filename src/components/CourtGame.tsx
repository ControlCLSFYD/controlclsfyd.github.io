
import React, { useEffect, useState, useRef } from 'react';
import PongGame from './PongGame';
import { BaseGameProps } from '../interfaces/GameInterfaces';

const SECRET_PHRASE = "i can handle the truth";

const CourtGame: React.FC<BaseGameProps> = (props) => {
  const [secretBuffer, setSecretBuffer] = useState("");
  const secretRef = useRef(SECRET_PHRASE);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key.length === 1) { // Only process single characters
        // Add the new key to our buffer
        const newBuffer = secretBuffer + key;
        
        // Check if the buffer contains the correct sequence
        if (SECRET_PHRASE.startsWith(newBuffer)) {
          setSecretBuffer(newBuffer);
          
          // Check if the full phrase has been typed
          if (newBuffer === SECRET_PHRASE) {
            console.log("Secret phrase completed: Court victory!");
            setGameWon(true);
            
            // Trigger game completion after a short delay
            setTimeout(() => {
              if (props.onGameComplete) {
                props.onGameComplete();
              }
            }, 500);
          }
        } else {
          // Reset buffer if wrong key is pressed
          setSecretBuffer("");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [secretBuffer, props]);

  // Pass the original PongGame props along with a forced win if secret is activated
  return (
    <PongGame 
      {...props} 
      forceWin={gameWon}
    />
  );
};

export default CourtGame;
