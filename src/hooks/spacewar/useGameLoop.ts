
import { useEffect, MutableRefObject } from 'react';
import { updateGameState } from '../../utils/spacewarGameUtils';
import { drawGame } from '../../utils/spacewarRenderer';
import { updateStars } from '../../utils/spacewar/environment';
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
    if (!ctx || !gameStateRef.current) return;
    
    const runGameLoop = (timestamp: number) => {
      if (!gameStateRef.current) return;
      
      // Calculate delta time for smooth animation regardless of frame rate
      // Cap delta time to avoid huge jumps if browser tab was inactive
      const deltaTime = Math.min(
        lastFrameTimeRef.current ? (timestamp - lastFrameTimeRef.current) / 1000 : 0.016,
        0.1 // Maximum delta time of 100ms
      );
      lastFrameTimeRef.current = timestamp;
      
      // Only update game state if the page is visible or we want background updates
      const shouldUpdate = isPageVisible || true; // Always update for accurate timer
      
      if (shouldUpdate) {
        // Apply keyboard inputs
        gameStateRef.current.player.movingLeft = keysPressed.current.ArrowLeft;
        gameStateRef.current.player.movingRight = keysPressed.current.ArrowRight;
        
        // Update game state
        updateGameState(gameStateRef.current, deltaTime, difficulty);
        
        // Update stars for twinkling effect
        updateStars(gameStateRef.current.stars, deltaTime);
        
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
      if (isPageVisible && ctx) {
        drawGame(ctx, gameStateRef.current);
      }
      
      // Continue loop
      gameLoop.current = requestAnimationFrame(runGameLoop);
    };
    
    // Start the game loop
    gameLoop.current = requestAnimationFrame(runGameLoop);
    
    // Clean up on unmount or when dependencies change
    return () => {
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
        gameLoop.current = null;
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
