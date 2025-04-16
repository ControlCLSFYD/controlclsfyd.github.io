
import React, { useEffect, useRef, useState } from 'react';
import { BaseGameProps, GameState } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';
import { useSpaceWarGame } from '../hooks/useSpaceWarGame';
import MobileControls from './game/MobileControls';
import { useIsMobile } from '../hooks/use-mobile'; // Changed from useMobile to useIsMobile

const SpaceWarGame: React.FC<BaseGameProps> = ({ 
  onGameComplete, 
  onPlayAgain,
  difficulty = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile(); // Changed from useMobile to useIsMobile
  
  const [gameState, setGameState] = useState<GameState>({
    gameStarted: false,
    gameOver: false,
    gameWon: false,
    score: 0
  });

  // Use our custom hook to handle the game logic
  const {
    playerScore,
    cpuScore,
    isRunning,
    isGameOver,
    playerWon,
    handleStartGame,
    handleRestartGame,
    handleMobileControl,
  } = useSpaceWarGame({
    canvasRef,
    containerRef,
    difficulty,
    onWin: () => {
      setGameState({
        gameStarted: false,
        gameOver: true,
        gameWon: true,
        score: playerScore
      });
    },
    onLose: () => {
      setGameState({
        gameStarted: false,
        gameOver: true,
        gameWon: false,
        score: playerScore
      });
    }
  });

  // Start the game on component mount
  useEffect(() => {
    if (!gameState.gameStarted && !gameState.gameOver) {
      handleStartGame();
      setGameState(prev => ({ ...prev, gameStarted: true }));
    }
  }, []);

  const handleContinue = () => {
    onGameComplete();
  };

  const handlePlayAgain = () => {
    setGameState({
      gameStarted: true,
      gameOver: false,
      gameWon: false,
      score: 0
    });
    handleRestartGame();
    onPlayAgain(gameState.gameWon);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center bg-terminal-black"
      style={{ minHeight: '70vh' }}
    >
      <div className="absolute top-2 left-2 right-2 flex justify-between text-terminal-green text-lg z-10">
        <div>Player: {playerScore}</div>
        <div>CPU: {cpuScore}</div>
      </div>
      
      <canvas 
        ref={canvasRef}
        className="w-full h-full max-w-2xl rounded-md border border-terminal-green"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      />
      
      {isMobile && isRunning && (
        <MobileControls 
          onDirectionPress={handleMobileControl}
        />
      )}

      {/* Show game result when game is over */}
      {gameState.gameOver && (
        <GameResult 
          gameWon={gameState.gameWon}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default SpaceWarGame;
