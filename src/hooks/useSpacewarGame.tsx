
import { useState, useEffect, useRef, useCallback } from 'react';
import { initializeGame } from '../utils/spacewarGameUtils';
import { GameState } from '../interfaces/GameInterfaces';
import { UseSpacewarGameProps, UseSpacewarGameReturn, GameStateRef } from './spacewar/types';
import { useGameControls } from './spacewar/useGameControls';
import { useKeyboardEvents } from './spacewar/useKeyboardEvents';
import { useGameLoop } from './spacewar/useGameLoop';
import { useGameInitialization } from './spacewar/useGameInitialization';

const useSpacewarGame = ({ 
  canvasRef, 
  difficulty = 1, 
  onGameComplete,
  isPageVisible = true
}: UseSpacewarGameProps): UseSpacewarGameReturn => {
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
  const gameStateRef = useRef<GameStateRef | null>(null);
  
  // Initialize game state
  useGameInitialization({ canvasRef, gameStateRef, difficulty });
  
  // Setup keyboard event listeners
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

  useKeyboardEvents({
    keysPressed,
    showInstructions,
    gameState,
    setShowInstructions,
    setGameState,
    handleContinue
  });
  
  // Game loop
  useGameLoop({
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
  });
  
  // Touch controls for mobile
  const { handleLeftButton, handleRightButton, handleButtonUp } = useGameControls({ keysPressed });
  
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
  }, [difficulty, canvasRef]);
  
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
