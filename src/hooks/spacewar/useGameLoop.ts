
import { useEffect, MutableRefObject } from 'react';
import { updateGameState } from '../../utils/spacewarGameUtils';
import { drawGame } from '../../utils/spacewarRenderer';
import { GameState } from '../../interfaces/GameInterfaces';
import { GameStateRef } from './types';

interface UseGameLoopProps {
  gameState: GameState;
  gameStateRef: MutableRefObject<GameStateRef | null>;
  gameLoop: MutableRefObject<number | null>;
  lastFrameTimeRef: MutableRefObject<number>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  keysPressed: MutableRefObject<{[key: string]: boolean}>;
  difficulty: number;
  isPageVisible: boolean;
  WINNING_SCORE: number;
  setUserScore: (score: number) => void;
  setComputerScore: (score: number) => void;
  setGameState: (state: GameState) => void;
}

export const useGameLoop = ({
  gameState,
  gameStateRef,
  gameLoop,
  lastFrameTimeRef,
  canvasRef,
  keysPressed,
  difficulty,
  isPageVisible,
  WINNING_SCORE,
  setUserScore,
  setComputerScore,
  setGameState
}: UseGameLoopProps) => {
  useEffect(() => {
    if (!gameState.gameStarted || gameState.gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const runGameLoop = (timestamp: number) => {
      if (!gameStateRef.current) return;
      
      // Calculate delta time for smooth animation regardless of frame rate
      const deltaTime = lastFrameTimeRef.current ? (timestamp - lastFrameTimeRef.current) / 1000 : 0.016;
      lastFrameTimeRef.current = timestamp;
      
      // Only update game state if the page is visible or we want background updates
      const shouldUpdate = isPageVisible || true; // Always update for accurate timer
      
      if (shouldUpdate) {
        // Apply keyboard inputs
        gameStateRef.current.player.movingLeft = keysPressed.current.ArrowLeft;
        gameStateRef.current.player.movingRight = keysPressed.current.ArrowRight;
        
        // Update game state
        updateGameState(gameStateRef.current, deltaTime, difficulty);
        
        // Update scores
        if (gameStateRef.current.scoreChanged) {
          setUserScore(gameStateRef.current.userScore);
          setComputerScore(gameStateRef.current.computerScore);
          gameStateRef.current.scoreChanged = false;
          
          // Check for game over
          if (gameStateRef.current.userScore >= WINNING_SCORE || 
              gameStateRef.current.computerScore >= WINNING_SCORE) {
            setGameState({
              ...gameState,
              gameOver: true,
              gameWon: gameStateRef.current.userScore >= WINNING_SCORE
            });
            return;
          }
        }
      }
      
      // Always draw if visible
      if (isPageVisible) {
        drawGame(ctx, gameStateRef.current);
      }
      
      // Continue loop
      gameLoop.current = requestAnimationFrame(runGameLoop);
    };
    
    gameLoop.current = requestAnimationFrame(runGameLoop);
    
    // Cleanup function
    return () => {
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
    };
  }, [
    gameState, 
    gameStateRef, 
    lastFrameTimeRef, 
    canvasRef, 
    keysPressed, 
    difficulty, 
    isPageVisible, 
    WINNING_SCORE, 
    setUserScore, 
    setComputerScore, 
    setGameState,
    gameLoop
  ]);
};
