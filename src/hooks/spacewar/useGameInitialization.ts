
import { useEffect } from 'react';
import { initializeGame } from '../../utils/spacewarGameUtils';
import { drawGame } from '../../utils/spacewarRenderer';
import { GameStateRef } from './types';

interface UseGameInitializationProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  gameStateRef: React.MutableRefObject<GameStateRef | null>;
  difficulty: number;
}

export const useGameInitialization = ({
  canvasRef,
  gameStateRef,
  difficulty
}: UseGameInitializationProps) => {
  useEffect(() => {
    const initializeCanvas = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Initialize game state
          gameStateRef.current = initializeGame(canvas.width, canvas.height, difficulty);
          
          // Draw initial game state
          drawGame(ctx, gameStateRef.current);
          
          console.log('Game initialized with difficulty:', difficulty);
        }
      }
    };
    
    // Initialize game
    initializeCanvas();
    
    // Re-initialize if difficulty changes
    return () => {
      // Clean up if needed
    };
  }, [canvasRef, difficulty, gameStateRef]);
};
