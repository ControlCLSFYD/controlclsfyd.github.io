
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
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        gameStateRef.current = initializeGame(canvas.width, canvas.height, difficulty);
        drawGame(ctx, gameStateRef.current);
      }
    }
  }, [canvasRef, difficulty, gameStateRef]);
};
