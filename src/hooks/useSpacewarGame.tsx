
import { useState, useEffect, useRef, useCallback } from 'react';
import { initializeGame, updateGameState } from '../utils/spacewarGameUtils';
import { drawGame } from '../utils/spacewarRenderer';
import { GameState } from '../interfaces/GameInterfaces';

interface UseSpacewarGameProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  difficulty?: number;
  onGameComplete?: () => void;
  isPageVisible?: boolean;
}

const useSpacewarGame = ({ 
  canvasRef, 
  difficulty = 1, 
  onGameComplete,
  isPageVisible = true
}: UseSpacewarGameProps) => {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    gameStarted: false,
    gameOver: false,
    gameWon: false,
    score: 0
  });
  
  // Game settings
  const [showInstructions, setShowInstructions] = useState(true);
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const WINNING_SCORE = 5;
  
  // Canvas dimensions
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Game loop and controls
  const gameLoop = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const keysPressed = useRef<{[key: string]: boolean}>({
    ArrowLeft: false,
    ArrowRight: false
  });
  const gameStateRef = useRef<any>(null);
  
  // Initialize game state
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        gameStateRef.current = initializeGame(canvas.width, canvas.height, difficulty);
        drawGame(ctx, gameStateRef.current);
      }
    }
  }, [canvasRef, difficulty]);
  
  // Game loop
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
  }, [gameState.gameStarted, gameState.gameOver, difficulty, canvasRef, isPageVisible]);
  
  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [showInstructions, gameState]);
  
  // Touch controls for mobile
  const handleLeftButton = useCallback(() => {
    keysPressed.current.ArrowLeft = true;
    keysPressed.current.ArrowRight = false;
  }, []);
  
  const handleRightButton = useCallback(() => {
    keysPressed.current.ArrowRight = true;
    keysPressed.current.ArrowLeft = false;
  }, []);
  
  const handleButtonUp = useCallback(() => {
    keysPressed.current.ArrowLeft = false;
    keysPressed.current.ArrowRight = false;
  }, []);
  
  // Continue after game over
  const handleContinue = useCallback(() => {
    if (gameState.gameWon && onGameComplete) {
      onGameComplete();
    }
    
    // Reset game state
    setGameState({
      gameStarted: false,
      gameOver: false,
      gameWon: false,
      score: 0
    });
    
    setShowInstructions(true);
    setUserScore(0);
    setComputerScore(0);
    
    // Reset game
    if (gameStateRef.current) {
      gameStateRef.current.userScore = 0;
      gameStateRef.current.computerScore = 0;
    }
  }, [gameState.gameWon, onGameComplete]);
  
  // Reset game
  const resetGame = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      gameStateRef.current = initializeGame(canvas.width, canvas.height, difficulty);
      
      setGameState({
        gameStarted: false,
        gameOver: false,
        gameWon: false,
        score: 0
      });
      
      setShowInstructions(true);
      setUserScore(0);
      setComputerScore(0);
    }
  }, [difficulty]);
  
  return {
    gameState,
    userScore,
    computerScore,
    showInstructions,
    canvasWidth,
    canvasHeight,
    WINNING_SCORE,
    handleLeftButton,
    handleRightButton,
    handleButtonUp,
    handleContinue,
    resetGame
  };
};

export default useSpacewarGame;
