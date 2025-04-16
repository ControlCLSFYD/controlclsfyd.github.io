
import React, { useRef, useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import { BaseGameProps } from '../interfaces/GameInterfaces';
import GameResult from './GameResult';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
import useSpacewarGame from '../hooks/useSpacewarGame';

interface SpacewarGameProps extends BaseGameProps {}

const SpacewarGame: React.FC<SpacewarGameProps> = ({ 
  onGameComplete, 
  onPlayAgain, 
  difficulty = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const [hasWonBefore, setHasWonBefore] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);
  
  const { 
    userScore,
    computerScore,
    gameState,
    showInstructions,
    canvasWidth,
    canvasHeight,
    WINNING_SCORE,
    handleLeftButton,
    handleRightButton,
    handleButtonUp,
    handleContinue,
    resetGame
  } = useSpacewarGame({ 
    canvasRef, 
    difficulty: currentDifficulty, 
    onGameComplete 
  });

  useEffect(() => {
    // Set hasWonBefore to true if the player has won
    if (gameState.gameWon && !hasWonBefore) {
      setHasWonBefore(true);
    }
  }, [gameState.gameWon, hasWonBefore]);

  const handlePlayAgain = () => {
    // Only increase difficulty if player has won at least once
    if (gameState.gameWon) {
      setCurrentDifficulty(prev => Math.min(prev + 1, 5));
    }
    resetGame();
    onPlayAgain();
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <GameInfo 
        showInstructions={showInstructions}
        winningScore={WINNING_SCORE}
        userScore={userScore}
        computerScore={computerScore}
        difficulty={currentDifficulty}
      />
      
      <div className="border border-terminal-green">
        <canvas 
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="bg-black"
        />
      </div>
      
      {gameState.gameOver && (
        <GameResult 
          gameWon={gameState.gameWon}
          onContinue={handleContinue}
          onPlayAgain={handlePlayAgain}
          alwaysShowContinue={hasWonBefore}
        />
      )}
      
      {isMobile && (
        <GameControls
          handleLeftButton={handleLeftButton}
          handleRightButton={handleRightButton}
          handleButtonUp={handleButtonUp}
        />
      )}
    </div>
  );
};

export default SpacewarGame;
