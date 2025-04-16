
import { useEffect } from 'react';
import { GameState } from '../../interfaces/GameInterfaces';

interface UseKeyboardEventsProps {
  keysPressed: React.MutableRefObject<{[key: string]: boolean}>;
  showInstructions: boolean;
  gameState: GameState;
  setShowInstructions: (show: boolean) => void;
  setGameState: (gameState: GameState) => void;
  handleContinue: () => void;
}

export const useKeyboardEvents = ({
  keysPressed,
  showInstructions,
  gameState,
  setShowInstructions,
  setGameState,
  handleContinue
}: UseKeyboardEventsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for game controls to avoid scrolling
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keysPressed.current[e.key] = true;
      } else if (e.key === ' ' || e.key === 'Enter') {
        // Start game or continue after game over
        if (showInstructions) {
          setShowInstructions(false);
          setGameState({ ...gameState, gameStarted: true });
        } else if (gameState.gameOver) {
          handleContinue();
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keysPressed.current[e.key] = false;
      }
    };
    
    // Add focus to the document to ensure keyboard events are captured
    document.body.focus();
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [showInstructions, gameState, keysPressed, setShowInstructions, setGameState, handleContinue]);
};
